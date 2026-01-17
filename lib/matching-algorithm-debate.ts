/**
 * Algoritmo de Matching - Formato Debate
 *
 * Sistema donde cada candidato aparece exactamente una vez por pregunta.
 * El usuario selecciona UNA postura por pregunta.
 * Los candidatos que sostienen esa postura reciben puntos.
 *
 * Ventajas:
 * - Cada candidato tiene la misma oportunidad de puntuar en cada pregunta
 * - Formato más justo y comparable
 * - Simula un debate real donde cada candidato tiene una posición
 */

import type { Candidate } from './types'
import { DEBATE_QUESTIONS, DIMENSION_WEIGHTS, DIMENSION_NAMES, type DebateQuestion, type DebateOption } from './questions-debate'

// ============================================
// TIPOS
// ============================================

export interface DebateResponse {
  questionId: number
  selectedOption: string // ID de la opción seleccionada (una sola)
}

export interface DebateCandidateScore {
  candidate: Candidate
  totalPoints: number
  maxPossiblePoints: number
  percentage: number
  // Desglose por dimensión
  dimensionBreakdown: Record<string, {
    points: number
    maxPoints: number
    matchedOption: string | null
    optionText: string | null
  }>
  // Coincidencias con el usuario
  matchingPosturas: Array<{
    questionId: number
    tema: string
    dimension: string
    postura: string
    descripcion: string
  }>
}

