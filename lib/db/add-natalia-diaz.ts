import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { neon } from '@neondatabase/serverless'

async function addNataliaDiaz() {
  console.log('👤 Agregando candidata Natalia Díaz Quintana (UP)...\n')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)

  try {
    // Datos del candidato 10 (ND/UP) del archivo original
    const candidate = {
      id: 10,
      partyCode: 'UP',
      partyName: 'PARTIDO UNIDOS PODEMOS',
      candidateName: 'NATALIA DIAZ QUINTANA',
      photoUrl: 'https://www.tse.go.cr/fichas/static/c27e4db60ccb171bcf284f8e51567b96/1d851/112260846.jpg',
      planUrl: 'https://www.tse.go.cr/fichas/static/6abb1b68e386dbac5c5fef53a5f47e40/241_1_112260846.pdf',
      interviewUrl: 'https://www.youtube.com/watch?v=1Mf3kzWgKaw',
      websiteUrl: 'https://www.tse.go.cr/2026/planesgobierno.html',
      slogan: 'El Siguiente Paso',
      colorPrimary: '#FF9800',
      colorSecondary: '#FFFFFF',
      scores: {
        security: 2.0,
        economy: 2.5,
        education: 3.0,
        health: 3.0,
        agriculture: 2.5,
        environment: 3.0,
        reforms: 2.5,
        social: 2.5,
      },
      planSummary: 'Continuidad gobierno actual. Seguridad firme, control migración, trabajo privados libertad, apoyo emprendedores PYMES, educación técnica, orden desarrollo, salud eficiente, gobierno territorial.',
      isActive: true,
    }

    await sql`
      INSERT INTO candidates (
        party_code,
        party_name,
        candidate_name,
        candidate_photo_url,
        party_logo_url,
        slogan,
        color_primary,
        color_secondary,
        website_url,
        plan_file_path,
        interview_url,
        score_security,
        score_economy,
        score_education,
        score_health,
        score_agriculture,
        score_environment,
        score_reforms,
        score_social,
        plan_summary,
        is_active
      ) VALUES (
        ${candidate.partyCode},
        ${candidate.partyName},
        ${candidate.candidateName},
        ${candidate.photoUrl},
        NULL,
        ${candidate.slogan},
        ${candidate.colorPrimary},
        ${candidate.colorSecondary},
        ${candidate.websiteUrl},
        ${candidate.planUrl},
        ${candidate.interviewUrl},
        ${candidate.scores.security},
        ${candidate.scores.economy},
        ${candidate.scores.education},
        ${candidate.scores.health},
        ${candidate.scores.agriculture},
        ${candidate.scores.environment},
        ${candidate.scores.reforms},
        ${candidate.scores.social},
        ${candidate.planSummary},
        ${candidate.isActive}
      )
      ON CONFLICT (party_code) DO UPDATE SET
        candidate_name = EXCLUDED.candidate_name,
        party_name = EXCLUDED.party_name,
        candidate_photo_url = EXCLUDED.candidate_photo_url,
        website_url = EXCLUDED.website_url,
        plan_file_path = EXCLUDED.plan_file_path,
        interview_url = EXCLUDED.interview_url
    `

    console.log('✅ Natalia Díaz Quintana (UP) agregada exitosamente\n')

    // Verificar total de candidatos
    const result = await sql`SELECT COUNT(*) as count FROM candidates WHERE is_active = true`
    console.log(`📊 Total de candidatos activos: ${result[0].count}\n`)
  } catch (error) {
    console.error('❌ Error al agregar candidata:', error)
    throw error
  }
}

addNataliaDiaz().catch(console.error)
