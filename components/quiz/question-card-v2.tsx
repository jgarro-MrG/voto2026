'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionV2, ProposalOption, DIMENSION_NAMES } from '@/lib/questions-v2'
import { cn } from '@/lib/utils'
import { Info, Users } from 'lucide-react'

interface QuestionCardV2Props {
  question: QuestionV2
  questionNumber: number
  totalQuestions: number
  selectedOptions: string[]
  onChange: (selectedIds: string[]) => void
  className?: string
}

export function QuestionCardV2({
  question,
  questionNumber,
  totalQuestions,
  selectedOptions,
  onChange,
  className,
}: QuestionCardV2Props) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null)

  const handleOptionClick = (optionId: string) => {
    if (question.multiSelect) {
      // Toggle selection for multi-select
      if (selectedOptions.includes(optionId)) {
        onChange(selectedOptions.filter(id => id !== optionId))
      } else {
        onChange([...selectedOptions, optionId])
      }
    } else {
      // Single select - replace selection
      onChange([optionId])
    }
  }

  const toggleDescription = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  const dimensionName = DIMENSION_NAMES[question.dimension] || question.dimension

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-cr-blue-600">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-xs text-cr-red-600 uppercase tracking-wide font-semibold">
            {dimensionName}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight text-cr-blue-700">
          {question.text}
        </CardTitle>
        {question.multiSelect && (
          <p className="text-sm text-gray-600 mt-2">
            Puedes seleccionar varias opciones si estás de acuerdo con más de una propuesta.
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3" role={question.multiSelect ? 'group' : 'radiogroup'}>
          {question.options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              isSelected={selectedOptions.includes(option.id)}
              isMultiSelect={question.multiSelect}
              isExpanded={expandedOption === option.id}
              onClick={() => handleOptionClick(option.id)}
              onToggleDescription={(e) => toggleDescription(option.id, e)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface OptionItemProps {
  option: ProposalOption
  isSelected: boolean
  isMultiSelect: boolean
  isExpanded: boolean
  onClick: () => void
  onToggleDescription: (e: React.MouseEvent) => void
}

function OptionItem({
  option,
  isSelected,
  isMultiSelect,
  isExpanded,
  onClick,
  onToggleDescription,
}: OptionItemProps) {
  return (
    <div
      className={cn(
        'relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-cr-blue-50',
        isSelected
          ? 'border-cr-red-500 bg-cr-red-50 shadow-md'
          : 'border-cr-blue-200'
      )}
      onClick={onClick}
      role={isMultiSelect ? 'checkbox' : 'radio'}
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
        {/* Checkbox/Radio indicator */}
        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all',
            isMultiSelect ? 'rounded' : 'rounded-full',
            isSelected
              ? 'border-cr-red-500 bg-cr-red-500'
              : 'border-cr-blue-300'
          )}
        >
          {isSelected && (
            isMultiSelect ? (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <div className="h-2 w-2 rounded-full bg-white" />
            )
          )}
        </div>

        {/* Option content */}
        <div className="ml-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                'block text-sm font-medium',
                isSelected ? 'text-cr-red-700' : 'text-gray-900'
              )}
            >
              {option.text}
            </span>
            <button
              type="button"
              onClick={onToggleDescription}
              className={cn(
                'shrink-0 p-1 rounded-full transition-colors',
                isExpanded ? 'bg-cr-blue-100 text-cr-blue-700' : 'text-gray-400 hover:text-cr-blue-600 hover:bg-cr-blue-50'
              )}
              aria-label="Ver más información"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          {/* Candidate count badge */}
          <div className="flex items-center gap-1 mt-2">
            <Users className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              {option.candidatos.length} {option.candidatos.length === 1 ? 'candidato' : 'candidatos'} apoyan esta propuesta
            </span>
          </div>

          {/* Expanded description */}
          {isExpanded && (
            <div className="mt-3 p-3 bg-white rounded border border-cr-blue-100 text-sm text-gray-600">
              {option.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
