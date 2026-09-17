import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must be set before running migrations.");

const database = new Pool({ connectionString });
try {
  await database.query(`
    CREATE TABLE IF NOT EXISTS interpretations (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      card_id INTEGER NOT NULL,
      answer TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await database.query("CREATE INDEX IF NOT EXISTS idx_interpretations_created_at ON interpretations (created_at DESC)");
} finally {
  await database.end();
}
