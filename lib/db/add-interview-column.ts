import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { neon } from '@neondatabase/serverless'

async function addInterviewColumn() {
  console.log('🔧 Agregando columna interview_url a la tabla candidates...\n')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)

  try {
    await sql`
      ALTER TABLE candidates
      ADD COLUMN IF NOT EXISTS interview_url TEXT
    `

    console.log('✅ Columna interview_url agregada exitosamente\n')
  } catch (error) {
    console.error('❌ Error al agregar columna:', error)
    throw error
  }
}

addInterviewColumn().catch(console.error)
