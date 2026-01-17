/**
 * Algoritmo de Matching v2 para Voto2026
 *
 * Sistema basado en propuestas:
 * - Las opciones son propuestas reales de candidatos
 * - Cada opción tiene una lista de candidatos que la apoyan
 * - El usuario puede seleccionar múltiples opciones por pregunta
 * - Los puntos van a TODOS los candidatos que apoyan cada propuesta seleccionada
 * - Las dimensiones de liderazgo/perfil tienen mayor peso
 */

import type { Candidate } from './types'
import { QUESTIONS_V2, type QuestionV2, type ProposalOption } from './questions-v2'

// ============================================
// CONFIGURACIÓN DE PESOS
// ============================================

/**
 * Pesos por dimensión
 * Las dimensiones de perfil/liderazgo tienen mayor peso
 * porque reflejan el carácter del candidato más que propuestas específicas
 */
export const DIMENSION_WEIGHTS: Record<string, number> = {
  // Propuestas de gobierno (peso normal)
  security: 1,
  economy: 1,
  education: 1,
  health: 1,
  agriculture: 1,
  environment: 1,
  reforms: 1,
  social: 1,
  // Perfil de liderazgo (peso alto - 3x)
  leadership: 3,
  experience: 3,
  priority: 3,
}

// ============================================
// TIPOS PARA V2
// ============================================

export interface UserResponseV2 {
  questionId: number
  selectedOptions: string[] // IDs de las opciones seleccionadas
}

export interface CandidateScoreV2 {
  candidate: Candidate
  totalPoints: number
  maxPossiblePoints: number
  percentage: number
  // Desglose por dimensión
  dimensionBreakdown: Record<string, {
    points: number
    maxPoints: number
    selectedOptions: string[]
  }>
  // Opciones seleccionadas que este candidato apoya
  matchingProposals: Array<{
    questionId: number
    optionId: string
    optionText: string
    dimension: string
  }>
}

