import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'
import { DebateResponse } from '@/lib/matching-algorithm-debate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, responses } = body as {
      sessionId: string
      responses: DebateResponse[]
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

    // Store debate responses as JSON in session
    const responsesJson = JSON.stringify(responses)

    await sql`
      UPDATE sessions
      SET
        responses_v2 = ${responsesJson}::jsonb,
        questionnaire_version = 'debate',
        is_completed = true,
        completed_at = CURRENT_TIMESTAMP
      WHERE id = ${sessionId}
    `

    return NextResponse.json({
      message: 'Responses saved successfully',
      count: responses.length,
    })
  } catch (error) {
    console.error('Error saving debate responses:', error)
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

    const sessionResult = await sql`
      SELECT responses_v2, questionnaire_version
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (sessionResult.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const responsesData = sessionResult[0].responses_v2

    if (!responsesData) {
      return NextResponse.json(
        { error: 'No debate responses found for this session' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      responses: typeof responsesData === 'string' ? JSON.parse(responsesData) : responsesData,
      version: sessionResult[0].questionnaire_version
    })
  } catch (error) {
    console.error('Error fetching debate responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
