export default defineEventHandler(async (event) => {
  await ensureSchema()
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  const db = getPool()
  const [result]: any = await db.query('DELETE FROM tasks WHERE id = ?', [id])
  if (result.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  setResponseStatus(event, 204)
  return null
})
