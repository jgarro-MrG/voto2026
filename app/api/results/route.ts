import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'
import { processQuizResponses } from '@/lib/matching-algorithm'
import { Candidate, UserResponse, DimensionScores, DimensionWeights } from '@/lib/types'

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

    // 1. Get session with dimension weights
    const sessionResult = await sql`
      SELECT id, is_completed, dimension_weights FROM sessions WHERE id = ${sessionId}
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

    // Parse dimension weights if present
    const dimensionWeights: DimensionWeights | undefined = session.dimension_weights
      ? (typeof session.dimension_weights === 'string'
          ? JSON.parse(session.dimension_weights)
          : session.dimension_weights)
      : undefined

    // 2. Get responses
    const responsesResult = await sql`
      SELECT question_id, dimension, score
      FROM responses
      WHERE session_id = ${sessionId}
    `

    if (responsesResult.length === 0) {
      return NextResponse.json(
        { error: 'No responses found for this session' },
        { status: 404 }
      )
    }

    const responses: UserResponse[] = responsesResult.map((r: any) => ({
      questionId: r.question_id,
      dimension: r.dimension as keyof DimensionScores,
      score: Number(r.score),
    }))

    // 3. Get all active candidates
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

    // 4. Calculate matching using algorithm (with dimension weights if provided)
    const { userScores, allMatches, top3 } = processQuizResponses(
      responses,
      candidates,
      dimensionWeights
    )

    // 5. Save user scores to session
    await sql`
      UPDATE sessions
      SET
        score_security = ${userScores.security},
        score_economy = ${userScores.economy},
        score_education = ${userScores.education},
        score_health = ${userScores.health},
        score_agriculture = ${userScores.agriculture},
        score_environment = ${userScores.environment},
        score_reforms = ${userScores.reforms},
        score_social = ${userScores.social}
      WHERE id = ${sessionId}
    `

    // 6. Save top 3 results
    for (let i = 0; i < top3.length; i++) {
      const match = top3[i]
      await sql`
        INSERT INTO results (
          session_id,
          candidate_id,
          affinity_percentage,
          match_rank
        ) VALUES (
          ${sessionId},
          ${match.candidate.id},
          ${match.affinityPercentage},
          ${i + 1}
        )
        ON CONFLICT (session_id, candidate_id)
        DO UPDATE SET
          affinity_percentage = EXCLUDED.affinity_percentage,
          match_rank = EXCLUDED.match_rank
      `
    }

    return NextResponse.json({
      userScores,
      top3,
      allMatches,
      message: 'Results calculated successfully',
    })
  } catch (error) {
    console.error('Error calculating results:', error)
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

    // Get session with scores
    const sessionResult = await sql`
      SELECT
        id,
        score_security,
        score_economy,
        score_education,
        score_health,
        score_agriculture,
        score_environment,
        score_reforms,
        score_social
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

    if (!session.score_security) {
      return NextResponse.json(
        { error: 'Results not yet calculated for this session' },
        { status: 404 }
      )
    }

    const userScores: DimensionScores = {
      security: Number(session.score_security),
      economy: Number(session.score_economy),
      education: Number(session.score_education),
      health: Number(session.score_health),
      agriculture: Number(session.score_agriculture),
      environment: Number(session.score_environment),
      reforms: Number(session.score_reforms),
      social: Number(session.score_social),
    }

    // Get results with candidate info
    const resultsData = await sql`
      SELECT
        r.affinity_percentage,
        r.match_rank,
        c.id,
        c.party_code as "partyCode",
        c.party_name as "partyName",
        c.candidate_name as "candidateName",
        c.candidate_photo_url as "candidatePhotoUrl",
        c.party_logo_url as "partyLogoUrl",
        c.slogan,
        c.color_primary as "colorPrimary",
        c.color_secondary as "colorSecondary",
        c.score_security,
        c.score_economy,
        c.score_education,
        c.score_health,
        c.score_agriculture,
        c.score_environment,
        c.score_reforms,
        c.score_social,
        c.plan_summary as "planSummary"
      FROM results r
      JOIN candidates c ON r.candidate_id = c.id
      WHERE r.session_id = ${sessionId}
      ORDER BY r.match_rank ASC
    `

    const top3 = resultsData.map((r: any) => ({
      candidate: {
        id: r.id,
        partyCode: r.partyCode,
        partyName: r.partyName,
        candidateName: r.candidateName,
        candidatePhoto: r.candidatePhotoUrl,
        partyLogo: r.partyLogoUrl,
        slogan: r.slogan,
        colorPrimary: r.colorPrimary,
        colorSecondary: r.colorSecondary,
        scores: {
          security: Number(r.score_security),
          economy: Number(r.score_economy),
          education: Number(r.score_education),
          health: Number(r.score_health),
          agriculture: Number(r.score_agriculture),
          environment: Number(r.score_environment),
          reforms: Number(r.score_reforms),
          social: Number(r.score_social),
        },
        planSummary: r.planSummary,
        isActive: true,
      },
      affinityPercentage: Number(r.affinity_percentage),
      distance: 0, // Not stored in DB
      dimensionMatches: {}, // Would need to recalculate
    }))

    return NextResponse.json({
      userScores,
      top3,
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
