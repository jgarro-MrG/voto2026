'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CandidateMatch, DimensionScores } from '@/lib/types'
import { formatPercentage, getPoliticalTendency } from '@/lib/utils'

export default function ResultadosPage() {
  const params = useParams()
  const sessionId = params?.sessionId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userScores, setUserScores] = useState<DimensionScores | null>(null)
  const [top3, setTop3] = useState<CandidateMatch[]>([])

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
      const response = await fetch(`/api/results?sessionId=${sessionId}`)

      if (!response.ok) {
        throw new Error('No se pudieron cargar los resultados')
      }

      const data = await response.json()
      setUserScores(data.userScores)
      setTop3(data.top3)
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
          <p className="text-cr-blue-700 font-medium">Cargando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !userScores || top3.length === 0) {
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

  const avgScore =
    (userScores.security +
      userScores.economy +
      userScores.education +
      userScores.health +
      userScores.agriculture +
      userScores.environment +
      userScores.reforms +
      userScores.social) /
    8

  const politicalTendency = getPoliticalTendency(avgScore)

  const dimensionLabels: Record<keyof DimensionScores, string> = {
    security: 'Seguridad',
    economy: 'Economía',
    education: 'Educación',
    health: 'Salud',
    agriculture: 'Agricultura',
    environment: 'Ambiente',
    reforms: 'Reformas',
    social: 'Política Social',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-cr-blue-700">
            Tus Resultados
          </h1>
          <p className="text-gray-700">
            Basado en tus respuestas, estos son los candidatos que mejor se
            alinean con tus preferencias
          </p>
        </div>

        {/* User Political Profile */}
        <Card className="mb-8 border-2 border-cr-blue-200">
          <CardHeader className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50">
            <CardTitle className="text-cr-blue-700">Tu Perfil Político</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                Basado en tus respuestas, tu tendencia política es:
              </p>
              <p className="mt-2 text-2xl font-bold text-cr-red-600">
                {politicalTendency}
              </p>
              <p className="mt-1 text-sm text-cr-blue-600 font-medium">
                Promedio: {avgScore.toFixed(2)} / 5.0
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Tus puntuaciones por dimensión:
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {(Object.keys(userScores) as Array<keyof DimensionScores>).map(
                  (dimension) => (
                    <div
                      key={dimension}
                      className="rounded-md bg-gray-50 p-3 text-center"
                    >
                      <p className="text-xs text-gray-600">
                        {dimensionLabels[dimension]}
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {userScores[dimension].toFixed(1)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Candidates */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-cr-blue-700">
            Top 3 Candidatos
          </h2>
          <div className="space-y-4">
            {top3.map((match, index) => (
              <Card
                key={match.candidate.id}
                className="overflow-hidden transition-shadow hover:shadow-lg border-2 border-cr-blue-200"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: match.candidate.colorPrimary }}
                />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cr-blue-500 to-cr-red-500 text-xl font-bold text-white shadow-md">
                          {index + 1}
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

                      {match.candidate.planSummary && (
                        <p className="mb-4 text-sm text-gray-700 line-clamp-3">
                          {match.candidate.planSummary}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-4xl font-bold bg-gradient-to-br from-cr-blue-600 to-cr-red-600 bg-clip-text text-transparent">
                        {formatPercentage(match.affinityPercentage, 2)}
                      </div>
                      <p className="text-xs text-gray-600 font-medium">de afinidad</p>
                    </div>
                  </div>

                  {/* Dimension comparison */}
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Comparación por dimensión:
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                      {(
                        Object.keys(userScores) as Array<keyof DimensionScores>
                      ).map((dimension) => {
                        const userValue = userScores[dimension]
                        const candidateValue =
                          match.candidate.scores[dimension]
                        const difference = Math.abs(userValue - candidateValue)

                        return (
                          <div
                            key={dimension}
                            className="rounded bg-gray-50 p-2 text-center"
                          >
                            <p className="text-xs text-gray-600">
                              {dimensionLabels[dimension]}
                            </p>
                            <p className="text-sm font-medium">
                              <span className="text-blue-600">
                                {userValue.toFixed(1)}
                              </span>
                              {' vs '}
                              <span className="text-gray-700">
                                {candidateValue.toFixed(1)}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Δ {difference.toFixed(1)}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              if (navigator.share) {
                navigator.share({
                  title: 'Mis resultados - Voto2026',
                  text: `Mi candidato con mayor afinidad es ${top3[0].candidate.candidateName} con ${formatPercentage(top3[0].affinityPercentage, 2)} de afinidad`,
                  url: window.location.href,
                })
              } else {
                // Fallback: copy to clipboard
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
            <div className="flex gap-3">
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
                No me ayudó
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
