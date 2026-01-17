import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'

export async function GET(request: NextRequest) {
  try {
    const sql = getDb()

    // 1. General stats
    const generalStats = await sql`
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN questionnaire_version = 'v1' THEN 1 END) as v1_sessions,
        COUNT(CASE WHEN questionnaire_version = 'v2' THEN 1 END) as v2_sessions,
        COUNT(CASE WHEN questionnaire_version = 'debate' THEN 1 END) as debate_sessions
      FROM sessions
    `

    // 2. Sessions by province
    const byProvince = await sql`
      SELECT
        province,
        COUNT(*) as count
      FROM sessions
      WHERE is_completed = true AND province IS NOT NULL
      GROUP BY province
      ORDER BY count DESC
    `

    // 3. Sessions by age range
    const byAgeRange = await sql`
      SELECT
        age_range,
        COUNT(*) as count
      FROM sessions
      WHERE is_completed = true AND age_range IS NOT NULL
      GROUP BY age_range
      ORDER BY
        CASE age_range
          WHEN '18-25' THEN 1
          WHEN '26-35' THEN 2
          WHEN '36-45' THEN 3
          WHEN '46-55' THEN 4
          WHEN '56-65' THEN 5
          WHEN '65+' THEN 6
          ELSE 7
        END
    `

    // 4. Sessions by gender
    const byGender = await sql`
      SELECT
        gender,
        COUNT(*) as count
      FROM sessions
      WHERE is_completed = true AND gender IS NOT NULL
      GROUP BY gender
      ORDER BY count DESC
    `

    // 5. Prior vote intention
    const byVoteIntention = await sql`
      SELECT
        prior_vote_intention as intention,
        COUNT(*) as count
      FROM sessions
      WHERE is_completed = true AND prior_vote_intention IS NOT NULL
      GROUP BY prior_vote_intention
      ORDER BY count DESC
    `

    // 6. Top candidates (most frequently ranked #1)
    const topCandidates = await sql`
      SELECT
        c.party_code as "partyCode",
        c.party_name as "partyName",
        c.candidate_name as "candidateName",
        c.color_primary as "colorPrimary",
        COUNT(*) as times_top1,
        ROUND(AVG(r.affinity_percentage)::numeric, 1) as avg_affinity
      FROM results r
      JOIN candidates c ON r.candidate_id = c.id
      WHERE r.match_rank = 1
      GROUP BY c.id, c.party_code, c.party_name, c.candidate_name, c.color_primary
      ORDER BY times_top1 DESC
      LIMIT 10
    `

    // 7. All candidates ranked distribution
    const candidateDistribution = await sql`
      SELECT
        c.party_code as "partyCode",
        c.party_name as "partyName",
        c.candidate_name as "candidateName",
        c.color_primary as "colorPrimary",
        COUNT(CASE WHEN r.match_rank = 1 THEN 1 END) as rank1,
        COUNT(CASE WHEN r.match_rank = 2 THEN 1 END) as rank2,
        COUNT(CASE WHEN r.match_rank = 3 THEN 1 END) as rank3,
        COUNT(*) as total_appearances
      FROM candidates c
      LEFT JOIN results r ON c.id = r.candidate_id
      WHERE c.is_active = true
      GROUP BY c.id, c.party_code, c.party_name, c.candidate_name, c.color_primary
      ORDER BY rank1 DESC, rank2 DESC, rank3 DESC
    `

    // 8. Feedback stats
    const feedbackStats = await sql`
      SELECT
        COUNT(CASE WHEN was_helpful = true THEN 1 END) as helpful,
        COUNT(CASE WHEN was_helpful = false THEN 1 END) as not_helpful,
        COUNT(CASE WHEN was_helpful IS NULL THEN 1 END) as no_response
      FROM results
    `

    // 9. Sessions over time (last 30 days)
    const sessionsOverTime = await sql`
      SELECT
        DATE(started_at) as date,
        COUNT(*) as count
      FROM sessions
      WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
        AND is_completed = true
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `

    // 10. Top candidates by province
    const topByProvince = await sql`
      SELECT
        s.province,
        c.party_code as "partyCode",
        c.candidate_name as "candidateName",
        COUNT(*) as count
      FROM results r
      JOIN sessions s ON r.session_id = s.id
      JOIN candidates c ON r.candidate_id = c.id
      WHERE r.match_rank = 1
        AND s.province IS NOT NULL
        AND s.is_completed = true
      GROUP BY s.province, c.party_code, c.candidate_name
      ORDER BY s.province, count DESC
    `

    // Process top by province to get #1 per province
    const topCandidateByProvince: Record<string, { partyCode: string; candidateName: string; count: number }> = {}
    for (const row of topByProvince) {
      if (!topCandidateByProvince[row.province]) {
        topCandidateByProvince[row.province] = {
          partyCode: row.partyCode,
          candidateName: row.candidateName,
          count: Number(row.count)
        }
      }
    }

    return NextResponse.json({
      general: {
        totalSessions: Number(generalStats[0].total_sessions),
        completedSessions: Number(generalStats[0].completed_sessions),
        completionRate: generalStats[0].total_sessions > 0
          ? Math.round((Number(generalStats[0].completed_sessions) / Number(generalStats[0].total_sessions)) * 100)
          : 0,
        byVersion: {
          v1: Number(generalStats[0].v1_sessions),
          v2: Number(generalStats[0].v2_sessions),
          debate: Number(generalStats[0].debate_sessions),
        }
      },
      demographics: {
        byProvince: byProvince.map(r => ({ province: r.province, count: Number(r.count) })),
        byAgeRange: byAgeRange.map(r => ({ ageRange: r.age_range, count: Number(r.count) })),
        byGender: byGender.map(r => ({ gender: r.gender, count: Number(r.count) })),
        byVoteIntention: byVoteIntention.map(r => ({ intention: r.intention, count: Number(r.count) })),
      },
      candidates: {
        topCandidates: topCandidates.map(r => ({
          partyCode: r.partyCode,
          partyName: r.partyName,
          candidateName: r.candidateName,
          colorPrimary: r.colorPrimary,
          timesTop1: Number(r.times_top1),
          avgAffinity: Number(r.avg_affinity),
        })),
        distribution: candidateDistribution.map(r => ({
          partyCode: r.partyCode,
          partyName: r.partyName,
          candidateName: r.candidateName,
          colorPrimary: r.colorPrimary,
          rank1: Number(r.rank1),
          rank2: Number(r.rank2),
          rank3: Number(r.rank3),
          totalAppearances: Number(r.total_appearances),
        })),
        topByProvince: topCandidateByProvince,
      },
      feedback: {
        helpful: Number(feedbackStats[0].helpful),
        notHelpful: Number(feedbackStats[0].not_helpful),
        noResponse: Number(feedbackStats[0].no_response),
      },
      activity: {
        last30Days: sessionsOverTime.map(r => ({
          date: r.date,
          count: Number(r.count),
        })),
      },
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