export interface DebateMatchResult {
  rankings: DebateCandidateScore[]
  top3: DebateCandidateScore[]
  userResponses: DebateResponse[]
  totalQuestionsAnswered: number
  // Resumen por espectro político
  userProfile: {
    conservativeCount: number
    moderateCount: number
    progressiveCount: number
    summary: string
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Crea un mapa de optionId -> DebateOption para búsqueda rápida
 */
function createOptionMap(): Map<string, { question: DebateQuestion; option: DebateOption }> {
  const map = new Map()
  for (const question of DEBATE_QUESTIONS) {
    for (const option of question.options) {
      map.set(option.id, { question, option })
    }
  }
  return map
}

/**
 * Determina si un candidato está en una opción específica
 */
function candidateInOption(option: DebateOption, partyCode: string): boolean {
  return option.candidatos.includes(partyCode)
}

// ============================================
// ALGORITMO PRINCIPAL
// ============================================

/**
 * Calcula las puntuaciones de todos los candidatos basándose en las respuestas del usuario
 *
 * El algoritmo funciona así:
 * 1. Por cada pregunta respondida, los candidatos en la opción seleccionada reciben puntos
 * 2. Los puntos son iguales al peso de la dimensión de la pregunta
 * 3. El máximo posible es la suma de todos los pesos de las preguntas respondidas
 */
export function calculateDebateMatching(
  responses: DebateResponse[],
  candidates: Candidate[]
): DebateMatchResult {
  const optionMap = createOptionMap()
  const activeCandidates = candidates.filter(c => c.isActive)

  // Inicializar puntuaciones por candidato
  const candidateScores: Map<string, {
    points: number
    dimensionBreakdown: DebateCandidateScore['dimensionBreakdown']
    matchingPosturas: DebateCandidateScore['matchingPosturas']
  }> = new Map()

  for (const candidate of activeCandidates) {
    candidateScores.set(candidate.partyCode, {
      points: 0,
      dimensionBreakdown: {},
      matchingPosturas: []
    })
  }

  // Calcular puntos máximos posibles
  let totalWeightedMax = 0
  const dimensionMaxPoints: Record<string, number> = {}

  // Procesar cada respuesta del usuario
  for (const response of responses) {
    const question = DEBATE_QUESTIONS.find(q => q.id === response.questionId)
    if (!question || !response.selectedOption) continue

    const dimension = question.dimension
    const weight = DIMENSION_WEIGHTS[dimension] || 1

    // Acumular máximo por dimensión
    if (!dimensionMaxPoints[dimension]) {
      dimensionMaxPoints[dimension] = 0
    }
    dimensionMaxPoints[dimension] += weight
    totalWeightedMax += weight

    // Encontrar la opción seleccionada
    const optionData = optionMap.get(response.selectedOption)
    if (!optionData) continue

    const { option } = optionData

    // Asignar puntos a los candidatos que sostienen esta postura
    for (const partyCode of option.candidatos) {
      const score = candidateScores.get(partyCode)
      if (!score) continue

      score.points += weight

      // Actualizar desglose por dimensión
      if (!score.dimensionBreakdown[dimension]) {
        score.dimensionBreakdown[dimension] = {
          points: 0,
          maxPoints: 0,
          matchedOption: null,
          optionText: null
        }
      }
      score.dimensionBreakdown[dimension].points += weight
      score.dimensionBreakdown[dimension].matchedOption = option.id
      score.dimensionBreakdown[dimension].optionText = option.postura

      // Agregar a posturas coincidentes
      score.matchingPosturas.push({
        questionId: question.id,
        tema: question.tema,
        dimension,
        postura: option.postura,
        descripcion: option.descripcion
      })
    }

    // Marcar candidatos que NO coinciden (para mostrar en UI)
    for (const candidate of activeCandidates) {
      const score = candidateScores.get(candidate.partyCode)
      if (!score) continue

      if (!score.dimensionBreakdown[dimension]) {
        score.dimensionBreakdown[dimension] = {
          points: 0,
          maxPoints: 0,
          matchedOption: null,
          optionText: null
        }
      }
    }
  }

  // Actualizar maxPoints por dimensión para cada candidato
  for (const [_partyCode, score] of candidateScores) {
    for (const [dimension, maxPoints] of Object.entries(dimensionMaxPoints)) {
      if (score.dimensionBreakdown[dimension]) {
        score.dimensionBreakdown[dimension].maxPoints = maxPoints
      } else {
        score.dimensionBreakdown[dimension] = {
          points: 0,
          maxPoints,
          matchedOption: null,
          optionText: null
        }
      }
    }
  }

  // Calcular porcentaje y crear resultado final
  const rankings: DebateCandidateScore[] = activeCandidates.map(candidate => {
    const score = candidateScores.get(candidate.partyCode)!

    return {
      candidate,
      totalPoints: score.points,
      maxPossiblePoints: totalWeightedMax,
      percentage: totalWeightedMax > 0
        ? Math.round((score.points / totalWeightedMax) * 1000) / 10
        : 0,
      dimensionBreakdown: score.dimensionBreakdown,
      matchingPosturas: score.matchingPosturas
    }
  })

  // Ordenar por porcentaje (mayor a menor)
  rankings.sort((a, b) => {
    const percentDiff = b.percentage - a.percentage
    if (Math.abs(percentDiff) > 0.01) {
      return percentDiff
    }
    return a.candidate.partyName.localeCompare(b.candidate.partyName)
  })

  // Generar perfil del usuario
  const userProfile = generateUserProfile(responses, optionMap)

  return {
    rankings,
    top3: rankings.slice(0, 3),
    userResponses: responses,
    totalQuestionsAnswered: responses.length,
    userProfile
  }
}

/**
 * Genera un perfil del usuario basado en sus respuestas
 */
function generateUserProfile(
  responses: DebateResponse[],
  optionMap: Map<string, { question: DebateQuestion; option: DebateOption }>
): DebateMatchResult['userProfile'] {
  let conservativeCount = 0
  let moderateCount = 0
  let progressiveCount = 0

  // Mapear opciones a tendencias (basado en el ID de la opción)
  // Generalmente: -a = conservador/derecha, -b = moderado, -c = progresista/izquierda
  for (const response of responses) {
    const optionData = optionMap.get(response.selectedOption)
    if (!optionData) continue

    const optionId = optionData.option.id

    // Determinar tendencia por sufijo de la opción
    if (optionId.endsWith('-a')) {
      conservativeCount++
    } else if (optionId.endsWith('-b')) {
      moderateCount++
    } else if (optionId.endsWith('-c') || optionId.endsWith('-d')) {
      progressiveCount++
    }
  }

  // Generar resumen
  const total = conservativeCount + moderateCount + progressiveCount
  let summary = ''

  if (total === 0) {
    summary = 'Responde las preguntas para conocer tu perfil político.'
  } else {
    const dominantTendency = Math.max(conservativeCount, moderateCount, progressiveCount)

    if (dominantTendency === conservativeCount && conservativeCount > moderateCount && conservativeCount > progressiveCount) {
      summary = 'Tu perfil muestra una tendencia hacia posiciones más tradicionales y de mano firme.'
    } else if (dominantTendency === progressiveCount && progressiveCount > moderateCount && progressiveCount > conservativeCount) {
      summary = 'Tu perfil muestra una tendencia hacia posiciones progresistas y de cambio social.'
    } else if (dominantTendency === moderateCount && moderateCount > conservativeCount && moderateCount > progressiveCount) {
      summary = 'Tu perfil muestra una tendencia moderada y pragmática.'
    } else {
      summary = 'Tu perfil es balanceado, con posiciones diversas según el tema.'
    }
  }

  return {
    conservativeCount,
    moderateCount,
    progressiveCount,
    summary
  }
}

/**
 * Valida que las respuestas sean válidas
 */
export function validateDebateResponses(responses: DebateResponse[]): {
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
  const allQuestionIds = new Set(DEBATE_QUESTIONS.map(q => q.id))

  for (const qId of allQuestionIds) {
    if (!answeredQuestions.has(qId)) {
      warnings.push(`Pregunta ${qId} no fue respondida`)
    }
  }

  // Verificar que las opciones seleccionadas son válidas
  for (const response of responses) {
    const question = DEBATE_QUESTIONS.find(q => q.id === response.questionId)

    if (!question) {
      errors.push(`Pregunta ${response.questionId} no existe`)
      continue
    }

    if (!response.selectedOption) {
      warnings.push(`Pregunta ${response.questionId} no tiene opción seleccionada`)
      continue
    }

    if (!optionMap.has(response.selectedOption)) {
      errors.push(`Opción ${response.selectedOption} no existe`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Obtiene estadísticas de coincidencia por dimensión para un candidato
 */
export function getDebateDimensionStats(candidate: DebateCandidateScore): Array<{
  dimension: string
  dimensionName: string
  matchPercentage: number
  points: number
  maxPoints: number
  matched: boolean
  optionText: string | null
}> {
  return Object.entries(candidate.dimensionBreakdown).map(([dimension, data]) => ({
    dimension,
    dimensionName: DIMENSION_NAMES[dimension] || dimension,
    matchPercentage: data.maxPoints > 0
      ? Math.round((data.points / data.maxPoints) * 100)
      : 0,
    points: data.points,
    maxPoints: data.maxPoints,
    matched: data.points > 0,
    optionText: data.optionText
  })).sort((a, b) => b.matchPercentage - a.matchPercentage)
}

/**
 * Obtiene la postura de un candidato para una pregunta específica
 */
export function getCandidatePosturaForQuestion(
  questionId: number,
  partyCode: string
): { postura: string; descripcion: string } | null {
  const question = DEBATE_QUESTIONS.find(q => q.id === questionId)
  if (!question) return null

  for (const option of question.options) {
    if (option.candidatos.includes(partyCode)) {
      return {
        postura: option.postura,
        descripcion: option.descripcion
      }
    }
  }

  return null
}

/**
 * Obtiene todos los candidatos de una opción con sus datos completos
 */
export function getCandidatesForDebateOption(
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
 * Función principal que procesa las respuestas y retorna los resultados completos
 */
export function processDebateResponses(
  responses: DebateResponse[],
  candidates: Candidate[]
): DebateMatchResult & { validation: ReturnType<typeof validateDebateResponses> } {
  const validation = validateDebateResponses(responses)
  const result = calculateDebateMatching(responses, candidates)

  return {
    ...result,
    validation
  }
}

// ============================================
// UTILIDADES PARA UI DE CARRERA EN VIVO
// ============================================

/**
 * Calcula puntuaciones parciales para mostrar durante el cuestionario
 * Compatible con el componente RaceLeaderboard
 */
export function calculatePartialDebateScores(
  responses: Map<number, string>, // questionId -> selectedOptionId
  candidates: Candidate[]
): Array<{
  partyCode: string
  partyName: string
  candidateName: string
  colorPrimary?: string
  points: number
  maxPoints: number
  percentage: number
}> {
  const activeCandidates = candidates.filter(c => c.isActive)

  // Inicializar scores
  const scoreMap = new Map<string, { points: number; maxPoints: number }>()
  for (const c of activeCandidates) {
    scoreMap.set(c.partyCode, { points: 0, maxPoints: 0 })
  }

  let totalWeightedMax = 0

  // Procesar cada respuesta
  for (const [questionId, selectedOption] of responses) {
    const question = DEBATE_QUESTIONS.find(q => q.id === questionId)
    if (!question || !selectedOption) continue

    const weight = DIMENSION_WEIGHTS[question.dimension] || 1
    totalWeightedMax += weight

    // Encontrar la opción seleccionada
    const option = question.options.find(o => o.id === selectedOption)
    if (!option) continue

    // Dar puntos a los candidatos de esa opción
    for (const partyCode of option.candidatos) {
      const score = scoreMap.get(partyCode)
      if (score) {
        score.points += weight
      }
    }
  }

  // Actualizar maxPoints para todos
  for (const score of scoreMap.values()) {
    score.maxPoints = totalWeightedMax
  }

  // Convertir a array con porcentajes
  return activeCandidates.map(c => {
    const score = scoreMap.get(c.partyCode)!
    return {
      partyCode: c.partyCode,
      partyName: c.partyName,
      candidateName: c.candidateName,
      colorPrimary: c.colorPrimary,
      points: score.points,
      maxPoints: score.maxPoints,
      percentage: score.maxPoints > 0
        ? (score.points / score.maxPoints) * 100
        : 0
    }
  })
}

export default {
  calculateDebateMatching,
  validateDebateResponses,
  processDebateResponses,
  getDebateDimensionStats,
  getCandidatePosturaForQuestion,
  getCandidatesForDebateOption,
  calculatePartialDebateScores
}
