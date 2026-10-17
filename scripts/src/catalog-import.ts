import { readFile } from "node:fs/promises";
import { importBatch } from "@workspace/db/catalog";
import { pool } from "@workspace/db";

const file = process.argv[2];
try {
  if (!file) throw new Error("Usage: catalog:import <batch.json> [--dry-run]");
  const result = await importBatch(JSON.parse(await readFile(file, "utf8")), process.argv.includes("--dry-run"));
  console.log(JSON.stringify(result, null, 2));
  if (result.rejected) process.exitCode = 1;
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e)); process.exitCode = 1;
} finally { await pool.end(); }
