import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format percentage with decimals
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get political tendency label based on average score
 */
export function getPoliticalTendency(avgScore: number): string {
  if (avgScore >= 4.5) return 'Izquierda'
  if (avgScore >= 4.0) return 'Centro-Izquierda Progresista'
  if (avgScore >= 3.5) return 'Centro-Izquierda'
  if (avgScore >= 2.5) return 'Centro'
  if (avgScore >= 2.0) return 'Centro-Derecha'
  return 'Derecha/Liberal'
}

/**
 * Get color for affinity percentage
 */
export function getAffinityColor(affinity: number): string {
  if (affinity >= 80) return 'text-green-600'
  if (affinity >= 60) return 'text-blue-600'
  if (affinity >= 40) return 'text-yellow-600'
  return 'text-gray-600'
}

/**
 * Truncate text to max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
