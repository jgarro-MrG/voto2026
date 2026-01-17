/**
 * Prepara las transcripciones para análisis con agente
 * Genera archivos con instrucciones estructuradas
 */

import { readFileSync, writeFileSync } from 'fs'
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

const ANALYSIS_TEMPLATE = `# INSTRUCCIONES DE ANÁLISIS

Analiza esta transcripción de entrevista del TSE y extrae las posiciones políticas del candidato.

## CANDIDATO: {CANDIDATE}
## PARTIDO: {PARTY}

## DIMENSIONES A ANALIZAR:

1. **Seguridad y Justicia**: Seguridad ciudadana, sistema judicial, crimen, policía
2. **Economía y Empleo**: Empleo, salarios, inversión, impuestos, comercio
3. **Educación**: Sistema educativo, universidades, formación técnica
4. **Salud**: CCSS, hospitales, sistema de salud
5. **Sector Agropecuario**: Agricultura, ganadería, desarrollo rural
6. **Medio Ambiente**: Protección ambiental, cambio climático
7. **Reformas Institucionales**: Transparencia, modernización del Estado
8. **Política Social**: Programas sociales, pobreza, desigualdad

## FORMATO DE SALIDA REQUERIDO:

Genera un archivo JSON con esta estructura:

\`\`\`json
{
  "party": "{PARTY}",
  "candidate": "{CANDIDATE}",
  "overallSummary": "Resumen general del candidato en 3-4 oraciones sobre su visión y enfoque político",
  "dimensions": [
    {
      "dimension": "security",
      "summary": "Resumen de 2-3 oraciones sobre su posición en seguridad",
      "keyProposals": ["Propuesta específica 1", "Propuesta específica 2"],
      "stance": "progressive/moderate/conservative/not_mentioned"
    },
    {
      "dimension": "economy",
      "summary": "Resumen sobre economía",
      "keyProposals": ["Propuesta 1", "Propuesta 2"],
      "stance": "progressive/moderate/conservative/not_mentioned"
    }
    // ... resto de dimensiones
  ],
  "generatedAt": "{TIMESTAMP}"
}
\`\`\`

## CRITERIOS DE CLASIFICACIÓN (stance):

- **progressive**: Favorece mayor intervención estatal, programas sociales amplios, enfoque en derechos
- **moderate**: Balance entre intervención estatal y mercado, posiciones centristas
- **conservative**: Favorece mercado libre, responsabilidad individual, Estado limitado
- **not_mentioned**: El tema no fue abordado en la entrevista

## REGLAS IMPORTANTES:

1. Ser OBJETIVO y fiel al contenido real de la transcripción
2. Si una dimensión NO se menciona, usar stance: "not_mentioned"
3. Extraer SOLO propuestas concretas mencionadas, no inferir
4. Usar lenguaje claro y conciso
5. Evitar sesgos políticos personales

---

# TRANSCRIPCIÓN:

{TRANSCRIPT}

---

# TAREA:

Lee la transcripción completa arriba y genera el análisis JSON estructurado según las instrucciones.
Guarda el resultado en: docs/analisis-candidatos/{PARTY}-{CANDIDATE_SLUG}.json
`

interface TranscriptInfo {
  party: string
  candidate: string
  filename: string
  wordCount: number
  analysisFile: string
}

/**
 * Genera archivos de instrucciones para cada transcripción
 */
export function prepareTranscriptsForAgent(): TranscriptInfo[] {
  const cleanedDir = join(process.cwd(), 'docs', 'transcripciones-limpias')
  const outputDir = join(process.cwd(), 'docs', 'analisis-candidatos')
  const instructionsDir = join(process.cwd(), 'docs', 'analisis-instructions')

  // Crear directorios
  const fs = require('fs')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  if (!fs.existsSync(instructionsDir)) {
    fs.mkdirSync(instructionsDir, { recursive: true })
  }

  // Leer índice
  const indexPath = join(cleanedDir, 'index.json')
  const index = JSON.parse(readFileSync(indexPath, 'utf-8'))

  console.log(`\n📋 Preparando ${index.length} transcripciones para análisis con agente...\n`)

  const results: TranscriptInfo[] = []

  for (const item of index) {
    const transcriptPath = join(cleanedDir, item.filename)
    const transcript = readFileSync(transcriptPath, 'utf-8')

    const candidateSlug = item.candidate.toLowerCase().replace(/\s+/g, '-')
    const analysisFilename = `${item.party}-${candidateSlug}.json`

    // Generar archivo de instrucciones
    const instructions = ANALYSIS_TEMPLATE
      .replace(/{CANDIDATE}/g, item.candidate)
      .replace(/{PARTY}/g, item.party)
      .replace(/{TRANSCRIPT}/g, transcript)
      .replace(/{TIMESTAMP}/g, new Date().toISOString())
      .replace(/{CANDIDATE_SLUG}/g, candidateSlug)

    const instructionPath = join(instructionsDir, `${item.party}-instructions.md`)
    writeFileSync(instructionPath, instructions, 'utf-8')

    const info: TranscriptInfo = {
      party: item.party,
      candidate: item.candidate,
      filename: item.filename,
      wordCount: item.wordCount,
      analysisFile: analysisFilename
    }

    results.push(info)

    console.log(`✓ ${item.party} - ${item.candidate}`)
    console.log(`  Instrucciones: ${instructionPath}`)
    console.log(`  Salida: docs/analisis-candidatos/${analysisFilename}\n`)
  }

  // Guardar lista de análisis pendientes
  const queuePath = join(outputDir, 'analysis-queue.json')
  writeFileSync(queuePath, JSON.stringify(results, null, 2), 'utf-8')

  console.log(`📊 Lista de análisis guardada: ${queuePath}`)
  console.log(`\n========================================`)
  console.log(`  LISTO PARA PROCESAR`)
  console.log(`========================================`)
  console.log(`Total transcripciones: ${results.length}`)
  console.log(`Instrucciones en: ${instructionsDir}`)
  console.log(`\nSiguiente paso: Usar agentes para procesar cada candidato`)

  return results
}

// Ejecutar si se llama directamente
if (require.main === module) {
  prepareTranscriptsForAgent()
}
