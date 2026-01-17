'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { DebateQuestionCard } from '@/components/quiz/debate-question-card'
import { RaceLeaderboard } from '@/components/quiz/race-leaderboard'
import { DEBATE_QUESTIONS, DIMENSION_WEIGHTS, DIMENSION_NAMES } from '@/lib/questions-debate'
import { calculatePartialDebateScores, DebateResponse } from '@/lib/matching-algorithm-debate'
import { Eye, EyeOff, MessageSquare } from 'lucide-react'

type DemographicData = {
  ageRange: string
  province: string
  gender: string
  priorVoteIntention: string
}

type ViewMode = 'liveRace' | 'finalResults'

const AGE_RANGES = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+']
const PROVINCES = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón']
const GENDERS = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']
const VOTE_INTENTIONS = [
  'Tengo un candidato en mente',
  'Estoy indeciso entre 2-3 opciones',
  'Completamente indeciso',
  'No pienso votar',
  'Prefiero no decirlo',
]

interface CandidateBasic {
  partyCode: string
  partyName: string
  candidateName: string
  colorPrimary?: string
  isActive: boolean
}

export default function CuestionarioDebatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'demographics' | 'questions'>('demographics')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Map<number, string>>(new Map()) // questionId -> optionId
  const [demographics, setDemographics] = useState<Partial<DemographicData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('finalResults')
  const [candidates, setCandidates] = useState<CandidateBasic[]>([])
  const [isLeaderboardCollapsed, setIsLeaderboardCollapsed] = useState(true)

  // Cargar candidatos al montar
  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        if (data.candidates) {
          setCandidates(data.candidates.map((c: any) => ({
            partyCode: c.partyCode,
            partyName: c.partyName,
            candidateName: c.candidateName,
            colorPrimary: c.colorPrimary,
            isActive: c.isActive,
          })))
        }
      })
      .catch(console.error)
  }, [])

  // Calcular scores parciales para el modo carrera
  const partialScores = useMemo(() => {
    return calculatePartialDebateScores(responses, candidates as any)
  }, [responses, candidates])

  const totalQuestions = DEBATE_QUESTIONS.length
  const currentQuestion = DEBATE_QUESTIONS[currentQuestionIndex]
  const answeredCount = responses.size
  const progress = (answeredCount / totalQuestions) * 100

  const isDemographicsComplete =
    demographics.ageRange &&
    demographics.province &&
    demographics.gender &&
    demographics.priorVoteIntention

  const currentSelectedOption = responses.get(currentQuestion?.id) || null
  const isCurrentQuestionAnswered = currentSelectedOption !== null

  const handleDemographicChange = (field: keyof DemographicData, value: string) => {
    setDemographics((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartQuestions = () => {
    if (isDemographicsComplete) {
      setCurrentStep('questions')
    }
  }

  const handleOptionChange = (questionId: number, optionId: string | null) => {
    setResponses((prev) => {
      const newMap = new Map(prev)
      if (optionId === null) {
        newMap.delete(questionId)
      } else {
        newMap.set(questionId, optionId)
      }
      return newMap
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (answeredCount !== totalQuestions) {
      alert('Por favor responde todas las preguntas antes de continuar.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Create session with demographics
      const sessionResponse = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demographics,
          questionnaireVersion: 'debate'
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Error al crear la sesión')
      }

      const { sessionId } = await sessionResponse.json()

      // 2. Save responses (debate format)
      const responsesArray: DebateResponse[] = Array.from(responses.entries()).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      )

      const responsesSubmit = await fetch('/api/responses-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: responsesArray,
        }),
      })

      if (!responsesSubmit.ok) {
        throw new Error('Error al guardar respuestas')
      }

      // 3. Calculate results with debate algorithm
      const resultsResponse = await fetch('/api/results-debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!resultsResponse.ok) {
        throw new Error('Error al calcular resultados')
      }

      // 4. Redirect to results page
      router.push(`/resultados-debate/${sessionId}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Hubo un error al procesar tus respuestas. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  // Get section name for current question
  const getSectionName = (dimension: string): string => {
    if (['leadership', 'experience', 'priority'].includes(dimension)) {
      return 'Perfil de Liderazgo'
    }
    return 'Temas de Gobierno'
  }

  const currentSection = getSectionName(currentQuestion?.dimension || '')
  const isNewSection = currentQuestionIndex === 0 ||
    getSectionName(DEBATE_QUESTIONS[currentQuestionIndex - 1].dimension) !== currentSection

  if (currentStep === 'demographics') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cr-blue-100 text-cr-blue-700">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">Formato Debate</span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-cr-blue-700">
              Debate Presidencial 2026
            </h1>
            <p className="text-gray-700">
              Participa en un debate virtual. Selecciona la postura de cada candidato con la que más te identificas.
            </p>
          </div>

          <div className="space-y-6 rounded-lg bg-white p-8 shadow-md border-2 border-cr-blue-200">
            {/* Age Range */}
            <div>
              <label className="mb-2 block text-sm font-medium text-cr-blue-700">
                Rango de edad
              </label>
              <select
                value={demographics.ageRange || ''}
                onChange={(e) => handleDemographicChange('ageRange', e.target.value)}
                className="w-full rounded-md border-2 border-cr-blue-300 px-4 py-2 focus:border-cr-red-500 focus:outline-none focus:ring-2 focus:ring-cr-red-500"
              >
                <option value="">Selecciona tu rango de edad</option>
                {AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range} años
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="mb-2 block text-sm font-medium text-cr-blue-700">
                Provincia de residencia
              </label>
              <select
                value={demographics.province || ''}
                onChange={(e) => handleDemographicChange('province', e.target.value)}
                className="w-full rounded-md border-2 border-cr-blue-300 px-4 py-2 focus:border-cr-red-500 focus:outline-none focus:ring-2 focus:ring-cr-red-500"
              >
                <option value="">Selecciona tu provincia</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-cr-blue-700">
                Género
              </label>
              <select
                value={demographics.gender || ''}
                onChange={(e) => handleDemographicChange('gender', e.target.value)}
                className="w-full rounded-md border-2 border-cr-blue-300 px-4 py-2 focus:border-cr-red-500 focus:outline-none focus:ring-2 focus:ring-cr-red-500"
              >
                <option value="">Selecciona una opción</option>
                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            {/* Prior Vote Intention */}
            <div>
              <label className="mb-2 block text-sm font-medium text-cr-blue-700">
                Antes de este cuestionario, ¿cuál es tu intención de voto?
              </label>
              <select
                value={demographics.priorVoteIntention || ''}
                onChange={(e) => handleDemographicChange('priorVoteIntention', e.target.value)}
                className="w-full rounded-md border-2 border-cr-blue-300 px-4 py-2 focus:border-cr-red-500 focus:outline-none focus:ring-2 focus:ring-cr-red-500"
              >
                <option value="">Selecciona una opción</option>
                {VOTE_INTENTIONS.map((intention) => (
                  <option key={intention} value={intention}>
                    {intention}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Selection */}
            <div className="border-t-2 border-cr-blue-100 pt-6">
              <label className="mb-3 block text-sm font-medium text-cr-blue-700">
                ¿Cómo quieres ver los resultados?
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setViewMode('liveRace')}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    viewMode === 'liveRace'
                      ? 'border-cr-red-500 bg-cr-red-50'
                      : 'border-cr-blue-200 hover:border-cr-blue-400'
                  }`}
                >
                  <Eye className={`h-6 w-6 ${viewMode === 'liveRace' ? 'text-cr-red-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-semibold ${viewMode === 'liveRace' ? 'text-cr-red-700' : 'text-gray-700'}`}>
                      Carrera en vivo
                    </p>
                    <p className="text-xs text-gray-500">
                      Ver cómo cambian los resultados mientras respondes
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('finalResults')}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    viewMode === 'finalResults'
                      ? 'border-cr-red-500 bg-cr-red-50'
                      : 'border-cr-blue-200 hover:border-cr-blue-400'
                  }`}
                >
                  <EyeOff className={`h-6 w-6 ${viewMode === 'finalResults' ? 'text-cr-red-600' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-semibold ${viewMode === 'finalResults' ? 'text-cr-red-700' : 'text-gray-700'}`}>
                      Solo al final
                    </p>
                    <p className="text-xs text-gray-500">
                      Ver resultados únicamente al terminar
                    </p>
                  </div>
                </button>
              </div>
              {viewMode === 'liveRace' && (
                <p className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  Nota: Ver los resultados en tiempo real podría influir inconscientemente en tus respuestas.
                </p>
              )}
            </div>

            <Button
              size="lg"
              className="w-full !bg-cr-red-500 hover:!bg-cr-red-600 !text-white font-bold !border-2 !border-cr-blue-500 disabled:!bg-gray-300 disabled:!text-gray-500 disabled:!border-gray-400"
              onClick={handleStartQuestions}
              disabled={!isDemographicsComplete}
            >
              Iniciar Debate
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-700 font-medium">
            Tus datos son completamente anónimos y se usan solo para estadísticas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className={`flex gap-6 ${viewMode === 'liveRace' ? 'flex-col lg:flex-row' : ''}`}>
          {/* Main content */}
          <div className={viewMode === 'liveRace' ? 'flex-1 lg:max-w-3xl' : 'max-w-3xl mx-auto w-full'}>
            {/* Header */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-cr-blue-600" />
                  <h1 className="text-2xl font-bold text-cr-blue-700">
                    Debate Presidencial
                  </h1>
                </div>
                <span className="text-sm text-cr-red-600 font-semibold">
                  {answeredCount} / {totalQuestions} preguntas
                </span>
              </div>
              <ProgressBar value={progress} size="lg" showLabel={false} />
            </div>

            {/* Section indicator */}
            {isNewSection && (
              <div className="mb-4 p-3 bg-cr-blue-100 rounded-lg border border-cr-blue-200">
                <p className="text-sm font-semibold text-cr-blue-700">
                  {currentSection === 'Perfil de Liderazgo' ? (
                    <>Sección 2: {currentSection}</>
                  ) : (
                    <>Sección 1: {currentSection}</>
                  )}
                </p>
                <p className="text-xs text-cr-blue-600 mt-1">
                  {currentSection === 'Perfil de Liderazgo'
                    ? 'Estas preguntas ayudan a identificar el tipo de liderazgo que prefieres.'
                    : 'Selecciona la postura con la que más te identificas en cada tema.'}
                </p>
              </div>
            )}

            {/* Question Card */}
            <DebateQuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedOption={currentSelectedOption}
              onChange={(optionId) => handleOptionChange(currentQuestion.id, optionId)}
              className="mb-6"
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="!border-2 !border-cr-blue-500 !bg-transparent !text-cr-blue-600 hover:!bg-cr-blue-50 disabled:!border-gray-300 disabled:!text-gray-400"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </Button>

              <div className="text-sm text-gray-700 font-medium">
                {currentQuestionIndex + 1} / {totalQuestions}
              </div>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  className="!bg-cr-blue-500 !text-white hover:!bg-cr-blue-600 !border !border-cr-red-500 disabled:!bg-gray-300 disabled:!text-gray-500"
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  className="!bg-cr-red-500 !text-white hover:!bg-cr-red-600 !border-2 !border-cr-blue-500 disabled:!bg-gray-300 disabled:!text-gray-500"
                  onClick={handleSubmit}
                  disabled={answeredCount !== totalQuestions || isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Ver Resultados'}
                </Button>
              )}
            </div>

            {/* Warning if not all answered */}
            {currentQuestionIndex === totalQuestions - 1 && answeredCount !== totalQuestions && (
              <p className="mt-4 text-center text-sm text-red-600">
                Por favor responde todas las preguntas para ver tus resultados
              </p>
            )}
          </div>

          {/* Race Leaderboard (only in liveRace mode) */}
          {viewMode === 'liveRace' && (
            <div className="lg:w-80 lg:sticky lg:top-4 lg:self-start">
              <RaceLeaderboard
                scores={partialScores}
                questionsAnswered={answeredCount}
                totalQuestions={totalQuestions}
                isCollapsed={isLeaderboardCollapsed}
                onToggleCollapse={() => setIsLeaderboardCollapsed(!isLeaderboardCollapsed)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
