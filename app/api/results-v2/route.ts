import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'
import {
  processQuizResponsesV2,
  UserResponseV2,
  CandidateScoreV2
} from '@/lib/matching-algorithm-v2'
import { Candidate } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // 1. Get session with V2 responses
    const sessionResult = await sql`
      SELECT id, is_completed, responses_v2, questionnaire_version
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const session = sessionResult[0]

    if (!session.is_completed) {
      return NextResponse.json(
        { error: 'Session is not completed' },
        { status: 400 }
      )
    }

    if (!session.responses_v2) {
      return NextResponse.json(
        { error: 'No V2 responses found for this session' },
        { status: 404 }
      )
    }

    // Parse responses
    const responses: UserResponseV2[] = typeof session.responses_v2 === 'string'
      ? JSON.parse(session.responses_v2)
      : session.responses_v2

    // 2. Get all active candidates
    const candidatesResult = await sql`
      SELECT
        id,
        party_code as "partyCode",
        party_name as "partyName",
        candidate_name as "candidateName",
        candidate_photo_url as "candidatePhotoUrl",
        party_logo_url as "partyLogoUrl",
        slogan,
        color_primary as "colorPrimary",
        color_secondary as "colorSecondary",
        score_security,
        score_economy,
        score_education,
        score_health,
        score_agriculture,
        score_environment,
        score_reforms,
        score_social,
        plan_summary as "planSummary"
      FROM candidates
      WHERE is_active = true
    `

    const candidates: Candidate[] = candidatesResult.map((c: any) => ({
      id: c.id,
      partyCode: c.partyCode,
      partyName: c.partyName,
      candidateName: c.candidateName,
      candidatePhoto: c.candidatePhotoUrl,
      partyLogo: c.partyLogoUrl,
      slogan: c.slogan,
      colorPrimary: c.colorPrimary,
      colorSecondary: c.colorSecondary,
      scores: {
        security: Number(c.score_security),
        economy: Number(c.score_economy),
        education: Number(c.score_education),
        health: Number(c.score_health),
        agriculture: Number(c.score_agriculture),
        environment: Number(c.score_environment),
        reforms: Number(c.score_reforms),
        social: Number(c.score_social),
      },
      planSummary: c.planSummary,
      isActive: true,
    }))

    // 3. Calculate matching using V2 algorithm
    const result = processQuizResponsesV2(responses, candidates)

    // 4. Save results as JSON in session (for V2 we store complete results)
    const resultsJson = JSON.stringify({
      rankings: result.rankings.map(r => ({
        candidateId: r.candidate.id,
        partyCode: r.candidate.partyCode,
        totalPoints: r.totalPoints,
        maxPossiblePoints: r.maxPossiblePoints,
        percentage: r.percentage,
        dimensionBreakdown: r.dimensionBreakdown,
        matchingProposalsCount: r.matchingProposals.length
      })),
      userProfile: result.userProfile,
      totalQuestionsAnswered: result.totalQuestionsAnswered,
      totalOptionsSelected: result.totalOptionsSelected
    })

    await sql`
      UPDATE sessions
      SET results_v2 = ${resultsJson}::jsonb
      WHERE id = ${sessionId}
    `

    // 5. Also save top 3 to results table for compatibility
    for (let i = 0; i < result.top3.length; i++) {
      const match = result.top3[i]
      await sql`
        INSERT INTO results (
          session_id,
          candidate_id,
          affinity_percentage,
          match_rank
        ) VALUES (
          ${sessionId},
          ${match.candidate.id},
          ${match.percentage},
          ${i + 1}
        )
        ON CONFLICT (session_id, candidate_id)
        DO UPDATE SET
          affinity_percentage = EXCLUDED.affinity_percentage,
          match_rank = EXCLUDED.match_rank
      `
    }

    return NextResponse.json({
      rankings: result.rankings,
      top3: result.top3,
      userProfile: result.userProfile,
      validation: result.validation,
      totalQuestionsAnswered: result.totalQuestionsAnswered,
      totalOptionsSelected: result.totalOptionsSelected,
      message: 'Results calculated successfully',
    })
  } catch (error) {
    console.error('Error calculating V2 results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Get session with V2 results and responses
    const sessionResult = await sql`
      SELECT
        id,
        responses_v2,
        results_v2,
        questionnaire_version
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const session = sessionResult[0]

    if (!session.results_v2) {
      return NextResponse.json(
        { error: 'Results not yet calculated for this session' },
        { status: 404 }
      )
    }

    // Parse stored results
    const storedResults = typeof session.results_v2 === 'string'
      ? JSON.parse(session.results_v2)
      : session.results_v2

    // Get candidate details for the rankings
    const candidatesResult = await sql`
      SELECT
        id,
        party_code as "partyCode",
        party_name as "partyName",
        candidate_name as "candidateName",
        candidate_photo_url as "candidatePhotoUrl",
        party_logo_url as "partyLogoUrl",
        slogan,
        color_primary as "colorPrimary",
        color_secondary as "colorSecondary",
        plan_summary as "planSummary"
      FROM candidates
      WHERE is_active = true
    `

    const candidatesMap = new Map(
      candidatesResult.map((c: any) => [c.id, c])
    )

    // Reconstruct rankings with full candidate data
    const rankings = storedResults.rankings.map((r: any) => {
      const candidate = candidatesMap.get(r.candidateId)
      return {
        candidate: candidate ? {
          id: candidate.id,
          partyCode: candidate.partyCode,
          partyName: candidate.partyName,
          candidateName: candidate.candidateName,
          candidatePhoto: candidate.candidatePhotoUrl,
          partyLogo: candidate.partyLogoUrl,
          slogan: candidate.slogan,
          colorPrimary: candidate.colorPrimary,
          colorSecondary: candidate.colorSecondary,
          planSummary: candidate.planSummary,
          isActive: true,
        } : null,
        totalPoints: r.totalPoints,
        maxPossiblePoints: r.maxPossiblePoints,
        percentage: r.percentage,
        dimensionBreakdown: r.dimensionBreakdown,
        matchingProposalsCount: r.matchingProposalsCount
      }
    }).filter((r: any) => r.candidate !== null)

    return NextResponse.json({
      rankings,
      top3: rankings.slice(0, 3),
      userProfile: storedResults.userProfile,
      totalQuestionsAnswered: storedResults.totalQuestionsAnswered,
      totalOptionsSelected: storedResults.totalOptionsSelected,
    })
  } catch (error) {
    console.error('Error fetching V2 results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
