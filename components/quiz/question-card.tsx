'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup } from '@/components/ui/radio-group'
import { Question } from '@/lib/types'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  value?: number
  onChange: (value: number) => void
  className?: string
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  className,
}: QuestionCardProps) {
  const options = question.options.map((opt) => ({
    value: opt.value.toString(),
    label: opt.text,
  }))

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="bg-gradient-to-r from-cr-blue-50 to-cr-red-50">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-cr-blue-600">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-xs text-cr-red-600 uppercase tracking-wide font-semibold">
            {(() => {
              const dimensionLabels: Record<string, string> = {
                security: 'Seguridad',
                economy: 'Economía',
                education: 'Educación',
                health: 'Salud',
                agriculture: 'Agricultura',
                environment: 'Ambiente',
                reforms: 'Reformas',
                social: 'Política Social',
              }
              return dimensionLabels[question.dimension] || question.dimension
            })()}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight text-cr-blue-700">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ paddingTop: '24px' }}>
          <RadioGroup
            name={`question-${question.id}`}
            options={options}
            value={value?.toString()}
            onChange={(val) => onChange(parseInt(val, 10))}
            orientation="vertical"
          />
        </div>
      </CardContent>
    </Card>
  )
}
