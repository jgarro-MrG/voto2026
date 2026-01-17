import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { demographics, dimensionWeights } = body

    // Support both new format (with demographics object) and legacy format (flat)
    const ageRange = demographics?.ageRange || body.ageRange
    const province = demographics?.province || body.province
    const gender = demographics?.gender || body.gender
    const priorVoteIntention = demographics?.priorVoteIntention || body.priorVoteIntention

    // Validate required fields
    if (!ageRange || !province || !gender || !priorVoteIntention) {
      return NextResponse.json(
        { error: 'Missing required demographic data' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Create new session with dimension weights
    const result = await sql`
      INSERT INTO sessions (
        age_range,
        province,
        gender,
        prior_vote_intention,
        dimension_weights,
        is_completed
      ) VALUES (
        ${ageRange},
        ${province},
        ${gender},
        ${priorVoteIntention},
        ${dimensionWeights ? JSON.stringify(dimensionWeights) : null},
        false
      )
      RETURNING id
    `

    const sessionId = result[0]?.id

    if (!sessionId) {
      throw new Error('Failed to create session')
    }

    return NextResponse.json({
      sessionId,
      message: 'Session created successfully',
    })
  } catch (error) {
    console.error('Error creating session:', error)
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

    const session = await sql`
      SELECT
        id,
        age_range,
        province,
        gender,
        prior_vote_intention,
        is_completed,
        created_at
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ session: session[0] })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
