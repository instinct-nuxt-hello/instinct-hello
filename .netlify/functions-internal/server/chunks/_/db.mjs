import { u as useRuntimeConfig } from '../nitro/nitro.mjs';
import mysql from 'mysql2/promise';

let pool = null;
let ensured = false;
function getPool() {
  if (pool) return pool;
  const config = useRuntimeConfig();
  pool = mysql.createPool({
    host: config.dbHost,
    port: Number(config.dbPort || 4e3),
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName || "taskdb",
    waitForConnections: true,
    connectionLimit: 3,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true }
  });
  return pool;
}
async function ensureSchema() {
  if (ensured) return;
  const db = getPool();
  await db.query(`CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  ensured = true;
}

export { ensureSchema as e, getPool as g };
//# sourceMappingURL=db.mjs.map
