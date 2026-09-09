import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { e as ensureSchema, g as getPool } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'mysql2/promise';

const index_get = defineEventHandler(async () => {
  await ensureSchema();
  const db = getPool();
  const [rows] = await db.query(
    "SELECT id, title, notes, completed, priority, created_at, updated_at FROM tasks ORDER BY completed ASC, created_at DESC"
  );
  return rows;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
