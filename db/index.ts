import { Pool } from "pg";

let database: Pool | undefined;
export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("The shared gallery database is not configured.");
  database ??= new Pool({ connectionString });
  return database;
}
