import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { neon } from '@neondatabase/serverless'

async function addDimensionWeightsColumn() {
  console.log('🔧 Agregando columna dimension_weights a la tabla sessions...\n')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)

  try {
    await sql`
      ALTER TABLE sessions
      ADD COLUMN IF NOT EXISTS dimension_weights JSONB
    `

    console.log('✅ Columna dimension_weights agregada exitosamente\n')
    console.log('Esta columna almacenará los pesos/prioridades que el usuario asigna a cada dimensión.\n')
  } catch (error) {
    console.error('❌ Error al agregar columna:', error)
    throw error
  }
}

addDimensionWeightsColumn().catch(console.error)
