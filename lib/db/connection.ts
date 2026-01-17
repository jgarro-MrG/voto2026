/**
 * Database Connection Utility
 * Provides a singleton connection to Neon PostgreSQL
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless'

let sqlInstance: NeonQueryFunction<false, false> | null = null

/**
 * Get database connection instance
 * Creates a singleton connection to avoid multiple instantiations
 */
export function getDb(): NeonQueryFunction<false, false> {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Please configure your Neon database connection string.'
      )
    }

    sqlInstance = neon(databaseUrl)
  }

  return sqlInstance
}

/**
 * Execute a raw SQL query
 * Useful for complex queries or migrations
 */
export async function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
  const sql = getDb()

  try {
    // @ts-ignore - Neon supports both template literals and string queries
    const result = params ? await sql(query, params) : await sql(query)
    return result as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Check database connection health
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const sql = getDb()
    await sql`SELECT 1 as health_check`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Get database statistics
 */
export async function getDbStats() {
  const sql = getDb()

  try {
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM candidates) as candidates_count,
        (SELECT COUNT(*) FROM sessions) as sessions_count,
        (SELECT COUNT(*) FROM responses) as responses_count,
        (SELECT COUNT(*) FROM results) as results_count
    `

    return stats[0] || {}
  } catch (error) {
    console.error('Error fetching database stats:', error)
    return null
  }
}
