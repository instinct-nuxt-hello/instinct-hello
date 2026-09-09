import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const env = {
    host: config.dbHost || null,
    port: config.dbPort || null,
    user: config.dbUser || null,
    passSet: !!config.dbPassword,
    name: config.dbName || null
  }
  try {
    const conn = await mysql.createConnection({
      host: config.dbHost,
      port: Number(config.dbPort || 4000),
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName || 'taskdb',
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    })
    const [rows]: any = await conn.query('SELECT COUNT(*) AS n FROM tasks')
    await conn.end()
    return { env, db: 'ok', taskCount: rows[0].n }
  } catch (e: any) {
    return { env, db: 'error', error: String(e && e.message ? e.message : e) }
  }
})
