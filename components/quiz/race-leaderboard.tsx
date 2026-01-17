'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'

interface CandidateScore {
  partyCode: string
  partyName: string
  candidateName: string
  colorPrimary?: string
  points: number
  maxPoints: number
  percentage: number
  previousRank?: number
}

interface RaceLeaderboardProps {
  scores: CandidateScore[]
  questionsAnswered: number
  totalQuestions: number
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function RaceLeaderboard({
  scores,
  questionsAnswered,
  totalQuestions,
  isCollapsed = false,
  onToggleCollapse,
  className,
}: RaceLeaderboardProps) {
  // Ordenar por porcentaje
  const sortedScores = useMemo(() => {
    return [...scores]
      .sort((a, b) => b.percentage - a.percentage)
      .map((score, index) => ({
        ...score,
        currentRank: index + 1,
      }))
  }, [scores])

  // Mostrar todos los candidatos siempre
  const displayScores = sortedScores

  if (questionsAnswered === 0) {
    return (
      <div className={cn('rounded-lg border-2 border-cr-blue-200 bg-white p-4', className)}>
        <div className="text-center text-gray-500 text-sm">
          Responde la primera pregunta para ver la carrera
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border-2 border-cr-blue-200 bg-white overflow-hidden', className)}>
      {/* Header */}
      <div
        className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50 px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div>
          <h3 className="font-bold text-cr-blue-700 text-sm">Carrera en Vivo</h3>
          <p className="text-xs text-gray-600">
            {questionsAnswered} de {totalQuestions} preguntas
          </p>
        </div>
        <button className="text-cr-blue-600 hover:text-cr-blue-700">
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Leaderboard - Todos los candidatos */}
      <div className={cn(
        'transition-all duration-300 overflow-y-auto',
        isCollapsed ? 'max-h-[300px]' : 'max-h-[70vh]'
      )}>
        <div className="p-2 space-y-1">
          {displayScores.map((score, index) => (
            <RaceRow
              key={score.partyCode}
              score={score}
              rank={index + 1}
              isTop3={index < 3}
              maxPercentage={sortedScores[0]?.percentage || 100}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface RaceRowProps {
  score: CandidateScore & { currentRank: number }
  rank: number
  isTop3: boolean
  maxPercentage: number
}

// Función para determinar si un color es claro u oscuro
function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

function RaceRow({ score, rank, isTop3, maxPercentage }: RaceRowProps) {
  // Calcular cambio de posición
  const rankChange = score.previousRank !== undefined
    ? score.previousRank - score.currentRank
    : 0

  // Ancho de la barra relativo al líder
  const barWidth = maxPercentage > 0
    ? (score.percentage / maxPercentage) * 100
    : 0

  // Color del partido para el indicador
  const partyColor = score.colorPrimary || '#6b7280'
  const textColor = isLightColor(partyColor) ? '#1f2937' : '#ffffff'

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded transition-all',
        isTop3 ? 'bg-gradient-to-r from-cr-blue-50 to-transparent' : 'hover:bg-gray-50'
      )}
    >
      {/* Posición con color del partido */}
      <div
        className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-sm"
        style={{
          backgroundColor: partyColor,
          color: textColor,
        }}
      >
        {rank}
      </div>

      {/* Info del candidato */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className={cn(
            'font-semibold text-xs truncate',
            isTop3 ? 'text-cr-blue-700' : 'text-gray-700'
          )}>
            {score.partyCode}
          </span>
          {rankChange !== 0 && (
            <span className={cn(
              'flex items-center text-xs',
              rankChange > 0 ? 'text-green-600' : 'text-red-500'
            )}>
              {rankChange > 0 ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {Math.abs(rankChange)}
            </span>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-100 rounded-full h-2 mt-0.5">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${barWidth}%`,
              backgroundColor: score.colorPrimary || '#002b7f',
            }}
          />
        </div>
      </div>

      {/* Porcentaje */}
      <div className={cn(
        'text-right w-12',
        isTop3 ? 'text-cr-blue-700 font-bold' : 'text-gray-600'
      )}>
        <span className="text-xs">{score.percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}

// Hook para calcular scores parciales
export function usePartialScores(
  responses: Map<number, string[]>,
  questions: Array<{
    id: number
    dimension: string
    options: Array<{
      id: string
      candidatos: string[]
    }>
  }>,
  candidates: Array<{
    partyCode: string
    partyName: string
    candidateName: string
    colorPrimary?: string
    isActive: boolean
  }>,
  dimensionWeights: Record<string, number>
): CandidateScore[] {
  return useMemo(() => {
    const activeCandidates = candidates.filter(c => c.isActive)

    // Inicializar scores
    const scoreMap = new Map<string, { points: number; maxPoints: number }>()
    for (const c of activeCandidates) {
      scoreMap.set(c.partyCode, { points: 0, maxPoints: 0 })
    }

    let totalWeightedMax = 0

    // Procesar cada respuesta
    for (const [questionId, selectedOptions] of responses) {
      const question = questions.find(q => q.id === questionId)
      if (!question || selectedOptions.length === 0) continue

      const weight = dimensionWeights[question.dimension] || 1
      totalWeightedMax += weight

      // Contar coincidencias por candidato
      const candidateMatchCount = new Map<string, number>()

      for (const optionId of selectedOptions) {
        const option = question.options.find(o => o.id === optionId)
        if (!option) continue

        for (const partyCode of option.candidatos) {
          const current = candidateMatchCount.get(partyCode) || 0
          candidateMatchCount.set(partyCode, current + 1)
        }
      }

      // Asignar puntos proporcionales
      for (const [partyCode, matchCount] of candidateMatchCount) {
        const score = scoreMap.get(partyCode)
        if (!score) continue

        const proportionalPoints = (matchCount / selectedOptions.length) * weight
        score.points += proportionalPoints
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
          : 0,
      }
    })
  }, [responses, questions, candidates, dimensionWeights])
}
