/**
 * Consolida todos los análisis individuales en un archivo all-analyses.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface CandidateAnalysis {
  party: string
  candidate: string
  overallSummary: string
  dimensions: any[]
  generatedAt: string
}

export function consolidateAnalyses(): CandidateAnalysis[] {
  const analysisDir = join(process.cwd(), 'docs', 'analisis-candidatos')

  console.log('\n📊 Consolidando análisis...\n')

  // Leer todos los archivos JSON excepto all-analyses.json
  const files = readdirSync(analysisDir)
    .filter(f => f.endsWith('.json') && f !== 'all-analyses.json' && f !== 'analysis-queue.json')

  const analyses: CandidateAnalysis[] = []

  for (const file of files) {
    const filePath = join(analysisDir, file)
    const content = readFileSync(filePath, 'utf-8')
    const analysis = JSON.parse(content)
    analyses.push(analysis)

    console.log(`✓ ${analysis.party} - ${analysis.candidate}`)
  }

  // Ordenar por partido
  analyses.sort((a, b) => a.party.localeCompare(b.party))

  // Guardar archivo consolidado
  const outputPath = join(analysisDir, 'all-analyses.json')
  writeFileSync(outputPath, JSON.stringify(analyses, null, 2), 'utf-8')

  console.log(`\n========================================`)
  console.log(`  CONSOLIDACIÓN COMPLETADA`)
  console.log(`========================================`)
  console.log(`Total análisis: ${analyses.length}`)
  console.log(`Archivo: ${outputPath}`)

  // Mostrar resumen por postura ideológica
  const stanceCounts: Record<string, number> = {
    progressive: 0,
    moderate: 0,
    conservative: 0
  }

  for (const analysis of analyses) {
    // Contar posturas predominantes
    const stances = analysis.dimensions
      .map((d: any) => d.stance)
      .filter((s: string) => s !== 'not_mentioned')

    const progressiveCount = stances.filter((s: string) => s === 'progressive').length
    const moderateCount = stances.filter((s: string) => s === 'moderate').length
    const conservativeCount = stances.filter((s: string) => s === 'conservative').length

    // Asignar postura predominante
    if (progressiveCount > moderateCount && progressiveCount > conservativeCount) {
      stanceCounts.progressive++
    } else if (conservativeCount > moderateCount && conservativeCount > progressiveCount) {
      stanceCounts.conservative++
    } else {
      stanceCounts.moderate++
    }
  }

  console.log(`\n📈 Distribución ideológica:`)
  console.log(`   Progresistas: ${stanceCounts.progressive}`)
  console.log(`   Moderados: ${stanceCounts.moderate}`)
  console.log(`   Conservadores: ${stanceCounts.conservative}`)

  return analyses
}

// Ejecutar si se llama directamente
if (require.main === module) {
  consolidateAnalyses()
}
