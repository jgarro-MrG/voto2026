'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CandidateScoreV2 } from '@/lib/matching-algorithm-v2'
import { DIMENSION_NAMES } from '@/lib/questions-v2'
import { ChevronDown, ChevronUp, Check, Users, TrendingUp } from 'lucide-react'

interface RankingItem {
  candidate: {
    id: number
    partyCode: string
    partyName: string
    candidateName: string
    candidatePhoto?: string
    partyLogo?: string
    slogan?: string
    colorPrimary?: string
    colorSecondary?: string
    planSummary?: string
  }
  totalPoints: number
  maxPossiblePoints: number
  percentage: number
  dimensionBreakdown: Record<string, {
    points: number
    maxPoints: number
    selectedOptions: string[]
  }>
  matchingProposalsCount: number
}

interface ResultsData {
  rankings: RankingItem[]
  top3: RankingItem[]
  userProfile: string
  totalQuestionsAnswered: number
  totalOptionsSelected: number
}

export default function ResultadosV2Page() {
  const params = useParams()
  const sessionId = params?.sessionId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ResultsData | null>(null)
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null)
  const [showAllCandidates, setShowAllCandidates] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setError('ID de sesión no válido')
      setLoading(false)
      return
    }

    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results-v2?sessionId=${sessionId}`)

      if (!response.ok) {
        throw new Error('No se pudieron cargar los resultados')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error('Error fetching results:', err)
      setError('Hubo un error al cargar tus resultados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cr-red-500 border-t-transparent mx-auto" />
          <p className="text-cr-blue-700 font-medium">Analizando tus respuestas...</p>
        </div>
      </div>
    )
  }

  if (error || !results || results.rankings.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              {error || 'No se encontraron resultados para esta sesión'}
            </p>
            <Link href="/">
              <Button className="!bg-cr-blue-500 !text-white hover:!bg-cr-blue-600 !border !border-cr-red-500">
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayedCandidates = showAllCandidates
    ? results.rankings
    : results.rankings.slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-cr-blue-700">
            Tus Resultados
          </h1>
          <p className="text-gray-700">
            Basado en las propuestas que seleccionaste, estos son los candidatos que mejor se
            alinean con tu visión
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="mb-8 border-2 border-cr-blue-200">
          <CardHeader className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50">
            <CardTitle className="text-cr-blue-700">Tu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 mb-4">
              {results.userProfile}
            </p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-cr-blue-500" />
                <span className="text-gray-600">
                  <strong className="text-cr-blue-700">{results.totalQuestionsAnswered}</strong> preguntas respondidas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cr-red-500" />
                <span className="text-gray-600">
                  <strong className="text-cr-red-600">{results.totalOptionsSelected}</strong> propuestas seleccionadas
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-cr-blue-700">
            Candidatos Afines
          </h2>
          <div className="space-y-4">
            {displayedCandidates.map((match, index) => (
              <CandidateCard
                key={match.candidate.id}
                match={match}
                rank={index + 1}
                isExpanded={expandedCandidate === match.candidate.id}
                onToggleExpand={() =>
                  setExpandedCandidate(
                    expandedCandidate === match.candidate.id ? null : match.candidate.id
                  )
                }
                isTop3={index < 3}
              />
            ))}
          </div>

          {/* Show more/less button */}
          {results.rankings.length > 5 && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="!border-2 !border-cr-blue-500 !bg-transparent !text-cr-blue-600 hover:!bg-cr-blue-50"
                onClick={() => setShowAllCandidates(!showAllCandidates)}
              >
                {showAllCandidates
                  ? `Mostrar menos`
                  : `Ver todos los ${results.rankings.length} candidatos`}
                {showAllCandidates ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="!border-2 !border-cr-blue-500 !bg-transparent !text-cr-blue-600 hover:!bg-cr-blue-50"
            >
              Volver al inicio
            </Button>
          </Link>
          <Button
            size="lg"
            className="!bg-cr-red-500 !text-white hover:!bg-cr-red-600 !border-2 !border-cr-blue-500"
            onClick={() => {
              const topMatch = results.rankings[0]
              if (navigator.share) {
                navigator.share({
                  title: 'Mis resultados - Voto2026',
                  text: `Mi candidato con mayor afinidad es ${topMatch.candidate.candidateName} con ${topMatch.percentage}% de coincidencia en propuestas`,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Enlace copiado al portapapeles')
              }
            }}
          >
            Compartir Resultados
          </Button>
        </div>

        {/* Feedback Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>¿Estos resultados te ayudaron?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              Nos encantaría saber si esta herramienta te fue útil para decidir
              tu voto.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="!border-2 !border-cr-blue-500 !bg-transparent !text-cr-blue-600 hover:!bg-cr-blue-50"
                onClick={async () => {
                  await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, wasHelpful: true }),
                  })
                  alert('¡Gracias por tu feedback!')
                }}
              >
                Sí, me ayudó
              </Button>
              <Button
                variant="outline"
                className="!border-2 !border-cr-blue-500 !bg-transparent !text-cr-blue-600 hover:!bg-cr-blue-50"
                onClick={async () => {
                  await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId, wasHelpful: false }),
                  })
                  alert('Gracias por tu feedback. Seguiremos mejorando.')
                }}
              >
                No mucho
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Esta herramienta es educativa e independiente. No está afiliada a
          ningún partido político ni al Tribunal Supremo de Elecciones de Costa
          Rica.
        </p>
      </div>
    </div>
  )
}

interface CandidateCardProps {
  match: RankingItem
  rank: number
  isExpanded: boolean
  onToggleExpand: () => void
  isTop3: boolean
}

function CandidateCard({ match, rank, isExpanded, onToggleExpand, isTop3 }: CandidateCardProps) {
  const dimensionEntries = Object.entries(match.dimensionBreakdown)
    .filter(([_, data]) => data.maxPoints > 0)
    .sort((a, b) => {
      // Sort by match percentage (points/maxPoints)
      const percentA = a[1].points / a[1].maxPoints
      const percentB = b[1].points / b[1].maxPoints
      return percentB - percentA
    })

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${
        isTop3 ? 'border-2 border-cr-blue-200' : 'border border-gray-200'
      }`}
    >
      <div
        className="h-2"
        style={{ backgroundColor: match.candidate.colorPrimary || '#002b7f' }}
      />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-white shadow-md ${
                  isTop3
                    ? 'bg-gradient-to-br from-cr-blue-500 to-cr-red-500'
                    : 'bg-gray-400'
                }`}
              >
                {rank}
              </span>
              <div>
                <h3 className="text-xl font-bold text-cr-blue-700">
                  {match.candidate.candidateName}
                </h3>
                <p className="text-sm text-cr-red-600 font-medium">
                  {match.candidate.partyName}
                </p>
              </div>
            </div>

            {match.candidate.slogan && (
              <p className="mb-3 italic text-gray-600">
                &ldquo;{match.candidate.slogan}&rdquo;
              </p>
            )}
          </div>

          <div className="ml-4 text-right">
            <div className="text-4xl font-bold bg-gradient-to-br from-cr-blue-600 to-cr-red-600 bg-clip-text text-transparent">
              {match.percentage}%
            </div>
            <p className="text-xs text-gray-600 font-medium">de coincidencia</p>
            <div className="flex items-center gap-1 justify-end mt-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {match.totalPoints}/{match.maxPossiblePoints} propuestas
              </span>
            </div>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={onToggleExpand}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-cr-blue-600 hover:text-cr-blue-700 border-t"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Ocultar detalles
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Ver coincidencias por tema
            </>
          )}
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <p className="text-sm font-medium text-gray-700">
              Coincidencias por dimensión:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {dimensionEntries.map(([dimension, data]) => {
                const percentage =
                  data.maxPoints > 0
                    ? Math.round((data.points / data.maxPoints) * 100)
                    : 0

                return (
                  <div
                    key={dimension}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {DIMENSION_NAMES[dimension] || dimension}
                      </span>
                      <span className="text-sm font-bold text-cr-blue-600">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cr-blue-500 to-cr-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.points} de {data.maxPoints} propuestas coinciden
                    </p>
                  </div>
                )
              })}
            </div>

            {match.candidate.planSummary && (
              <div className="mt-4 p-3 bg-cr-blue-50 rounded-lg border border-cr-blue-100">
                <p className="text-sm font-medium text-cr-blue-700 mb-1">
                  Resumen del plan de gobierno:
                </p>
                <p className="text-sm text-gray-700">
                  {match.candidate.planSummary}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
