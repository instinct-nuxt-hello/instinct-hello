import { d as defineEventHandler, g as getRouterParam, c as createError, s as setResponseStatus } from '../../../nitro/nitro.mjs';
import { e as ensureSchema, g as getPool } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';

const _id__delete = defineEventHandler(async (event) => {
  await ensureSchema();
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing id" });
  const db = getPool();
  const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);
  if (result.affectedRows === 0) throw createError({ statusCode: 404, statusMessage: "Task not found" });
  setResponseStatus(event, 204);
  return null;
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
