'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { type Dimension, type DimensionWeights, DIMENSIONS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PrioritySelectorProps {
  onComplete: (weights: DimensionWeights) => void
}

type PriorityValue = 1 | 2 | 3

const priorityLabels: Record<PriorityValue, string> = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta'
}

const priorityDescriptions: Record<PriorityValue, string> = {
  1: 'Este tema tiene poca importancia para mí en esta elección',
  2: 'Este tema tiene importancia moderada para mí',
  3: 'Este tema es una prioridad fundamental para mi voto'
}

const dimensionDescriptions: Record<Dimension, string> = {
  security: 'Seguridad ciudadana, justicia, sistema penal y prevención del crimen',
  economy: 'Empleo, salarios, inversión, comercio y desarrollo económico',
  education: 'Sistema educativo, universidades, formación técnica y acceso',
  health: 'CCSS, hospitales, atención médica y prevención de enfermedades',
  agriculture: 'Sector agropecuario, producción rural y desarrollo agrícola',
  environment: 'Protección ambiental, cambio climático y recursos naturales',
  reforms: 'Reformas institucionales, transparencia y modernización del Estado',
  social: 'Programas sociales, pobreza, desigualdad y protección vulnerable'
}

export function PrioritySelector({ onComplete }: PrioritySelectorProps) {
  const [priorities, setPriorities] = useState<Record<Dimension, PriorityValue>>({
    security: 2,
    economy: 2,
    education: 2,
    health: 2,
    agriculture: 2,
    environment: 2,
    reforms: 2,
    social: 2
  })

  const handlePriorityChange = (dimension: Dimension, value: PriorityValue) => {
    setPriorities(prev => ({ ...prev, [dimension]: value }))
  }

  const handleContinue = () => {
    const weights: DimensionWeights = {
      security: priorities.security,
      economy: priorities.economy,
      education: priorities.education,
      health: priorities.health,
      agriculture: priorities.agriculture,
      environment: priorities.environment,
      reforms: priorities.reforms,
      social: priorities.social
    }
    onComplete(weights)
  }

  const dimensions = Object.keys(DIMENSIONS) as Dimension[]

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cr-blue-700 mb-2">
          Defina sus Prioridades
        </h2>
        <p className="text-gray-600">
          Antes de comenzar el cuestionario, indique qué tan importante es cada tema para usted.
          Esto nos ayudará a ponderar sus respuestas y encontrar candidatos más alineados con sus prioridades.
        </p>
      </div>

      <div className="space-y-6">
        {dimensions.map((dimension) => (
          <div
            key={dimension}
            className="border-2 border-cr-blue-200 rounded-lg p-4 hover:border-cr-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {DIMENSIONS[dimension]}
                  </h3>
                  <Tooltip content={dimensionDescriptions[dimension]} />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {dimensionDescriptions[dimension]}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {([1, 2, 3] as PriorityValue[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePriorityChange(dimension, value)}
                  className={cn(
                    'flex-1 py-3 px-4 rounded-lg border-2 transition-all',
                    'hover:border-cr-blue-400 hover:bg-cr-blue-50',
                    'focus:outline-none focus:ring-2 focus:ring-cr-blue-400',
                    priorities[dimension] === value
                      ? 'border-cr-red-500 bg-cr-red-50 shadow-md'
                      : 'border-cr-blue-200 bg-white'
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        priorities[dimension] === value
                          ? 'text-cr-red-700'
                          : 'text-gray-700'
                      )}
                    >
                      {priorityLabels[value]}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i < value
                              ? priorities[dimension] === value
                                ? 'bg-cr-red-500'
                                : 'bg-cr-blue-400'
                              : 'bg-gray-300'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          onClick={handleContinue}
          className="px-8"
          style={{
            backgroundColor: '#CE1126',
            color: '#FFFFFF',
            border: '2px solid #002B7F'
          }}
        >
          Continuar al Cuestionario
        </Button>
      </div>
    </Card>
  )
}
