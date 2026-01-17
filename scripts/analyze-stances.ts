import * as fs from 'fs'
import * as path from 'path'

const analysisDir = './docs/analisis-candidatos'
const files = fs.readdirSync(analysisDir).filter(f => f.endsWith('.json') && f !== 'all-analyses.json')

interface DimensionData {
  stance: string
  summary: string
  keyProposals: string[]
}

interface CandidateData {
  party: string
  candidate: string
  dimensions: Record<string, DimensionData>
}

const allData: CandidateData[] = []

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(analysisDir, file), 'utf-8'))
  const dims: Record<string, DimensionData> = {}

  for (const dim of data.dimensions) {
    const dimName = dim.name || dim.dimension
    if (dimName) {
      dims[dimName] = {
        stance: dim.stance,
        summary: dim.summary,
        keyProposals: dim.keyProposals || []
      }
    }
  }

  allData.push({
    party: data.party,
    candidate: data.candidate,
    dimensions: dims
  })
}

// Mostrar resumen por dimensión
const dimensions = ['security', 'economy', 'education', 'health', 'agriculture', 'environment', 'reforms', 'social']

console.log('\n📊 ANÁLISIS DE POSICIONES POR DIMENSIÓN (basado en entrevistas TSE)')
console.log('=' .repeat(70))

for (const dim of dimensions) {
  console.log('\n' + '─'.repeat(70))
  console.log(`📌 ${dim.toUpperCase()}`)
  console.log('─'.repeat(70))

  const byStance: Record<string, string[]> = {
    conservative: [],
    moderate: [],
    progressive: [],
    not_mentioned: []
  }

  for (const candidate of allData) {
    const stance = candidate.dimensions[dim]?.stance || 'not_mentioned'
    byStance[stance].push(candidate.party)
  }

  console.log(`\n🔴 Conservador (${byStance.conservative.length}): ${byStance.conservative.join(', ') || 'ninguno'}`)
  console.log(`🟡 Moderado (${byStance.moderate.length}): ${byStance.moderate.join(', ') || 'ninguno'}`)
  console.log(`🔵 Progresista (${byStance.progressive.length}): ${byStance.progressive.join(', ') || 'ninguno'}`)
  console.log(`⚪ Sin posición clara (${byStance.not_mentioned.length}): ${byStance.not_mentioned.join(', ') || 'ninguno'}`)
}

// Generar JSON para crear preguntas de debate
console.log('\n\n📋 DATOS PARA PREGUNTAS DE DEBATE:')
console.log('=' .repeat(70))

const debateData: Record<string, Record<string, string[]>> = {}

for (const dim of dimensions) {
  debateData[dim] = {
    conservative: [],
    moderate: [],
    progressive: [],
    not_mentioned: []
  }

  for (const candidate of allData) {
    const stance = candidate.dimensions[dim]?.stance || 'not_mentioned'
    debateData[dim][stance].push(candidate.party)
  }
}

console.log(JSON.stringify(debateData, null, 2))
