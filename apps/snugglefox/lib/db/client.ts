import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { requireEnv } from '@/lib/config'
import * as schema from './schema'

type Db = ReturnType<typeof createDb>

function createDb() {
  const url = requireEnv('DATABASE_URL')
  return drizzle(neon(url), { schema })
}

let instance: Db | null = null

// Lazy proxy: the connection is only created on first query, not at import
// time — `next build` imports the API routes to collect page data and must
// not require DATABASE_URL to be set.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    instance ??= createDb()
    return Reflect.get(instance, prop)
  },
})

export { schema }
