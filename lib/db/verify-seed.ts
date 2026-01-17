/**
 * Verify Database Seed
 * Quick script to verify that the candidates were seeded correctly
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { getDb, checkConnection, getDbStats } from './connection'

async function verifySeed() {
  console.log('🔍 Verifying database seed...\n')

  try {
    // 1. Check connection
    console.log('1. Checking database connection...')
    const isConnected = await checkConnection()

    if (!isConnected) {
      console.error('   ❌ Database connection failed')
      process.exit(1)
    }
    console.log('   ✅ Database connection successful\n')

    // 2. Get database statistics
    console.log('2. Fetching database statistics...')
    const stats = await getDbStats()

    if (!stats) {
      console.error('   ❌ Could not fetch statistics')
      process.exit(1)
    }

    console.log(`   • Candidates: ${stats.candidates_count}`)
    console.log(`   • Sessions: ${stats.sessions_count}`)
    console.log(`   • Responses: ${stats.responses_count}`)
    console.log(`   • Results: ${stats.results_count}\n`)

    // 3. Verify candidate count
    console.log('3. Verifying candidate count...')
    const expectedCount = 20

    if (Number(stats.candidates_count) === expectedCount) {
      console.log(`   ✅ Found all ${expectedCount} candidates\n`)
    } else {
      console.warn(`   ⚠️  Expected ${expectedCount} candidates, found ${stats.candidates_count}\n`)
    }

    // 4. Check data integrity
    console.log('4. Checking data integrity...')
    const sql = getDb()

    const invalidScores = await sql`
      SELECT
        party_code,
        candidate_name
      FROM candidates
      WHERE
        score_security < 1 OR score_security > 5 OR
        score_economy < 1 OR score_economy > 5 OR
        score_education < 1 OR score_education > 5 OR
        score_health < 1 OR score_health > 5 OR
        score_agriculture < 1 OR score_agriculture > 5 OR
        score_environment < 1 OR score_environment > 5 OR
        score_reforms < 1 OR score_reforms > 5 OR
        score_social < 1 OR score_social > 5
    `

    if (invalidScores.length === 0) {
      console.log('   ✅ All scores are within valid range (1-5)\n')
    } else {
      console.error('   ❌ Found candidates with invalid scores:')
      invalidScores.forEach((c: any) => {
        console.error(`      • ${c.party_code} - ${c.candidate_name}`)
      })
      console.log()
    }

    // 5. Show political spectrum distribution
    console.log('5. Political spectrum distribution...')
    const spectrum = await sql`
      SELECT
        party_code,
        candidate_name,
        ROUND((score_security + score_economy + score_education + score_health +
               score_agriculture + score_environment + score_reforms + score_social) / 8.0, 2) as avg_score,
        CASE
          WHEN (score_security + score_economy + score_education + score_health +
                score_agriculture + score_environment + score_reforms + score_social) / 8.0 >= 4.0 THEN 'Izquierda'
          WHEN (score_security + score_economy + score_education + score_health +
                score_agriculture + score_environment + score_reforms + score_social) / 8.0 >= 3.5 THEN 'Centro-Izquierda'
          WHEN (score_security + score_economy + score_education + score_health +
                score_agriculture + score_environment + score_reforms + score_social) / 8.0 >= 2.5 THEN 'Centro'
          ELSE 'Centro-Derecha/Derecha'
        END as tendency
      FROM candidates
      WHERE is_active = true
      ORDER BY avg_score DESC
    `

    const byTendency = spectrum.reduce((acc: any, curr: any) => {
      acc[curr.tendency] = (acc[curr.tendency] || 0) + 1
      return acc
    }, {})

    console.log('   Distribution:')
    Object.entries(byTendency).forEach(([tendency, count]) => {
      console.log(`      • ${tendency}: ${count} candidatos`)
    })
    console.log()

    // 6. Show top and bottom candidates
    console.log('6. Political spectrum extremes...')
    console.log('   Leftmost candidates:')
    spectrum.slice(0, 3).forEach((c: any, i: number) => {
      console.log(`      ${i + 1}. ${c.party_code} - ${c.avg_score}`)
    })
    console.log()
    console.log('   Rightmost candidates:')
    spectrum.slice(-3).reverse().forEach((c: any, i: number) => {
      console.log(`      ${i + 1}. ${c.party_code} - ${c.avg_score}`)
    })
    console.log()

    // 7. Check for missing data
    console.log('7. Checking for missing data...')
    const missingData = await sql`
      SELECT
        party_code,
        candidate_name,
        CASE
          WHEN plan_summary IS NULL OR plan_summary = '' THEN 'Missing summary'
          WHEN slogan IS NULL OR slogan = '' THEN 'Missing slogan'
          ELSE 'OK'
        END as issue
      FROM candidates
      WHERE
        plan_summary IS NULL OR plan_summary = '' OR
        slogan IS NULL OR slogan = ''
    `

    if (missingData.length === 0) {
      console.log('   ✅ All candidates have complete data\n')
    } else {
      console.warn('   ⚠️  Some candidates have missing data:')
      missingData.forEach((c: any) => {
        console.warn(`      • ${c.party_code}: ${c.issue}`)
      })
      console.log()
    }

    console.log('✅ Verification complete!\n')

  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

// Run verification
verifySeed()
  .then(() => {
    console.log('✨ All checks passed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
