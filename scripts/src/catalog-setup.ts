import { readFile } from "node:fs/promises";
import { pool } from "@workspace/db";

// Explicit, additive migration only. Never introspects, drops, pushes or alters community tables.
const sql = await readFile(new URL("../../lib/db/migrations/0000_neu_catalog.sql", import.meta.url), "utf8");
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(724130)");
  const exists = await client.query("SELECT to_regclass('public.catalog_imports') AS catalog");
  if (!exists.rows[0].catalog) {
    await client.query(sql);
    console.log("Created additive catalog tables.");
  } else {
    const tables = await client.query("SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema='public' AND table_name=ANY($1::text[])", [
      ["catalog_aliases","catalog_brands","catalog_categories","catalog_coverage","catalog_divisions","catalog_evidence","catalog_imports","catalog_listings","catalog_retailers"],
    ]);
    if (tables.rows[0].n !== 9) throw new Error("Partial catalog schema detected; manual migration review required.");
    console.log("Catalog tables already exist; no schema changes.");
  }
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK"); throw e;
} finally { client.release(); await pool.end(); }
