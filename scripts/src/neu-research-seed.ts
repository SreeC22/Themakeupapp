import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pool } from "@workspace/db";
if (process.env.NODE_ENV === "production") throw new Error("Research import is development-only.");
type Observation = {
  productName: string; shade: string; sourceUrl: string; observedOn: string; platform: string; market: string;
  reportedCharacteristics: string[]; positive: string[]; negative: string[]; routines: string[];
  disclosure: string; strength: string; independentGroup: null; status: "research_candidate";
};
const entries = JSON.parse(await readFile(new URL("../../lib/db/src/neu/research-seed.json", import.meta.url), "utf8")) as Observation[];
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(724132)");
  for (const e of entries) {
    if (!e.productName.trim() || !/^https:\/\//.test(e.sourceUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(e.observedOn) || e.status !== "research_candidate" || e.independentGroup !== null) throw new Error("Initial research must be sourced, dated and unpromoted.");
    for (const values of [e.reportedCharacteristics, e.positive, e.negative, e.routines]) if (!Array.isArray(values) || values.some(v => typeof v !== "string")) throw new Error("Invalid research observations.");
    const sourceId = `research-source-${hash([e.sourceUrl, e.observedOn, e.market])}`;
    await client.query("INSERT INTO neu_sources(id,url,market,observed_on,kind) VALUES($1,$2,$3,$4,'research') ON CONFLICT(id) DO NOTHING", [sourceId, e.sourceUrl, e.market, e.observedOn]);
    await client.query(`INSERT INTO neu_research_observations(id,source_id,product_name,shade,platform,reported_characteristics,positive,negative,routines,disclosure,strength,independent_group,status)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT(id) DO NOTHING`,
    [`research-${hash(e)}`, sourceId, e.productName, e.shade, e.platform, e.reportedCharacteristics, e.positive, e.negative, e.routines, e.disclosure, e.strength, null, e.status]);
  }
  await client.query("COMMIT");
  console.info(`Imported ${entries.length} dated source observations as research candidates; no popularity or independent-favorite claim was created.`);
} catch (error) { await client.query("ROLLBACK"); throw error; }
finally { client.release(); await pool.end(); }
