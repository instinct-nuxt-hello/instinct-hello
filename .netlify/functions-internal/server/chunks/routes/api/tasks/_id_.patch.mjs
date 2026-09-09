import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { e as ensureSchema, g as getPool } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';

const _id__patch = defineEventHandler(async (event) => {
  await ensureSchema();
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });
  const body = await readBody(event);
  const fields = [];
  const values = [];
  if ((body == null ? void 0 : body.title) !== void 0) {
    const title = body.title.toString().trim();
    if (!title) throw createError({ statusCode: 400, statusMessage: "Title cannot be empty" });
    if (title.length > 255) throw createError({ statusCode: 400, statusMessage: "Title is too long" });
    fields.push("title = ?");
    values.push(title);
  }
  if ((body == null ? void 0 : body.notes) !== void 0) {
    fields.push("notes = ?");
    values.push(body.notes ? body.notes.toString().trim() : null);
  }
  if ((body == null ? void 0 : body.completed) !== void 0) {
    fields.push("completed = ?");
    values.push(body.completed ? 1 : 0);
  }
  if ((body == null ? void 0 : body.priority) !== void 0) {
    if (!["low", "medium", "high"].includes(body.priority)) {
      throw createError({ statusCode: 400, statusMessage: "Invalid priority" });
    }
    fields.push("priority = ?");
    values.push(body.priority);
  }
  if (!fields.length) throw createError({ statusCode: 400, statusMessage: "Nothing to update" });
  values.push(id);
  const db = getPool();
  const [result] = await db.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);
  if (result.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: "Task not found" });
  const [rows] = await db.query("SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks WHERE id = ?", [id]);
  return rows[0];
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
