/**
 * Actualiza candidatos-data-oficial.json con los análisis generados por IA
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface CandidateData {
  id: number
  partyCode: string
  partyName: string
  candidateName: string
  photoUrl?: string
  planUrl?: string
  interviewUrl?: string
  websiteUrl?: string
  slogan: string
  colorPrimary: string
  colorSecondary: string
  scores: {
    security: number
    economy: number
    education: number
    health: number
    agriculture: number
    environment: number
    reforms: number
    social: number
  }
  planSummary: string
  isActive: boolean
}

interface DimensionAnalysis {
  dimension: string
  summary: string
  keyProposals: string[]
  stance: string
}

interface CandidateAnalysis {
  party: string
  candidate: string
  overallSummary: string
  dimensions: DimensionAnalysis[]
  generatedAt: string
}

/**
 * Genera un planSummary mejorado a partir del análisis de IA
 */
function generateEnhancedSummary(analysis: CandidateAnalysis): string {
  const { overallSummary, dimensions } = analysis

  // Comenzar con el resumen general
  let summary = `${overallSummary}\n\n`

  // Agregar las propuestas más relevantes por dimensión
  const mentionedDimensions = dimensions.filter(d => d.stance !== 'not_mentioned')

  if (mentionedDimensions.length > 0) {
    summary += 'Propuestas principales:\n\n'

    for (const dim of mentionedDimensions) {
      if (dim.keyProposals && dim.keyProposals.length > 0) {
        const dimensionName = getDimensionDisplayName(dim.dimension)
        summary += `**${dimensionName}**: ${dim.summary}\n`
        if (dim.keyProposals.length > 0) {
          summary += dim.keyProposals.map(p => `- ${p}`).join('\n') + '\n\n'
        }
      }
    }
  }

  return summary.trim()
}

/**
 * Obtiene el nombre display de una dimensión
 */
function getDimensionDisplayName(dimension: string): string {
  const names: Record<string, string> = {
    security: 'Seguridad y Justicia',
    economy: 'Economía y Empleo',
    education: 'Educación',
    health: 'Salud',
    agriculture: 'Sector Agropecuario',
    environment: 'Medio Ambiente',
    reforms: 'Reformas Institucionales',
    social: 'Política Social'
  }
  return names[dimension] || dimension
}

/**
 * Busca el análisis correspondiente a un candidato
 */
function findAnalysisForCandidate(
  analyses: CandidateAnalysis[],
  partyCode: string,
  candidateName: string
): CandidateAnalysis | null {
  // Normalizar nombres para comparación
  const normalizeName = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/\s+/g, '')

  const normalizedTargetName = normalizeName(candidateName)

  for (const analysis of analyses) {
    const normalizedAnalysisName = normalizeName(analysis.candidate)
    const normalizedAnalysisParty = analysis.party.toUpperCase()

    // Match por partido Y nombre
    if (
      normalizedAnalysisParty === partyCode &&
      (normalizedAnalysisName.includes(normalizedTargetName) ||
        normalizedTargetName.includes(normalizedAnalysisName))
    ) {
      return analysis
    }
  }

  return null
}

/**
 * Actualiza el archivo candidatos-data-oficial.json
 */
export function updateCandidatesWithAnalysis(): void {
  console.log('\n========================================')
  console.log('  ACTUALIZAR CANDIDATOS CON ANÁLISIS IA')
  console.log('========================================\n')

  // Rutas
  const candidatesPath = join(process.cwd(), 'lib', 'candidatos-data-oficial.json')
  const analysesPath = join(process.cwd(), 'docs', 'analisis-candidatos', 'all-analyses.json')
  const backupPath = join(
    process.cwd(),
    'lib',
    `candidatos-data-oficial.backup-${Date.now()}.json`
  )

  // Verificar que existan los análisis
  const fs = require('fs')
  if (!fs.existsSync(analysesPath)) {
    throw new Error(
      'No se encontraron análisis. Primero ejecuta: npm run analyze-transcripts'
    )
  }

  // Leer datos
  const candidatesFile = JSON.parse(readFileSync(candidatesPath, 'utf-8'))
  const candidates: CandidateData[] = candidatesFile.candidatos || candidatesFile
  const analyses: CandidateAnalysis[] = JSON.parse(readFileSync(analysesPath, 'utf-8'))

  console.log(`📊 Candidatos en JSON: ${candidates.length}`)
  console.log(`🤖 Análisis disponibles: ${analyses.length}\n`)

  // Crear backup
  writeFileSync(backupPath, JSON.stringify(candidates, null, 2), 'utf-8')
  console.log(`💾 Backup creado: ${backupPath}\n`)

  // Actualizar candidatos
  let updated = 0
  let notFound = 0

  for (const candidate of candidates) {
    const analysis = findAnalysisForCandidate(
      analyses,
      candidate.partyCode,
      candidate.candidateName
    )

    if (analysis) {
      const oldSummary = candidate.planSummary
      const newSummary = generateEnhancedSummary(analysis)

      candidate.planSummary = newSummary

      console.log(`✓ ${candidate.partyCode} - ${candidate.candidateName}`)
      console.log(`  Anterior: ${oldSummary.substring(0, 80)}...`)
      console.log(`  Nuevo: ${newSummary.substring(0, 80)}...`)
      console.log()

      updated++
    } else {
      console.log(`⚠ No se encontró análisis para: ${candidate.partyCode} - ${candidate.candidateName}`)
      notFound++
    }
  }

  // Guardar archivo actualizado (mantener estructura original)
  const output = candidatesFile.candidatos ? { candidatos: candidates } : candidates
  writeFileSync(candidatesPath, JSON.stringify(output, null, 2), 'utf-8')

  console.log('\n========================================')
  console.log('  RESUMEN')
  console.log('========================================')
  console.log(`Actualizados: ${updated}/${candidates.length}`)
  console.log(`No encontrados: ${notFound}`)
  console.log(`Archivo actualizado: ${candidatesPath}`)
  console.log(`Backup guardado: ${backupPath}`)

  if (updated > 0) {
    console.log('\n✅ Candidatos actualizados exitosamente')
    console.log('\n📌 Siguiente paso: Re-seed la base de datos')
    console.log('   npm run db:seed')
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  try {
    updateCandidatesWithAnalysis()
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}
