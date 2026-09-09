export default defineEventHandler(async () => {
  await ensureSchema()
  const db = getPool()
  const [rows] = await db.query(
    'SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks ORDER BY completed ASC, created_at DESC'
  )
  return rows
})
