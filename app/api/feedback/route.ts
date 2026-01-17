import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, wasHelpful } = body

    if (!sessionId || typeof wasHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Update the first result (top match) with feedback
    await sql`
      UPDATE results
      SET was_helpful = ${wasHelpful}
      WHERE session_id = ${sessionId}
      AND match_rank = 1
    `

    return NextResponse.json({
      message: 'Feedback saved successfully',
    })
  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
