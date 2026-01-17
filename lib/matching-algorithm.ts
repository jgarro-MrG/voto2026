/**
 * Algoritmo de Matching para Voto2026
 *
 * Este archivo contiene la lógica principal para calcular la afinidad
 * entre las respuestas del usuario y los perfiles de los candidatos.
 */

import type {
  Candidate,
  CandidateMatch,
  Dimension,
  DimensionScores,
  DimensionWeights,
  UserResponse
} from './types'

const DIMENSIONS: Dimension[] = [
  'security',
  'economy',
  'education',
  'health',
  'agriculture',
  'environment',
  'reforms',
  'social'
]

/**
 * Calcula las puntuaciones por dimensión del usuario
 * basándose en sus respuestas
 */
export function calculateUserScores(responses: UserResponse[]): DimensionScores {
  const dimensionGroups: Record<Dimension, number[]> = {
    security: [],
    economy: [],
    education: [],
    health: [],
    agriculture: [],
    environment: [],
    reforms: [],
    social: []
  }

  // Agrupar respuestas por dimensión
  responses.forEach(response => {
    dimensionGroups[response.dimension].push(response.score)
  })

  // Calcular promedio por dimensión
  const scores: Partial<DimensionScores> = {}

  for (const dimension of DIMENSIONS) {
    const values = dimensionGroups[dimension]
    if (values.length > 0) {
      const sum = values.reduce((acc, val) => acc + val, 0)
      scores[dimension] = sum / values.length
    } else {
      // Si no hay respuestas para esta dimensión, usar valor neutral
      scores[dimension] = 3
    }
  }

  return scores as DimensionScores
}

/**
 * Calcula la distancia euclidiana entre dos conjuntos de puntuaciones
 * Opcionalmente acepta pesos para ponderar las dimensiones
 */
function calculateEuclideanDistance(
  scores1: DimensionScores,
  scores2: DimensionScores,
  weights?: DimensionWeights
): number {
  let sumOfSquares = 0

  for (const dimension of DIMENSIONS) {
    const diff = scores1[dimension] - scores2[dimension]
    const weight = weights ? weights[dimension] : 1
    sumOfSquares += weight * diff * diff
  }

  return Math.sqrt(sumOfSquares)
}

/**
 * Calcula el porcentaje de match por dimensión
 */
function calculateDimensionMatch(
  userScore: number,
  candidateScore: number
): number {
  // La máxima diferencia posible es 4 (de 1 a 5)
  const maxDifference = 4
  const difference = Math.abs(userScore - candidateScore)

  // Convertir a porcentaje: a menor diferencia, mayor match
  const matchPercentage = ((maxDifference - difference) / maxDifference) * 100

  return Math.round(matchPercentage * 10) / 10 // Redondear a 1 decimal
}

/**
 * Calcula la afinidad general entre usuario y candidato
 * Opcionalmente acepta pesos para ponderar las dimensiones
 */
export function calculateAffinity(
  userScores: DimensionScores,
  candidateScores: DimensionScores,
  weights?: DimensionWeights
): {
  affinityPercentage: number
  distance: number
  dimensionMatches: CandidateMatch['dimensionMatches']
} {
  // Calcular distancia euclidiana (con o sin pesos)
  const distance = calculateEuclideanDistance(userScores, candidateScores, weights)

  // Calcular la máxima distancia posible considerando los pesos
  let maxDistance: number
  if (weights) {
    // Con pesos: sqrt(Σ(weight_i * 4^2))
    const weightedSum = DIMENSIONS.reduce((acc, dim) => acc + weights[dim] * 16, 0)
    maxDistance = Math.sqrt(weightedSum)
  } else {
    // Sin pesos: sqrt(8 * 4^2) = sqrt(128) ≈ 11.31
    maxDistance = Math.sqrt(DIMENSIONS.length * 16)
  }

  // Convertir distancia a porcentaje de afinidad
  // A menor distancia, mayor afinidad
  const affinityPercentage = ((maxDistance - distance) / maxDistance) * 100

  // Calcular matches por dimensión
  const dimensionMatches: CandidateMatch['dimensionMatches'] = {} as any

  for (const dimension of DIMENSIONS) {
    const userScore = userScores[dimension]
    const candidateScore = candidateScores[dimension]
    const difference = Math.abs(userScore - candidateScore)
    const matchPercentage = calculateDimensionMatch(userScore, candidateScore)

    dimensionMatches[dimension] = {
      userScore: Math.round(userScore * 10) / 10,
      candidateScore: Math.round(candidateScore * 10) / 10,
      difference: Math.round(difference * 10) / 10,
      matchPercentage
    }
  }

  return {
    affinityPercentage: Math.round(affinityPercentage * 100) / 100, // 2 decimales para mejor precisión
    distance: Math.round(distance * 1000) / 1000, // 3 decimales
    dimensionMatches
  }
}

