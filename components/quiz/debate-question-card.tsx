'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DebateQuestion, DebateOption, DIMENSION_NAMES } from '@/lib/questions-debate'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, MessageSquare, Users } from 'lucide-react'

interface DebateQuestionCardProps {
  question: DebateQuestion
  questionNumber: number
  totalQuestions: number
  selectedOption: string | null
  onChange: (optionId: string | null) => void
  showCandidates?: boolean // Show which candidates hold each position
  className?: string
}

export function DebateQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onChange,
  showCandidates = false,
  className,
}: DebateQuestionCardProps) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null)

  const handleOptionClick = (optionId: string) => {
    // Single selection - toggle if already selected
    if (selectedOption === optionId) {
      onChange(null)
    } else {
      onChange(optionId)
    }
  }

  const toggleExpand = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  const dimensionName = DIMENSION_NAMES[question.dimension] || question.dimension

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50">
        {/* Progress and dimension */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-cr-blue-600">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-xs text-cr-red-600 uppercase tracking-wide font-semibold">
            {dimensionName}
          </span>
        </div>

        {/* Topic badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cr-blue-100 text-cr-blue-700 text-xs font-semibold">
            <MessageSquare className="h-3 w-3" />
            {question.tema}
          </span>
        </div>

        {/* Moderator context */}
        <p className="text-sm text-gray-600 italic mb-3">
          &ldquo;{question.contexto}&rdquo;
        </p>

        {/* Main question */}
        <CardTitle className="text-lg leading-tight text-cr-blue-700">
          {question.pregunta}
        </CardTitle>

        <p className="text-sm text-gray-600 mt-2">
          Selecciona la postura con la que más te identificas.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-3" role="radiogroup">
          {question.options.map((option) => (
            <DebateOptionItem
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              isExpanded={expandedOption === option.id}
              showCandidates={showCandidates}
              onClick={() => handleOptionClick(option.id)}
              onToggleExpand={(e) => toggleExpand(option.id, e)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface DebateOptionItemProps {
  option: DebateOption
  isSelected: boolean
  isExpanded: boolean
  showCandidates: boolean
  onClick: () => void
  onToggleExpand: (e: React.MouseEvent) => void
}

function DebateOptionItem({
  option,
  isSelected,
  isExpanded,
  showCandidates,
  onClick,
  onToggleExpand,
}: DebateOptionItemProps) {
  return (
    <div
      className={cn(
        'relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-cr-blue-50',
        isSelected
          ? 'border-cr-blue-600 bg-cr-blue-100 shadow-md'
          : 'border-cr-blue-200'
      )}
      onClick={onClick}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-start">
        {/* Radio indicator */}
        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
            isSelected
              ? 'border-cr-blue-600 bg-cr-blue-600'
              : 'border-cr-blue-300'
          )}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>

        {/* Option content */}
        <div className="ml-3 flex-1">
          {/* Position title */}
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                'block font-semibold',
                isSelected ? 'text-cr-blue-700' : 'text-gray-900'
              )}
            >
              {option.postura}
            </span>
            <button
              type="button"
              onClick={onToggleExpand}
              className={cn(
                'shrink-0 p-1 rounded-full transition-colors',
                isExpanded
                  ? 'bg-cr-blue-100 text-cr-blue-700'
                  : 'text-gray-400 hover:text-cr-blue-600 hover:bg-cr-blue-50'
              )}
              aria-label={isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Brief description */}
          <p className={cn(
            'text-sm mt-1',
            isSelected ? 'text-cr-blue-600' : 'text-gray-600'
          )}>
            {option.descripcion}
          </p>

          {/* Candidate count */}
          <div className="flex items-center gap-1 mt-2">
            <Users className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {option.candidatos.length} {option.candidatos.length === 1 ? 'candidato' : 'candidatos'}
            </span>
          </div>

          {/* Expanded: show candidate codes */}
          {isExpanded && (
            <div className="mt-3 p-3 bg-white rounded border border-cr-blue-100">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Candidatos con esta postura:
              </p>
              <div className="flex flex-wrap gap-1">
                {option.candidatos.map((code) => (
                  <span
                    key={code}
                    className="inline-flex px-2 py-0.5 bg-cr-blue-50 text-cr-blue-700 text-xs rounded-full font-medium"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Compact version for mobile or sidebar use
 */
export function DebateQuestionCardCompact({
  question,
  questionNumber,
  selectedOption,
  onChange,
}: {
  question: DebateQuestion
  questionNumber: number
  selectedOption: string | null
  onChange: (optionId: string | null) => void
}) {
  const dimensionName = DIMENSION_NAMES[question.dimension] || question.dimension

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-cr-blue-600">
          P{questionNumber}
        </span>
        <span className="text-xs text-gray-500">
          {dimensionName}
        </span>
      </div>

      <p className="text-sm font-medium text-gray-900 mb-3">
        {question.pregunta}
      </p>

      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(selectedOption === option.id ? null : option.id)}
            className={cn(
              'w-full text-left px-3 py-2 text-sm rounded border transition-all',
              selectedOption === option.id
                ? 'border-cr-blue-600 bg-cr-blue-100 text-cr-blue-700 font-medium'
                : 'border-gray-200 hover:border-cr-blue-300 hover:bg-cr-blue-50'
            )}
          >
            {option.postura}
          </button>
        ))}
      </div>
    </div>
  )
}
