export default defineEventHandler(async (event) => {
  await ensureSchema()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  const body = await readBody(event)
  const fields: string[] = []
  const values: any[] = []
  if (body?.title !== undefined) {
    const title = body.title.toString().trim()
    if (!title) throw createError({ statusCode: 400, statusMessage: 'Title cannot be empty' })
    if (title.length > 255) throw createError({ statusCode: 400, statusMessage: 'Title is too long' })
    fields.push('title = ?'); values.push(title)
  }
  if (body?.notes !== undefined) {
    fields.push('notes = ?'); values.push(body.notes ? body.notes.toString().trim() : null)
  }
  if (body?.completed !== undefined) {
    fields.push('completed = ?'); values.push(body.completed ? 1 : 0)
  }
  if (body?.priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(body.priority)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid priority' })
    }
    fields.push('priority = ?'); values.push(body.priority)
  }
  if (!fields.length) throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })
  values.push(id)
  const db = getPool()
  const [result]: any = await db.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, values)
  if (result.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  const [rows] = await db.query('SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks WHERE id = ?', [id])
  return (rows as any[])[0]
})