/**
 * Calcula el matching entre el usuario y todos los candidatos
 * Retorna los resultados ordenados por afinidad (mayor a menor)
 * Opcionalmente acepta pesos para ponderar las dimensiones
 */
export function calculateMatching(
  userScores: DimensionScores,
  candidates: Candidate[],
  weights?: DimensionWeights
): CandidateMatch[] {
  const matches: CandidateMatch[] = candidates
    .filter(candidate => candidate.isActive)
    .map(candidate => {
      const { affinityPercentage, distance, dimensionMatches } = calculateAffinity(
        userScores,
        candidate.scores,
        weights
      )

      return {
        candidate,
        affinityPercentage,
        dimensionMatches,
        overallDistance: distance
      }
    })

  // Ordenar por afinidad descendente, y en caso de empate por distancia ascendente
  matches.sort((a, b) => {
    // Primero por afinidad (mayor es mejor)
    const affinityDiff = b.affinityPercentage - a.affinityPercentage
    if (Math.abs(affinityDiff) > 0.001) { // Evitar problemas de precisión de punto flotante
      return affinityDiff
    }
    // En caso de empate, por distancia (menor es mejor)
    const distanceDiff = a.overallDistance - b.overallDistance
    if (Math.abs(distanceDiff) > 0.001) {
      return distanceDiff
    }
    // Si aún hay empate, por ID de candidato (para consistencia)
    return a.candidate.id - b.candidate.id
  })

  return matches
}

/**
 * Obtiene los top N candidatos con mayor afinidad
 */
export function getTopMatches(
  matches: CandidateMatch[],
  n: number = 3
): CandidateMatch[] {
  return matches.slice(0, n)
}

/**
 * Función principal que procesa las respuestas y retorna los resultados completos
 * Opcionalmente acepta pesos para ponderar las dimensiones
 */
export function processQuizResponses(
  responses: UserResponse[],
  candidates: Candidate[],
  weights?: DimensionWeights
) {
  // 1. Calcular puntuaciones del usuario
  const userScores = calculateUserScores(responses)

  // 2. Calcular matching con todos los candidatos (con o sin pesos)
  const allMatches = calculateMatching(userScores, candidates, weights)

  // 3. Obtener top 3
  const top3 = getTopMatches(allMatches, 3)

  return {
    userScores,
    allMatches,
    top3
  }
}

/**
 * Valida que las respuestas sean consistentes y completas
 */
export function validateResponses(responses: UserResponse[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Verificar que hay respuestas
  if (!responses || responses.length === 0) {
    errors.push('No hay respuestas proporcionadas')
    return { isValid: false, errors }
  }

  // Verificar que hay respuestas para todas las dimensiones
  const dimensionsAnswered = new Set(responses.map(r => r.dimension))
  const missingDimensions = DIMENSIONS.filter(d => !dimensionsAnswered.has(d))

  if (missingDimensions.length > 0) {
    errors.push(`Faltan respuestas para: ${missingDimensions.join(', ')}`)
  }

  // Verificar que los valores están en rango válido
  responses.forEach((response, index) => {
    if (response.score < 1 || response.score > 5) {
      errors.push(`Respuesta ${index + 1} tiene valor inválido: ${response.score}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Genera un análisis textual del perfil político del usuario
 */
export function generateUserProfile(scores: DimensionScores): string {
  const analysis: string[] = []

  // Analizar cada dimensión
  if (scores.security <= 2.5) {
    analysis.push('enfoque de seguridad orientado a la prevención social')
  } else if (scores.security >= 3.5) {
    analysis.push('enfoque de seguridad más punitivo y de mano dura')
  }

  if (scores.economy <= 2.5) {
    analysis.push('preferencia por economía de mercado libre')
  } else if (scores.economy >= 3.5) {
    analysis.push('apoyo a mayor intervención estatal en la economía')
  }

  if (scores.social <= 2.5) {
    analysis.push('enfoque de responsabilidad individual en política social')
  } else if (scores.social >= 3.5) {
    analysis.push('apoyo a programas sociales amplios y universales')
  }

  const avgScore = DIMENSIONS.reduce((acc, dim) => acc + scores[dim], 0) / DIMENSIONS.length

  let tendency = ''
  if (avgScore <= 2.3) {
    tendency = 'conservadora y liberal en lo económico'
  } else if (avgScore <= 2.7) {
    tendency = 'moderadamente conservadora'
  } else if (avgScore <= 3.3) {
    tendency = 'centrista'
  } else if (avgScore <= 3.7) {
    tendency = 'moderadamente progresista'
  } else {
    tendency = 'progresista con énfasis en el rol del Estado'
  }

  return `Tu perfil muestra una tendencia ${tendency}${analysis.length > 0 ? ', con ' + analysis.join(', ') : ''}.`
}
