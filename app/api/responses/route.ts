import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'
import { UserResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, responses } = body as {
      sessionId: string
      responses: UserResponse[]
    }

    // Validate
    if (!sessionId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    if (responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses provided' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Verify session exists
    const session = await sql`
      SELECT id FROM sessions WHERE id = ${sessionId}
    `

    if (session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Save each response
    for (const response of responses) {
      await sql`
        INSERT INTO responses (
          session_id,
          question_id,
          dimension,
          score
        ) VALUES (
          ${sessionId},
          ${response.questionId},
          ${response.dimension},
          ${response.score}
        )
        ON CONFLICT (session_id, question_id)
        DO UPDATE SET
          score = EXCLUDED.score,
          updated_at = CURRENT_TIMESTAMP
      `
    }

    // Mark session as completed
    await sql`
      UPDATE sessions
      SET is_completed = true, completed_at = CURRENT_TIMESTAMP
      WHERE id = ${sessionId}
    `

    return NextResponse.json({
      message: 'Responses saved successfully',
      count: responses.length,
    })
  } catch (error) {
    console.error('Error saving responses:', error)
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

    const responses = await sql`
      SELECT
        question_id,
        dimension,
        score
      FROM responses
      WHERE session_id = ${sessionId}
      ORDER BY question_id ASC
    `

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
