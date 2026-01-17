/**
 * Analiza transcripciones usando Claude AI
 * Genera resúmenes estructurados por las 8 dimensiones políticas
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const DIMENSIONS = {
  security: 'Seguridad y Justicia',
  economy: 'Economía y Empleo',
  education: 'Educación',
  health: 'Salud',
  agriculture: 'Sector Agropecuario',
  environment: 'Medio Ambiente',
  reforms: 'Reformas Institucionales',
  social: 'Política Social'
} as const

interface DimensionAnalysis {
  dimension: keyof typeof DIMENSIONS
  summary: string
  keyProposals: string[]
  stance: 'progressive' | 'moderate' | 'conservative' | 'not_mentioned'
}

interface CandidateAnalysis {
  party: string
  candidate: string
  overallSummary: string
  dimensions: DimensionAnalysis[]
  generatedAt: string
}

/**
 * Genera el prompt para analizar una transcripción
 */
function generateAnalysisPrompt(candidateName: string, transcriptText: string): string {
  return `Analiza esta transcripción de la entrevista oficial del TSE al candidato presidencial ${candidateName} para las elecciones de Costa Rica 2026.

TRANSCRIPCIÓN:
${transcriptText.substring(0, 50000)} ${transcriptText.length > 50000 ? '[... transcripción completa truncada por límite de tokens]' : ''}

TAREA:
Extrae las posiciones y propuestas del candidato organizadas por estas 8 dimensiones políticas:

1. **Seguridad y Justicia**: Seguridad ciudadana, sistema judicial, crimen, policía
2. **Economía y Empleo**: Empleo, salarios, inversión, impuestos, comercio
3. **Educación**: Sistema educativo, universidades, formación técnica
4. **Salud**: CCSS, hospitales, sistema de salud
5. **Sector Agropecuario**: Agricultura, ganadería, desarrollo rural
6. **Medio Ambiente**: Protección ambiental, cambio climático
7. **Reformas Institucionales**: Transparencia, modernización del Estado
8. **Política Social**: Programas sociales, pobreza, desigualdad

Para CADA dimensión, proporciona:
- Un resumen conciso (2-3 oraciones) de su posición
- 2-3 propuestas específicas mencionadas
- Su tendencia: progressive/moderate/conservative/not_mentioned

FORMATO DE RESPUESTA (JSON):
{
  "overallSummary": "Resumen general del candidato en 3-4 oraciones",
  "dimensions": [
    {
      "dimension": "security",
      "summary": "Resumen de su posición en seguridad",
      "keyProposals": ["Propuesta 1", "Propuesta 2"],
      "stance": "moderate"
    },
    // ... resto de dimensiones
  ]
}

IMPORTANTE:
- Si una dimensión NO se menciona en la entrevista, usar stance: "not_mentioned" y summary: "No se abordó específicamente en la entrevista"
- Ser objetivo y fiel al contenido de la transcripción
- Usar lenguaje claro y conciso
- Enfocarse en propuestas concretas, no en retórica general

Responde ÚNICAMENTE con el JSON, sin texto adicional.`
}

/**
 * Llama a la API de Claude para analizar una transcripción
 * NOTA: Requiere ANTHROPIC_API_KEY en .env.local
 */
async function analyzeWithClaude(prompt: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY no está configurada en .env.local')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.content[0].text

  // Extraer JSON del contenido (en caso de que haya texto adicional)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta')
  }

  return JSON.parse(jsonMatch[0])
}

/**
 * Procesa una transcripción limpia
 */
async function analyzeTranscript(
  party: string,
  candidate: string,
  transcriptText: string
): Promise<CandidateAnalysis> {
  console.log(`\n🤖 Analizando: ${party} - ${candidate}`)
  console.log(`   Longitud: ${transcriptText.length.toLocaleString()} caracteres`)

  const prompt = generateAnalysisPrompt(candidate, transcriptText)

  try {
    const analysis = await analyzeWithClaude(prompt)

    const result: CandidateAnalysis = {
      party,
      candidate,
      overallSummary: analysis.overallSummary,
      dimensions: analysis.dimensions,
      generatedAt: new Date().toISOString()
    }

    console.log(`   ✓ Análisis completado`)
    return result
  } catch (error) {
    console.error(`   ✗ Error al analizar: ${error}`)
    throw error
  }
}

/**
 * Procesa todas las transcripciones limpias
 */
export async function analyzeAllTranscripts(
  options: {
    startFrom?: number
    limit?: number
    delayMs?: number
  } = {}
): Promise<CandidateAnalysis[]> {
  const { startFrom = 0, limit, delayMs = 2000 } = options

  const cleanedDir = join(process.cwd(), 'docs', 'transcripciones-limpias')
  const outputDir = join(process.cwd(), 'docs', 'analisis-candidatos')

  // Verificar que exista el directorio de transcripciones limpias
  const fs = require('fs')
  if (!fs.existsSync(cleanedDir)) {
    throw new Error('Primero ejecuta: npm run clean-transcripts')
  }

  // Crear directorio de salida
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Leer índice
  const indexPath = join(cleanedDir, 'index.json')
  const index = JSON.parse(readFileSync(indexPath, 'utf-8'))

  // Aplicar filtros
  let filesToProcess = index.slice(startFrom, limit ? startFrom + limit : undefined)

  console.log(`\n========================================`)
  console.log(`  ANÁLISIS CON IA`)
  console.log(`========================================`)
  console.log(`Total candidatos: ${index.length}`)
  console.log(`A procesar: ${filesToProcess.length}`)
  console.log(`Comenzando desde: ${startFrom + 1}`)
  console.log(`Pausa entre llamadas: ${delayMs}ms`)

  const results: CandidateAnalysis[] = []

  for (let i = 0; i < filesToProcess.length; i++) {
    const item = filesToProcess[i]
    const filePath = join(cleanedDir, item.filename)
    const transcriptText = readFileSync(filePath, 'utf-8')

    try {
      const analysis = await analyzeTranscript(item.party, item.candidate, transcriptText)
      results.push(analysis)

      // Guardar análisis individual
      const outputFilename = `${item.party}-${item.candidate.toLowerCase().replace(/\s+/g, '-')}.json`
      const outputPath = join(outputDir, outputFilename)
      writeFileSync(outputPath, JSON.stringify(analysis, null, 2), 'utf-8')

      console.log(`   💾 Guardado: ${outputFilename}`)

      // Pausa entre llamadas para no saturar la API
      if (i < filesToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      console.error(`   ❌ Error procesando ${item.party} - ${item.candidate}:`, error)
      // Continuar con el siguiente
    }
  }

  // Guardar resultados consolidados
  const consolidatedPath = join(outputDir, 'all-analyses.json')
  writeFileSync(consolidatedPath, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`\n========================================`)
  console.log(`  COMPLETADO`)
  console.log(`========================================`)
  console.log(`Analizados exitosamente: ${results.length}/${filesToProcess.length}`)
  console.log(`Resultados guardados en: ${outputDir}`)

  return results
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2)
  const startFrom = args[0] ? parseInt(args[0]) : 0
  const limit = args[1] ? parseInt(args[1]) : undefined

  analyzeAllTranscripts({ startFrom, limit })
    .then(() => {
      console.log('\n✅ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
}
