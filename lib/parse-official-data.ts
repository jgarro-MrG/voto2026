/**
 * Script para parsear los datos oficiales del CSV del TSE
 * y generar el JSON actualizado con información correcta
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface CSVRow {
  NombrePartido: string
  AbreviaturaPartido: string
  Candidato: string
  UrlFoto: string
  UrlPlan: string
  UrlEntrevistaTSE: string
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''))

  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/\r/g, ''))

    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    rows.push(row as CSVRow)
  }

  return rows
}

// Mapeo de abreviaturas a IDs del sistema actual
const partyCodeToId: Record<string, number> = {
  'PUSC': 1,
  'CR1': 2,
  'PEN': 3,
  'PIN': 4,
  'PLP': 5,
  'PUCD': 6,
  'PCDS': 7,
  'PNG': 8,
  'PDLCT': 9,
  'UP': 10,
  'PPSD': 11,
  'ACRM': 12,
  'PA': 13,
  'PEL': 14,
  'PLN': 15,
  'PNR': 16,
  'PJSC': 17,
  'PPSO': 18,
  'PCAC': 19,
  'FA': 20,
}

async function main() {
  console.log('📖 Leyendo CSV oficial del TSE...\n')

  const csvPath = resolve(process.cwd(), 'docs/data.csv')
  const csvContent = readFileSync(csvPath, 'utf-8')

  const rows = parseCSV(csvContent)

  console.log(`✅ Encontrados ${rows.length} candidatos\n`)

  // Cargar datos actuales
  const currentDataPath = resolve(process.cwd(), 'lib/candidatos-data-completo.json')
  const currentData = JSON.parse(readFileSync(currentDataPath, 'utf-8'))

  // Crear mapeo de datos actualizados
  const updates: any[] = []

  for (const row of rows) {
    const id = partyCodeToId[row.AbreviaturaPartido]

    if (!id) {
      console.warn(`⚠️  No se encontró ID para ${row.AbreviaturaPartido}`)
      continue
    }

    const currentCandidate = currentData.candidatos.find((c: any) => c.id === id)

    if (!currentCandidate) {
      console.warn(`⚠️  No se encontró candidato con ID ${id}`)
      continue
    }

    const update = {
      id,
      partyCode: row.AbreviaturaPartido,
      partyName: row.NombrePartido,
      candidateName: row.Candidato,
      photoUrl: row.UrlFoto,
      planUrl: row.UrlPlan,
      interviewUrl: row.UrlEntrevistaTSE,
      websiteUrl: `https://www.tse.go.cr/2026/planesgobierno.html`, // TSE oficial
      // Mantener datos existentes
      slogan: currentCandidate.slogan,
      colorPrimary: currentCandidate.colorPrimary,
      colorSecondary: currentCandidate.colorSecondary,
      scores: currentCandidate.scores,
      planSummary: currentCandidate.planSummary,
      isActive: currentCandidate.isActive,
    }

    updates.push(update)

    console.log(`✓ ${row.AbreviaturaPartido}: ${row.Candidato}`)
  }

  // Guardar datos actualizados
  const outputPath = resolve(process.cwd(), 'lib/candidatos-data-oficial.json')
  writeFileSync(
    outputPath,
    JSON.stringify({ candidatos: updates }, null, 2),
    'utf-8'
  )

  console.log(`\n✅ Datos actualizados guardados en: ${outputPath}`)
}

main().catch(console.error)
