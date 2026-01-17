# Database Setup Guide

## Prerequisites

1. **Neon PostgreSQL Database**
   - Create a free account at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Replace `DATABASE_URL` with your Neon connection string

```bash
cp .env.example .env.local
```

Example connection string:
```
DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/voto2026?sslmode=require"
```

## Database Schema Setup

### Option 1: Using the SQL file directly

Execute the schema on your Neon database:

```bash
# Using Neon's SQL Editor (recommended)
# 1. Go to your Neon project dashboard
# 2. Click on "SQL Editor"
# 3. Copy and paste the contents of docs/database-schema.sql
# 4. Execute the script
```

### Option 2: Using a PostgreSQL client

```bash
# Install psql if not already available
# Then run:
psql $DATABASE_URL -f docs/database-schema.sql
```

## Seed Database with Candidates

Once your database schema is created, populate it with the 20 presidential candidates:

```bash
# Install dependencies first
npm install

# Run the seed script
npm run db:seed
```

Expected output:
```
🌱 Starting database seed...

🗑️  Clearing existing candidates...
✅ Candidates table cleared

📝 Inserting 20 candidates...

  ✓ PUSC - Juan Carlos Hidalgo
  ✓ CR1 - Douglas Caamaño Quirós
  ✓ PEN - Claudio Alpízar Otoya
  ...
  ✓ FA - Candidato Frente Amplio

📊 Seed Summary:
   • Successful: 20
   • Failed: 0
   • Total: 20

✅ Database now contains 20 candidates

📈 Top 5 candidates by average score:
   1. FA - Candidato Frente Amplio (4.69)
   2. PT - Candidato PT (4.75)
   3. PAC - Candidato PAC (4.19)
   ...

🎉 Seed completed successfully!
```

## Database Utilities

The `connection.ts` file provides helper functions:

```typescript
import { getDb, checkConnection, getDbStats } from '@/lib/db/connection'

// Get database instance
const sql = getDb()

// Check connection health
const isHealthy = await checkConnection()

// Get statistics
const stats = await getDbStats()
// Returns: { candidates_count, sessions_count, responses_count, results_count }
```

## Troubleshooting

### Error: DATABASE_URL is not set

Make sure you have created `.env.local` with your Neon connection string:

```bash
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL
```

### Error: relation "candidates" does not exist

You need to run the database schema first:

1. Go to Neon SQL Editor
2. Execute `docs/database-schema.sql`
3. Then run `npm run db:seed`

### Connection timeout

Check that:
- Your Neon project is active
- The connection string is correct
- `?sslmode=require` is appended to the URL
- Your IP is not blocked (Neon allows all IPs by default)

## Re-seeding

To clear and re-seed the database:

```bash
npm run db:seed
```

The script automatically clears existing candidates before inserting new data.

⚠️ **Warning**: This will delete all existing candidates. Any sessions, responses, or results referencing these candidates will be affected based on your foreign key constraints.

## Production Deployment

When deploying to Vercel:

1. Add `DATABASE_URL` to Environment Variables in Vercel dashboard
2. The seed script is NOT automatically run on deployment
3. You must run it manually once:

```bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:seed
```

Or execute the seed via Neon's SQL Editor if preferred.
