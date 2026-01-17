/**
 * Limpia las transcripciones en formato WebVTT
 * Extrae solo el texto sin timestamps ni metadata
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

interface CleanedTranscript {
  party: string
  candidate: string
  filename: string
  text: string
  wordCount: number
}

/**
 * Extrae el texto limpio de un archivo WebVTT
 */
function cleanWebVTT(content: string): string {
  const lines = content.split('\n')
  const textLines: string[] = []

  let skipNext = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines
    if (line === '') continue

    // Skip WEBVTT header and metadata
    if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:')) {
      continue
    }

    // Skip timestamp lines (formato: 00:00:00.000 --> 00:00:00.000)
    if (line.includes('-->')) {
      skipNext = false // La siguiente línea será texto
      continue
    }

    // Skip lines that look like cue identifiers (números solos)
    if (/^\d+$/.test(line)) {
      continue
    }

    // Skip align/position metadata
    if (line.includes('align:') || line.includes('position:')) {
      continue
    }

    // Extract actual text content
    // Remove timestamp tags like <00:00:10.200><c> texto</c>
    let cleanedLine = line.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
    cleanedLine = cleanedLine.replace(/<\/?c>/g, '')
    cleanedLine = cleanedLine.replace(/\[música\]/gi, '')
    cleanedLine = cleanedLine.replace(/\[aplausos\]/gi, '')
    cleanedLine = cleanedLine.trim()

    if (cleanedLine && cleanedLine.length > 0) {
      textLines.push(cleanedLine)
    }
  }

  // Join with spaces and clean up multiple spaces
  let fullText = textLines.join(' ')
  fullText = fullText.replace(/\s+/g, ' ').trim()

  return fullText
}

/**
 * Extrae información del nombre de archivo
 * Formato: PARTIDO-nombre-del-candidato.txt
 */
function parseFilename(filename: string): { party: string; candidate: string } {
  const nameWithoutExt = filename.replace('.txt', '')
  const parts = nameWithoutExt.split('-')

  const party = parts[0]
  const candidateParts = parts.slice(1)
  const candidate = candidateParts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

  return { party, candidate }
}

/**
 * Procesa todas las transcripciones
 */
export function cleanAllTranscripts(): CleanedTranscript[] {
  const transcriptsDir = join(process.cwd(), 'docs', 'transcripciones')
  const outputDir = join(process.cwd(), 'docs', 'transcripciones-limpias')

  // Crear directorio de salida si no existe
  const fs = require('fs')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const files = readdirSync(transcriptsDir).filter(f => f.endsWith('.txt'))
  const results: CleanedTranscript[] = []

  console.log(`\n📄 Procesando ${files.length} transcripciones...\n`)

  for (const filename of files) {
    const filePath = join(transcriptsDir, filename)
    const content = readFileSync(filePath, 'utf-8')

    const cleanedText = cleanWebVTT(content)
    const { party, candidate } = parseFilename(filename)
    const wordCount = cleanedText.split(/\s+/).length

    // Guardar versión limpia
    const outputPath = join(outputDir, filename)
    writeFileSync(outputPath, cleanedText, 'utf-8')

    const result: CleanedTranscript = {
      party,
      candidate,
      filename,
      text: cleanedText,
      wordCount
    }

    results.push(result)

    console.log(`✓ ${party} - ${candidate}`)
    console.log(`  Palabras: ${wordCount.toLocaleString()}`)
    console.log(`  Guardado: ${outputPath}\n`)
  }

  // Guardar índice JSON
  const indexPath = join(outputDir, 'index.json')
  const index = results.map(r => ({
    party: r.party,
    candidate: r.candidate,
    filename: r.filename,
    wordCount: r.wordCount
  }))

  writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8')
  console.log(`\n📊 Índice guardado: ${indexPath}`)

  // Estadísticas
  const totalWords = results.reduce((sum, r) => sum + r.wordCount, 0)
  const avgWords = Math.round(totalWords / results.length)

  console.log(`\n========================================`)
  console.log(`  RESUMEN`)
  console.log(`========================================`)
  console.log(`Total transcripciones: ${results.length}`)
  console.log(`Total palabras: ${totalWords.toLocaleString()}`)
  console.log(`Promedio palabras: ${avgWords.toLocaleString()}`)
  console.log(`Directorio salida: ${outputDir}`)

  return results
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanAllTranscripts()
}
