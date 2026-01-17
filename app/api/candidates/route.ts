import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/connection'

export async function GET(request: NextRequest) {
  try {
    const sql = getDb()

    const candidatesResult = await sql`
      SELECT
        id,
        party_code as "partyCode",
        party_name as "partyName",
        candidate_name as "candidateName",
        candidate_photo_url as "candidatePhoto",
        party_logo_url as "partyLogo",
        slogan,
        color_primary as "colorPrimary",
        color_secondary as "colorSecondary",
        is_active as "isActive"
      FROM candidates
      ORDER BY party_name ASC
    `

    return NextResponse.json({
      candidates: candidatesResult,
      count: candidatesResult.length,
    })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
