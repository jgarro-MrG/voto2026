'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  CheckCircle,
  TrendingUp,
  MapPin,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react'

interface StatsData {
  general: {
    totalSessions: number
    completedSessions: number
    completionRate: number
    byVersion: {
      v1: number
      v2: number
      debate: number
    }
  }
  demographics: {
    byProvince: Array<{ province: string; count: number }>
    byAgeRange: Array<{ ageRange: string; count: number }>
    byGender: Array<{ gender: string; count: number }>
    byVoteIntention: Array<{ intention: string; count: number }>
  }
  candidates: {
    topCandidates: Array<{
      partyCode: string
      partyName: string
      candidateName: string
      colorPrimary: string
      timesTop1: number
      avgAffinity: number
    }>
    distribution: Array<{
      partyCode: string
      partyName: string
      candidateName: string
      colorPrimary: string
      rank1: number
      rank2: number
      rank3: number
      totalAppearances: number
    }>
    topByProvince: Record<string, { partyCode: string; candidateName: string; count: number }>
  }
  feedback: {
    helpful: number
    notHelpful: number
    noResponse: number
  }
  activity: {
    last30Days: Array<{ date: string; count: number }>
  }
  generatedAt: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('Error cargando estadísticas')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError('No se pudieron cargar las estadísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cr-blue-500 border-t-transparent mx-auto" />
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Error desconocido'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalFeedback = stats.feedback.helpful + stats.feedback.notHelpful
  const satisfactionRate = totalFeedback > 0
    ? Math.round((stats.feedback.helpful / totalFeedback) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
          <p className="text-gray-600 mt-1">
            Última actualización: {new Date(stats.generatedAt).toLocaleString('es-CR')}
          </p>
        </div>

        {/* General Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Sesiones"
            value={stats.general.totalSessions}
            icon={<Users className="h-5 w-5" />}
            color="blue"
          />
          <StatCard
            title="Completadas"
            value={stats.general.completedSessions}
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
            subtitle={`${stats.general.completionRate}% tasa de completado`}
          />
          <StatCard
            title="Satisfacción"
            value={`${satisfactionRate}%`}
            icon={<ThumbsUp className="h-5 w-5" />}
            color="yellow"
            subtitle={`${totalFeedback} respuestas de feedback`}
          />
          <StatCard
            title="Formato Debate"
            value={stats.general.byVersion.debate}
            icon={<Activity className="h-5 w-5" />}
            color="purple"
            subtitle={`V2: ${stats.general.byVersion.v2} | V1: ${stats.general.byVersion.v1}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Candidates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cr-blue-600" />
                Candidatos Más Afines (Top 1)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.candidates.topCandidates.length > 0 ? (
                <div className="space-y-3">
                  {stats.candidates.topCandidates.slice(0, 10).map((candidate, index) => (
                    <div key={candidate.partyCode} className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                        style={{ backgroundColor: candidate.colorPrimary || '#6b7280' }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            {candidate.partyCode} - {candidate.candidateName}
                          </span>
                          <span className="text-sm font-bold text-cr-blue-600">
                            {candidate.timesTop1}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${(candidate.timesTop1 / (stats.candidates.topCandidates[0]?.timesTop1 || 1)) * 100}%`,
                              backgroundColor: candidate.colorPrimary || '#6b7280',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          Afinidad promedio: {candidate.avgAffinity}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
              )}
            </CardContent>
          </Card>

          {/* Demographics - Province */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cr-red-600" />
                Participación por Provincia
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.demographics.byProvince.length > 0 ? (
                <div className="space-y-3">
                  {stats.demographics.byProvince.map((item) => {
                    const maxCount = stats.demographics.byProvince[0]?.count || 1
                    const percentage = Math.round((item.count / maxCount) * 100)
                    const topCandidate = stats.candidates.topByProvince[item.province]

                    return (
                      <div key={item.province}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.province}</span>
                          <span className="text-sm text-gray-500">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-cr-blue-500 to-cr-red-500 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        {topCandidate && (
                          <span className="text-xs text-gray-500">
                            Top: {topCandidate.partyCode} ({topCandidate.count})
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Age Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Por Edad
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.demographics.byAgeRange.length > 0 ? (
                <div className="space-y-2">
                  {stats.demographics.byAgeRange.map((item) => {
                    const maxCount = Math.max(...stats.demographics.byAgeRange.map(i => i.count))
                    const percentage = Math.round((item.count / maxCount) * 100)

                    return (
                      <div key={item.ageRange} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-16">{item.ageRange}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-4">
                          <div
                            className="bg-green-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(percentage, 10)}%` }}
                          >
                            <span className="text-xs text-white font-medium">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos</p>
              )}
            </CardContent>
          </Card>

          {/* Gender */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Por Género
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.demographics.byGender.length > 0 ? (
                <div className="space-y-2">
                  {stats.demographics.byGender.map((item, index) => {
                    const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#6b7280']
                    const total = stats.demographics.byGender.reduce((sum, i) => sum + i.count, 0)
                    const percentage = Math.round((item.count / total) * 100)

                    return (
                      <div key={item.gender} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-gray-600 flex-1">{item.gender}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                        <span className="text-xs text-gray-400">({item.count})</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos</p>
              )}
            </CardContent>
          </Card>

          {/* Vote Intention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Intención de Voto Previa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.demographics.byVoteIntention.length > 0 ? (
                <div className="space-y-2">
                  {stats.demographics.byVoteIntention.map((item) => {
                    const total = stats.demographics.byVoteIntention.reduce((sum, i) => sum + i.count, 0)
                    const percentage = Math.round((item.count / total) * 100)

                    return (
                      <div key={item.intention} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate flex-1" title={item.intention}>
                          {item.intention.length > 25 ? item.intention.slice(0, 25) + '...' : item.intention}
                        </span>
                        <span className="text-sm font-medium ml-2">{percentage}%</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cr-blue-600" />
              Actividad Últimos 30 Días
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.activity.last30Days.length > 0 ? (
              <div className="h-40 flex items-end gap-1">
                {stats.activity.last30Days.map((day) => {
                  const maxCount = Math.max(...stats.activity.last30Days.map(d => d.count))
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0

                  return (
                    <div
                      key={day.date}
                      className="flex-1 bg-gradient-to-t from-cr-blue-500 to-cr-blue-300 rounded-t hover:from-cr-blue-600 hover:to-cr-blue-400 transition-all cursor-pointer group relative"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${new Date(day.date).toLocaleDateString('es-CR')}: ${day.count} sesiones`}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {day.count}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay actividad en los últimos 30 días</p>
            )}
          </CardContent>
        </Card>

        {/* Candidate Distribution Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cr-blue-600" />
              Distribución Completa de Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Candidato</th>
                    <th className="text-center py-2 px-2">Top 1</th>
                    <th className="text-center py-2 px-2">Top 2</th>
                    <th className="text-center py-2 px-2">Top 3</th>
                    <th className="text-center py-2 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.candidates.distribution.map((candidate) => (
                    <tr key={candidate.partyCode} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: candidate.colorPrimary || '#6b7280' }}
                          />
                          <span className="font-medium">{candidate.partyCode}</span>
                          <span className="text-gray-500 text-xs hidden md:inline">
                            {candidate.candidateName}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-2 px-2 font-bold text-green-600">{candidate.rank1}</td>
                      <td className="text-center py-2 px-2 text-blue-600">{candidate.rank2}</td>
                      <td className="text-center py-2 px-2 text-orange-600">{candidate.rank3}</td>
                      <td className="text-center py-2 px-2 text-gray-600">{candidate.totalAppearances}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ThumbsUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats.feedback.helpful}</p>
                  <p className="text-sm text-green-600">Les fue útil</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ThumbsDown className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.feedback.notHelpful}</p>
                  <p className="text-sm text-red-600">No les fue útil</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-700">{stats.feedback.noResponse}</p>
                  <p className="text-sm text-gray-600">Sin respuesta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  subtitle?: string
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <Card className={`border-2 ${colorClasses[color]}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
          </div>
          <div className="opacity-80">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
