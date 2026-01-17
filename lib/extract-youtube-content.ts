/**
 * Script para extraer información de las entrevistas de YouTube del TSE
 *
 * Nota: Para extraer transcripciones completas de YouTube se requiere:
 * 1. API de YouTube (requiere API key de Google)
 * 2. Herramientas como yt-dlp o youtube-transcript-api
 *
 * Este script intenta obtener metadatos básicos de cada video
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

interface CandidateData {
  id: number
  partyCode: string
  candidateName: string
  interviewUrl: string
}

async function extractYouTubeId(url: string): Promise<string | null> {
  const match = url.match(/[?&]v=([^&]+)/)
  return match ? match[1] : null
}

async function main() {
  console.log('🎥 Extrayendo información de entrevistas del TSE\n')

  const dataPath = resolve(process.cwd(), 'lib/candidatos-data-oficial.json')
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'))

  console.log(`Encontrados ${data.candidatos.length} candidatos con entrevistas\n`)

  const interviewInfo: any[] = []

  for (const candidate of data.candidatos) {
    const videoId = await extractYouTubeId(candidate.interviewUrl)

    if (!videoId) {
      console.warn(`⚠️  No se pudo extraer ID del video para ${candidate.candidateName}`)
      continue
    }

    const info = {
      id: candidate.id,
      partyCode: candidate.partyCode,
      candidateName: candidate.candidateName,
      videoId,
      videoUrl: candidate.interviewUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    }

    interviewInfo.push(info)

    console.log(`✓ ${candidate.partyCode} - ${candidate.candidateName}`)
    console.log(`  Video ID: ${videoId}`)
    console.log(`  Thumbnail: ${info.thumbnailUrl}\n`)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 INSTRUCCIONES PARA OBTENER TRANSCRIPCIONES:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  console.log('Opción 1: Usar youtube-transcript-api (Python)')
  console.log('  pip install youtube-transcript-api')
  console.log('  youtube_transcript_api [VIDEO_ID] --languages es\n')

  console.log('Opción 2: Usar yt-dlp')
  console.log('  yt-dlp --write-auto-subs --skip-download [VIDEO_URL]\n')

  console.log('Opción 3: Manualmente desde YouTube')
  console.log('  1. Abrir el video en YouTube')
  console.log('  2. Click en "..." -> "Mostrar transcripción"')
  console.log('  3. Copiar el texto\n')

  console.log('═══════════════════════════════════════════════')
  console.log('Lista de videos para transcribir:\n')

  for (const info of interviewInfo) {
    console.log(`${info.partyCode} - ${info.candidateName}:`)
    console.log(`  ${info.videoUrl}\n`)
  }
}

main().catch(console.error)
