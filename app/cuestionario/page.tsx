'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { QuestionCard } from '@/components/quiz/question-card'
import { PrioritySelector } from '@/components/quiz/priority-selector'
import { questions } from '@/lib/questions'
import { UserResponse, DimensionWeights } from '@/lib/types'

type DemographicData = {
  ageRange: string
  province: string
  gender: string
  priorVoteIntention: string
}

const AGE_RANGES = [
  '18-25',
  '26-35',
  '36-45',
  '46-55',
  '56-65',
  '65+',
]

const PROVINCES = [
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón',
]

const GENDERS = [
  'Masculino',
  'Femenino',
  'Otro',
  'Prefiero no decir',
]

const VOTE_INTENTIONS = [
  'Ya tenía un candidato en mente',
  'Estaba indeciso entre 2-3 opciones',
  'Completamente indeciso',
  'No pensaba votar',
  'Prefiero no decir',
]

export default function CuestionarioPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'demographics' | 'priorities' | 'questions'>('demographics')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Map<number, number>>(new Map())
  const [demographics, setDemographics] = useState<Partial<DemographicData>>({})
  const [dimensionWeights, setDimensionWeights] = useState<DimensionWeights | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = responses.size
  const progress = (answeredCount / totalQuestions) * 100

  // Check if demographics are complete
  const isDemographicsComplete =
    demographics.ageRange &&
    demographics.province &&
    demographics.gender &&
    demographics.priorVoteIntention

  // Check if current question is answered
  const isCurrentQuestionAnswered = responses.has(currentQuestion?.id || -1)

  const handleDemographicChange = (field: keyof DemographicData, value: string) => {
    setDemographics((prev) => ({ ...prev, [field]: value }))
  }

  const handleStartQuestions = () => {
    if (isDemographicsComplete) {
      setCurrentStep('priorities')
    }
  }

  const handlePrioritiesComplete = (weights: DimensionWeights) => {
    setDimensionWeights(weights)
    setCurrentStep('questions')
  }

  const handleAnswerChange = (questionId: number, score: number) => {
    setResponses((prev) => {
      const newMap = new Map(prev)
      newMap.set(questionId, score)
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
      // 1. Create session with demographics and dimension weights
      const sessionResponse = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demographics,
          dimensionWeights
        }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Error al crear la sesión')
      }

      const { sessionId } = await sessionResponse.json()

      // 2. Save responses
      const responsesArray: UserResponse[] = Array.from(responses.entries()).map(
        ([questionId, score]) => {
          const question = questions.find((q) => q.id === questionId)
          return {
            questionId,
            dimension: question?.dimension || 'security',
            score,
          }
        }
      )

      const responsesSubmit = await fetch('/api/responses', {
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

      // 3. Calculate results
      const resultsResponse = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })

      if (!resultsResponse.ok) {
        throw new Error('Error al calcular resultados')
      }

      // 4. Redirect to results page
      router.push(`/resultados/${sessionId}`)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Hubo un error al procesar tus respuestas. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  if (currentStep === 'demographics') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-cr-blue-700">
              Cuestionario Voto2026
            </h1>
            <p className="text-gray-700">
              Primero, cuéntanos un poco sobre ti (datos anónimos para estadísticas)
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
                Antes de este cuestionario, ¿ya tenías una intención de voto?
              </label>
              <select
                value={demographics.priorVoteIntention || ''}
                onChange={(e) =>
                  handleDemographicChange('priorVoteIntention', e.target.value)
                }
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

            <Button
              size="lg"
              className="w-full !bg-cr-red-500 hover:!bg-cr-red-600 !text-white font-bold !border-2 !border-cr-blue-500 disabled:!bg-gray-300 disabled:!text-gray-500 disabled:!border-gray-400"
              onClick={handleStartQuestions}
              disabled={!isDemographicsComplete}
            >
              Continuar
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-700 font-medium">
            Tus datos son completamente anónimos y se usan solo para estadísticas.
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === 'priorities') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <PrioritySelector onComplete={handlePrioritiesComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cr-blue-50 via-white to-cr-red-50 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-cr-blue-700">
              Cuestionario Electoral
            </h1>
            <span className="text-sm text-cr-red-600 font-semibold">
              {answeredCount} / {totalQuestions} respondidas
            </span>
          </div>
          <ProgressBar value={progress} size="lg" showLabel={false} />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          value={responses.get(currentQuestion.id)}
          onChange={(score) => handleAnswerChange(currentQuestion.id, score)}
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
        {currentQuestionIndex === totalQuestions - 1 &&
          answeredCount !== totalQuestions && (
            <p className="mt-4 text-center text-sm text-red-600">
              Por favor responde todas las preguntas para ver tus resultados
            </p>
          )}
      </div>
    </div>
  )
}
