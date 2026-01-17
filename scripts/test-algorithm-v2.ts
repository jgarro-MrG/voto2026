/**
 * Script de prueba para el algoritmo V2
 *
 * Uso:
 *   npx ts-node scripts/test-algorithm-v2.ts
 *
 * O con bun:
 *   bun scripts/test-algorithm-v2.ts
 */

import { calculateMatchingV2, UserResponseV2, DIMENSION_WEIGHTS } from '../lib/matching-algorithm-v2'
import { QUESTIONS_V2 } from '../lib/questions-v2'
import candidatosData from '../lib/candidatos-data-oficial.json'
import { Candidate } from '../lib/types'

// ============================================
// DATOS DE PRUEBA - Respuestas del usuario
// Sesión: c814f104-bebe-4700-af22-172cc36a7bbf
// ============================================

const TEST_RESPONSES: UserResponseV2[] = [
  { questionId: 1, selectedOptions: ['sec-1b', 'sec-1d'] },      // Seguridad
  { questionId: 2, selectedOptions: ['eco-2a', 'eco-2b'] },      // Economía
  { questionId: 3, selectedOptions: ['edu-3a', 'edu-3b', 'edu-3c'] }, // Educación
  { questionId: 4, selectedOptions: ['sal-4d', 'sal-4a'] },      // Salud
  { questionId: 5, selectedOptions: ['agr-5c', 'agr-5d'] },      // Agricultura
  { questionId: 6, selectedOptions: ['amb-6b', 'amb-6a'] },      // Ambiente
  { questionId: 7, selectedOptions: ['ref-7a', 'ref-7c', 'ref-7d'] }, // Reformas
  { questionId: 8, selectedOptions: ['soc-8a', 'soc-8b'] },      // Social
  { questionId: 9, selectedOptions: ['lid-9a'] },                // Liderazgo (peso 3x)
  { questionId: 10, selectedOptions: ['exp-10c'] },              // Experiencia (peso 3x)
  { questionId: 11, selectedOptions: ['pri-11c'] },              // Prioridad (peso 3x)
]

// ============================================
// CONVERTIR CANDIDATOS AL FORMATO ESPERADO
// ============================================

function loadCandidates(): Candidate[] {
  return (candidatosData as any).candidatos.map((c: any) => ({
    id: c.id,
    partyCode: c.partyCode,
    partyName: c.partyName,
    candidateName: c.candidateName,
    candidatePhoto: c.candidatePhoto,
    partyLogo: c.partyLogo,
    slogan: c.slogan,
    colorPrimary: c.colorPrimary,
    colorSecondary: c.colorSecondary,
    scores: c.scores,
    planSummary: c.planSummary,
    isActive: c.isActive,
  }))
}

// ============================================
// EJECUTAR PRUEBA
// ============================================

function runTest() {
  console.log('='.repeat(60))
  console.log('PRUEBA DEL ALGORITMO V2 - Voto2026')
  console.log('='.repeat(60))
  console.log()

  // Mostrar configuración de pesos
  console.log('📊 CONFIGURACIÓN DE PESOS POR DIMENSIÓN:')
  console.log('-'.repeat(40))
  for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
    const indicator = weight > 1 ? `⭐ ${weight}x` : `   ${weight}x`
    console.log(`  ${indicator} ${dim}`)
  }
  console.log()

  // Mostrar respuestas del usuario
  console.log('📝 RESPUESTAS DEL USUARIO:')
  console.log('-'.repeat(40))
  for (const response of TEST_RESPONSES) {
    const question = QUESTIONS_V2.find(q => q.id === response.questionId)
    if (question) {
      const weight = DIMENSION_WEIGHTS[question.dimension] || 1
      const weightLabel = weight > 1 ? ` [${weight}x]` : ''
      console.log(`  Q${response.questionId} (${question.dimension}${weightLabel}):`)
      for (const optId of response.selectedOptions) {
        const option = question.options.find(o => o.id === optId)
        if (option) {
          console.log(`    ✓ ${option.text}`)
          console.log(`      → Candidatos: ${option.candidatos.join(', ')}`)
        }
      }
    }
  }
  console.log()

  // Cargar candidatos y ejecutar algoritmo
  const candidates = loadCandidates()
  console.log(`📊 Candidatos activos: ${candidates.filter(c => c.isActive).length}`)
  console.log()

  const result = calculateMatchingV2(TEST_RESPONSES, candidates)

  // Mostrar resultados
  console.log('🏆 RESULTADOS:')
  console.log('='.repeat(60))
  console.log(`  Total opciones seleccionadas: ${result.totalOptionsSelected}`)
  console.log(`  Máximo puntos ponderados: ${result.rankings[0]?.maxPossiblePoints}`)
  console.log()

  console.log('📈 RANKING DE CANDIDATOS:')
  console.log('-'.repeat(60))

  result.rankings.forEach((r, index) => {
    const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index + 1}.`
    const bar = '█'.repeat(Math.round(r.percentage / 5)) + '░'.repeat(20 - Math.round(r.percentage / 5))
    console.log(`  ${medal} ${r.candidate.partyCode.padEnd(6)} ${r.percentage.toFixed(1).padStart(5)}% ${bar} ${r.candidate.candidateName}`)
  })

  console.log()
  console.log('📊 DESGLOSE TOP 3 POR DIMENSIÓN:')
  console.log('-'.repeat(60))

  for (let i = 0; i < 3; i++) {
    const r = result.top3[i]
    if (!r) continue

    console.log(`\n  ${['🥇', '🥈', '🥉'][i]} ${r.candidate.partyCode} - ${r.candidate.candidateName}`)
    console.log(`     Total: ${r.totalPoints.toFixed(2)} / ${r.maxPossiblePoints} = ${r.percentage}%`)

    const dims = Object.entries(r.dimensionBreakdown)
      .filter(([_, d]) => d.maxPoints > 0)
      .sort((a, b) => {
        const pctA = a[1].points / a[1].maxPoints
        const pctB = b[1].points / b[1].maxPoints
        return pctB - pctA
      })

    for (const [dim, data] of dims) {
      const pct = data.maxPoints > 0 ? Math.round((data.points / data.maxPoints) * 100) : 0
      const weight = DIMENSION_WEIGHTS[dim] || 1
      const weightLabel = weight > 1 ? ` [${weight}x]` : ''
      console.log(`     ${dim}${weightLabel}: ${data.points.toFixed(1)}/${data.maxPoints} = ${pct}%`)
    }
  }

  console.log()
  console.log('='.repeat(60))
}

// Ejecutar
runTest()