export interface MatchResultV2 {
  rankings: CandidateScoreV2[]
  top3: CandidateScoreV2[]
  userResponses: UserResponseV2[]
  totalQuestionsAnswered: number
  totalOptionsSelected: number
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Crea un mapa de optionId -> ProposalOption para búsqueda rápida
 */
function createOptionMap(): Map<string, { question: QuestionV2; option: ProposalOption }> {
  const map = new Map()
  for (const question of QUESTIONS_V2) {
    for (const option of question.options) {
      map.set(option.id, { question, option })
    }
  }
  return map
}

/**
 * Calcula el máximo de puntos posibles por dimensión
 * basándose en cuántas opciones tienen cada candidato disponible
 */
function calculateMaxPointsByDimension(): Record<string, number> {
  const maxByDimension: Record<string, number> = {}

  for (const question of QUESTIONS_V2) {
    const dimension = question.dimension
    // Cada pregunta contribuye hasta N puntos (donde N es el número de opciones)
    // Si multiSelect=true, el usuario puede seleccionar todas
    // Si multiSelect=false, solo puede seleccionar una
    const maxForQuestion = question.multiSelect ? question.options.length : 1
    maxByDimension[dimension] = (maxByDimension[dimension] || 0) + maxForQuestion
  }

  return maxByDimension
}

// ============================================
// ALGORITMO PRINCIPAL
// ============================================

/**
 * Calcula las puntuaciones de todos los candidatos basándose en las respuestas del usuario
 *
 * El algoritmo funciona así:
 * 1. Cada PREGUNTA contribuye un valor ponderado por el peso de su dimensión
 * 2. Para una pregunta, un candidato recibe puntos proporcionales a cuántas
 *    de las opciones seleccionadas por el usuario ese candidato apoya
 * 3. Las dimensiones de liderazgo (leadership, experience, priority) tienen peso 3x
 *    porque reflejan el carácter del candidato más que propuestas específicas
 */
export function calculateMatchingV2(
  responses: UserResponseV2[],
  candidates: Candidate[]
): MatchResultV2 {
  const optionMap = createOptionMap()
  const activeCandidates = candidates.filter(c => c.isActive)

  // Inicializar puntuaciones por candidato
  const candidateScores: Map<string, {
    weightedPoints: number
    rawPoints: number
    dimensionBreakdown: Record<string, { points: number; maxPoints: number; selectedOptions: string[] }>
    matchingProposals: CandidateScoreV2['matchingProposals']
  }> = new Map()

  // Inicializar todos los candidatos con 0 puntos
  for (const candidate of activeCandidates) {
    candidateScores.set(candidate.partyCode, {
      weightedPoints: 0,
      rawPoints: 0,
      dimensionBreakdown: {},
      matchingProposals: []
    })
  }

  // Calcular puntos máximos posibles
  let totalOptionsSelected = 0
  let totalWeightedMax = 0
  const dimensionMaxPoints: Record<string, number> = {}

  // Procesar cada respuesta del usuario
  for (const response of responses) {
    const question = QUESTIONS_V2.find(q => q.id === response.questionId)
    if (!question) continue

    const dimension = question.dimension
    const weight = DIMENSION_WEIGHTS[dimension] || 1
    const numSelected = response.selectedOptions.length

    if (numSelected === 0) continue

    // Inicializar dimensión si no existe
    if (!dimensionMaxPoints[dimension]) {
      dimensionMaxPoints[dimension] = 0
    }

    // Cada pregunta contribuye su peso al máximo (independiente de cuántas opciones seleccione)
    // Esto normaliza el impacto de cada pregunta
    dimensionMaxPoints[dimension] += weight
    totalWeightedMax += weight
    totalOptionsSelected += numSelected

    // Contar cuántas de las opciones seleccionadas apoya cada candidato
    const candidateMatchCount: Map<string, number> = new Map()
    const candidateMatchedOptions: Map<string, string[]> = new Map()

    for (const optionId of response.selectedOptions) {
      const optionData = optionMap.get(optionId)
      if (!optionData) continue

      const { option } = optionData

      for (const partyCode of option.candidatos) {
        const currentCount = candidateMatchCount.get(partyCode) || 0
        candidateMatchCount.set(partyCode, currentCount + 1)

        const matchedOptions = candidateMatchedOptions.get(partyCode) || []
        matchedOptions.push(optionId)
        candidateMatchedOptions.set(partyCode, matchedOptions)
      }
    }

    // Asignar puntos proporcionales a cada candidato
    // Si el usuario seleccionó 2 opciones y el candidato apoya 1, recibe 0.5 * peso
    for (const [partyCode, matchCount] of candidateMatchCount) {
      const candidateScore = candidateScores.get(partyCode)
      if (!candidateScore) continue

      // Puntos proporcionales: (coincidencias / seleccionadas) * peso
      const proportionalPoints = (matchCount / numSelected) * weight
      candidateScore.weightedPoints += proportionalPoints
      candidateScore.rawPoints += matchCount

      // Actualizar desglose por dimensión
      if (!candidateScore.dimensionBreakdown[dimension]) {
        candidateScore.dimensionBreakdown[dimension] = {
          points: 0,
          maxPoints: 0,
          selectedOptions: []
        }
      }
      candidateScore.dimensionBreakdown[dimension].points += proportionalPoints
      candidateScore.dimensionBreakdown[dimension].selectedOptions.push(
        ...(candidateMatchedOptions.get(partyCode) || [])
      )

      // Agregar a propuestas coincidentes
      for (const optionId of candidateMatchedOptions.get(partyCode) || []) {
        const optionData = optionMap.get(optionId)
        if (optionData) {
          candidateScore.matchingProposals.push({
            questionId: response.questionId,
            optionId: optionData.option.id,
            optionText: optionData.option.text,
            dimension
          })
        }
      }
    }
  }

  // Actualizar maxPoints por dimensión para cada candidato
  for (const [_partyCode, score] of candidateScores) {
    for (const [dimension, maxPoints] of Object.entries(dimensionMaxPoints)) {
      if (!score.dimensionBreakdown[dimension]) {
        score.dimensionBreakdown[dimension] = {
          points: 0,
          maxPoints,
          selectedOptions: []
        }
      } else {
        score.dimensionBreakdown[dimension].maxPoints = maxPoints
      }
    }
  }

  // Calcular porcentaje y crear resultado final
  const rankings: CandidateScoreV2[] = activeCandidates.map(candidate => {
    const score = candidateScores.get(candidate.partyCode)!

    return {
      candidate,
      totalPoints: Math.round(score.weightedPoints * 100) / 100,
      maxPossiblePoints: totalWeightedMax,
      percentage: totalWeightedMax > 0
        ? Math.round((score.weightedPoints / totalWeightedMax) * 1000) / 10 // 1 decimal
        : 0,
      dimensionBreakdown: score.dimensionBreakdown,
      matchingProposals: score.matchingProposals
    }
  })

  // Ordenar por porcentaje (mayor a menor), y en empate por nombre
  rankings.sort((a, b) => {
    const percentDiff = b.percentage - a.percentage
    if (Math.abs(percentDiff) > 0.01) {
      return percentDiff
    }
    // En empate, por puntos totales
    const pointsDiff = b.totalPoints - a.totalPoints
    if (pointsDiff !== 0) {
      return pointsDiff
    }
    // En empate final, alfabéticamente
    return a.candidate.partyName.localeCompare(b.candidate.partyName)
  })

  return {
    rankings,
    top3: rankings.slice(0, 3),
    userResponses: responses,
    totalQuestionsAnswered: responses.length,
    totalOptionsSelected
  }
}

/**
 * Valida que las respuestas sean válidas
 */
export function validateResponsesV2(responses: UserResponseV2[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const optionMap = createOptionMap()

  if (!responses || responses.length === 0) {
    errors.push('No hay respuestas proporcionadas')
    return { isValid: false, errors, warnings }
  }

  // Verificar que todas las preguntas estén respondidas
  const answeredQuestions = new Set(responses.map(r => r.questionId))
  const allQuestionIds = new Set(QUESTIONS_V2.map(q => q.id))

  for (const qId of allQuestionIds) {
    if (!answeredQuestions.has(qId)) {
      warnings.push(`Pregunta ${qId} no fue respondida`)
    }
  }

  // Verificar que las opciones seleccionadas son válidas
  for (const response of responses) {
    const question = QUESTIONS_V2.find(q => q.id === response.questionId)

    if (!question) {
      errors.push(`Pregunta ${response.questionId} no existe`)
      continue
    }

    // Verificar selección múltiple
    if (!question.multiSelect && response.selectedOptions.length > 1) {
      errors.push(`Pregunta ${response.questionId} no permite selección múltiple`)
    }

    // Verificar que haya al menos una selección
    if (response.selectedOptions.length === 0) {
      warnings.push(`Pregunta ${response.questionId} no tiene opciones seleccionadas`)
    }

    // Verificar que las opciones existan
    for (const optionId of response.selectedOptions) {
      if (!optionMap.has(optionId)) {
        errors.push(`Opción ${optionId} no existe`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Genera un resumen del perfil político del usuario basado en sus selecciones
 */
export function generateUserProfileV2(responses: UserResponseV2[]): string {
  const optionMap = createOptionMap()
  const dimensionTendencies: Record<string, string[]> = {}

  for (const response of responses) {
    for (const optionId of response.selectedOptions) {
      const optionData = optionMap.get(optionId)
      if (!optionData) continue

      const { question, option } = optionData
      const dimension = question.dimension

      if (!dimensionTendencies[dimension]) {
        dimensionTendencies[dimension] = []
      }
      dimensionTendencies[dimension].push(option.text)
    }
  }

  const highlights: string[] = []

  // Analizar tendencias por dimensión
  if (dimensionTendencies['security']?.some(t => t.includes('Mano dura'))) {
    highlights.push('postura firme contra el crimen')
  }
  if (dimensionTendencies['security']?.some(t => t.includes('Prevención'))) {
    highlights.push('enfoque preventivo en seguridad')
  }

  if (dimensionTendencies['economy']?.some(t => t.includes('Reducir cargas'))) {
    highlights.push('preferencia por menor intervención estatal')
  }
  if (dimensionTendencies['economy']?.some(t => t.includes('producción nacional'))) {
    highlights.push('apoyo a proteger la producción local')
  }

  if (dimensionTendencies['social']?.some(t => t.includes('Empleo sobre'))) {
    highlights.push('énfasis en independencia económica')
  }
  if (dimensionTendencies['social']?.some(t => t.includes('Inversión social'))) {
    highlights.push('apoyo a programas sociales amplios')
  }

  if (highlights.length === 0) {
    return 'Tu perfil muestra una tendencia moderada con posiciones diversas en los diferentes temas.'
  }

  return `Tu perfil muestra ${highlights.join(', ')}.`
}

/**
 * Obtiene estadísticas de coincidencia por dimensión
 */
export function getDimensionMatchStats(result: MatchResultV2, candidate: CandidateScoreV2): Array<{
  dimension: string
  dimensionName: string
  matchPercentage: number
  points: number
  maxPoints: number
}> {
  const { DIMENSION_NAMES } = require('./questions-v2')

  return Object.entries(candidate.dimensionBreakdown).map(([dimension, data]) => ({
    dimension,
    dimensionName: DIMENSION_NAMES[dimension] || dimension,
    matchPercentage: data.maxPoints > 0
      ? Math.round((data.points / data.maxPoints) * 100)
      : 0,
    points: data.points,
    maxPoints: data.maxPoints
  })).sort((a, b) => b.matchPercentage - a.matchPercentage)
}

/**
 * Función principal que procesa las respuestas y retorna los resultados completos
 */
export function processQuizResponsesV2(
  responses: UserResponseV2[],
  candidates: Candidate[]
): MatchResultV2 & { userProfile: string; validation: ReturnType<typeof validateResponsesV2> } {
  // Validar respuestas
  const validation = validateResponsesV2(responses)

  // Calcular matching
  const result = calculateMatchingV2(responses, candidates)

  // Generar perfil del usuario
  const userProfile = generateUserProfileV2(responses)

  return {
    ...result,
    userProfile,
    validation
  }
}

// ============================================
// UTILIDADES PARA UI
// ============================================

/**
 * Obtiene los candidatos que apoyan una opción específica
 */
export function getCandidatesForOption(
  optionId: string,
  candidates: Candidate[]
): Candidate[] {
  const optionMap = createOptionMap()
  const optionData = optionMap.get(optionId)

  if (!optionData) return []

  const partyCodes = new Set(optionData.option.candidatos)
  return candidates.filter(c => partyCodes.has(c.partyCode) && c.isActive)
}

/**
 * Obtiene cuántos candidatos apoyan cada opción (para mostrar en UI)
 */
export function getOptionSupportCount(questionId: number): Array<{
  optionId: string
  supportCount: number
}> {
  const question = QUESTIONS_V2.find(q => q.id === questionId)
  if (!question) return []

  return question.options.map(opt => ({
    optionId: opt.id,
    supportCount: opt.candidatos.length
  }))
}

export default {
  calculateMatchingV2,
  validateResponsesV2,
  generateUserProfileV2,
  processQuizResponsesV2,
  getDimensionMatchStats,
  getCandidatesForOption,
  getOptionSupportCount
}
