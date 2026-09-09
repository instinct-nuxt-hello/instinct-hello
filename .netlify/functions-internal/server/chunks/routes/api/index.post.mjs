import { d as defineEventHandler, r as readBody, c as createError, s as setResponseStatus } from '../../nitro/nitro.mjs';
import { e as ensureSchema, g as getPool } from '../../_/db.mjs';
import { randomUUID } from 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'mysql2/promise';

const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  await ensureSchema();
  const body = await readBody(event);
  const title = ((_a = body == null ? void 0 : body.title) != null ? _a : "").toString().trim();
  if (!title) {
    throw createError({ statusCode: 400, statusMessage: "Title is required" });
  }
  if (title.length > 255) {
    throw createError({ statusCode: 400, statusMessage: "Title is too long" });
  }
  const notes = ((_b = body == null ? void 0 : body.notes) != null ? _b : "").toString().trim() || null;
  const priority = ["low", "medium", "high"].includes(body == null ? void 0 : body.priority) ? body.priority : "medium";
  const id = randomUUID();
  const db = getPool();
  await db.query("INSERT INTO tasks (id, title, notes, priority) VALUES (?, ?, ?, ?)", [id, title, notes, priority]);
  const [rows] = await db.query("SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks WHERE id = ?", [id]);
  setResponseStatus(event, 201);
  return rows[0];
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
