/**
 * Script para procesar transcripciones de entrevistas del TSE
 *
 * Este script:
 * 1. Lee archivos de transcripción de docs/transcripciones/
 * 2. Analiza el contenido para extraer posiciones sobre cada dimensión
 * 3. Genera resúmenes mejorados basados en el contenido real
 *
 * Uso: npm run process-transcripts
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

interface TranscriptFile {
  partyCode: string
  candidateName: string
  content: string
  filepath: string
}

async function processTranscripts() {
  console.log('📝 Procesando transcripciones de entrevistas del TSE\n')

  const transcriptsDir = resolve(process.cwd(), 'docs/transcripciones')

  // Verificar si existe el directorio
  if (!existsSync(transcriptsDir)) {
    console.log('❌ No se encontró el directorio docs/transcripciones/')
    console.log('\n📋 Para crear transcripciones:')
    console.log('   1. Crear directorio: mkdir -p docs/transcripciones')
    console.log('   2. Agregar archivos .txt con las transcripciones')
    console.log('   3. Formato de nombre: PARTIDO-Candidato.txt')
    console.log('\n📖 Ver guía completa en: docs/TRANSCRIPCIONES-GUIA.md\n')
    return
  }

  // Leer archivos de transcripción
  const files = readdirSync(transcriptsDir).filter(f => f.endsWith('.txt'))

  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos de transcripción en docs/transcripciones/')
    console.log('\n📖 Ver guía en: docs/TRANSCRIPCIONES-GUIA.md\n')
    return
  }

  console.log(`✅ Encontrados ${files.length} archivos de transcripción\n`)

  const transcripts: TranscriptFile[] = []

  for (const file of files) {
    const filepath = resolve(transcriptsDir, file)
    const content = readFileSync(filepath, 'utf-8')

    // Extraer partido y candidato del nombre del archivo
    const parts = file.replace('.txt', '').split('-')
    const partyCode = parts[0]
    const candidateName = parts.slice(1).join(' ')

    transcripts.push({
      partyCode,
      candidateName,
      content,
      filepath,
    })

    console.log(`  ✓ ${partyCode} - ${candidateName} (${content.length} caracteres)`)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 ANÁLISIS DE TRANSCRIPCIONES')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Palabras clave por dimensión para análisis básico
  const keywords = {
    security: ['seguridad', 'policía', 'delincuencia', 'crimen', 'justicia', 'cárcel', 'pena'],
    economy: ['economía', 'empleo', 'trabajo', 'empresa', 'impuesto', 'fiscal', 'deuda'],
    education: ['educación', 'escuela', 'universidad', 'estudiante', 'maestro', 'docente'],
    health: ['salud', 'ccss', 'hospital', 'médico', 'seguro social', 'enfermedad'],
    agriculture: ['agro', 'agricultor', 'campo', 'campesino', 'producción', 'alimento'],
    environment: ['ambiente', 'clima', 'sostenible', 'ecología', 'carbono', 'renovable'],
    reforms: ['reforma', 'constitución', 'ley', 'institucional', 'cambio estructural'],
    social: ['social', 'pobreza', 'desigualdad', 'familia', 'comunidad', 'inclusión'],
  }

  for (const transcript of transcripts) {
    console.log(`\n${transcript.partyCode} - ${transcript.candidateName}:`)
    console.log('─'.repeat(60))

    const contentLower = transcript.content.toLowerCase()

    for (const [dimension, words] of Object.entries(keywords)) {
      const mentions = words.filter(word => contentLower.includes(word)).length
      if (mentions > 0) {
        console.log(`  ${dimension.padEnd(12)}: ${mentions} menciones de palabras clave`)
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ Procesamiento completado')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  console.log('💡 Próximos pasos:')
  console.log('   1. Usar IA (Claude/GPT) para analizar transcripciones completas')
  console.log('   2. Generar resúmenes mejorados por dimensión')
  console.log('   3. Actualizar candidatos-data-oficial.json con nuevos planSummary')
  console.log('   4. Re-seed database con información mejorada\n')
}

processTranscripts().catch(console.error)
