import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  await ensureSchema()
  const body = await readBody(event)
  const title = (body?.title ?? '').toString().trim()
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }
  if (title.length > 255) {
    throw createError({ statusCode: 400, statusMessage: 'Title is too long' })
  }
  const notes = (body?.notes ?? '').toString().trim() || null
  const priority = ['low', 'medium', 'high'].includes(body?.priority) ? body.priority : 'medium'
  const id = randomUUID()
  const db = getPool()
  await db.query('INSERT INTO tasks (id, title, notes, priority) VALUES (?, ?, ?, ?)', [id, title, notes, priority])
  const [rows] = await db.query('SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks WHERE id = ?', [id])
  setResponseStatus(event, 201)
  return (rows as any[])[0]
})
