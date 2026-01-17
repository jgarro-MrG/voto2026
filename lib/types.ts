// ============================================
// TYPES para Voto2026
// ============================================

export type Dimension =
  | 'security'
  | 'economy'
  | 'education'
  | 'health'
  | 'agriculture'
  | 'environment'
  | 'reforms'
  | 'social'

export const DIMENSIONS: Record<Dimension, string> = {
  security: 'Seguridad y Justicia',
  economy: 'Economía y Empleo',
  education: 'Educación',
  health: 'Salud',
  agriculture: 'Sector Agropecuario',
  environment: 'Medio Ambiente',
  reforms: 'Reformas Institucionales',
  social: 'Política Social'
}

export interface DimensionScores {
  security: number
  economy: number
  education: number
  health: number
  agriculture: number
  environment: number
  reforms: number
  social: number
}

export interface Candidate {
  id: number
  partyCode: string
  partyName: string
  candidateName: string
  candidatePhoto?: string
  partyLogo?: string
  slogan?: string
  colorPrimary?: string
  colorSecondary?: string
  websiteUrl?: string
  scores: DimensionScores
  planSummary?: string
  isActive: boolean
}

export interface Question {
  id: number
  text: string
  dimension: Dimension
  options: QuestionOption[]
}

export interface QuestionOption {
  value: number // 1-5
  label: string
  text: string
  description?: string // Explicación para tooltip
}

export interface UserResponse {
  questionId: number
  dimension: Dimension
  score: number
  timeSpent?: number
}

export type PriorityLevel = 'low' | 'medium' | 'high'

export interface DimensionWeights {
  security: number
  economy: number
  education: number
  health: number
  agriculture: number
  environment: number
  reforms: number
  social: number
}

export interface DemographicData {
  ageRange?: '18-25' | '26-35' | '36-45' | '46-60' | '60+'
  province?: Province
  gender?: 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir'
  priorVoteIntention?: 'Sí, estoy decidido/a' | 'Tenía algunas opciones en mente' | 'No, estoy completamente indeciso/a'
}

export type Province =
  | 'San José'
  | 'Alajuela'
  | 'Cartago'
  | 'Heredia'
  | 'Guanacaste'
  | 'Puntarenas'
  | 'Limón'

export interface Session {
  id: string // UUID
  userId?: number
  demographics: DemographicData
  dimensionWeights?: DimensionWeights
  responses: UserResponse[]
  userScores?: DimensionScores
  isCompleted: boolean
  startedAt: Date
  completedAt?: Date
}

export interface CandidateMatch {
  candidate: Candidate
  affinityPercentage: number
  dimensionMatches: Record<Dimension, {
    userScore: number
    candidateScore: number
    difference: number
    matchPercentage: number
  }>
  overallDistance: number
}

export interface MatchResult {
  sessionId: string
  userScores: DimensionScores
  matches: CandidateMatch[]
  top3: CandidateMatch[]
  wasHelpful?: boolean
  createdAt: Date
}

// Helper types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SessionResponse extends ApiResponse<{ sessionId: string }> {}
export interface ResultsResponse extends ApiResponse<MatchResult> {}

// Admin types
export interface AdminUser {
  id: number
  username: string
  email: string
  fullName?: string
  role: 'admin' | 'super_admin' | 'viewer'
  isActive: boolean
  lastLogin?: Date
}

export interface StatsResponse {
  totalSessions: number
  completedSessions: number
  avgCompletionTime?: number
  byProvince: Record<Province, number>
  byAgeRange: Record<string, number>
  topCandidates: Array<{
    candidateId: number
    candidateName: string
    partyName: string
    timesTop1: number
    avgAffinity: number
  }>
}
