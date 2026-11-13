import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test, after } from "node:test";
import { randomUUID } from "node:crypto";
import { pool } from "@workspace/db";
import {
  importBatch, querySchema, assertRetailer, listBrands, counts, brandDetail, exportCsv,
  csvCell, validateBatch, categories, taxonomy, type ResearchBatch,
} from "@workspace/db/catalog";

after(async () => { await pool.end(); });

test("Taxonomy and input validation match Neu without inferring categories", () => {
  assert.equal(taxonomy.length, 5);
  assert.equal(categories.length, 22);
  assert.equal(new Set(categories.map(c => c.id)).size, 22);
  for (const q of [{limit:0},{page:1.2},{limit:101},{division:"fake"},{category:"hair"},{retailer:["ulta","target"]},{q:"x".repeat(101)},{random:"field"}]) {
    assert.equal(querySchema.safeParse(q).success, false, JSON.stringify(q));
  }
  assert.equal(csvCell("=HYPERLINK(\"evil\")"), "\"'=HYPERLINK(\"\"evil\"\")\"");
  assert.equal(csvCell("  +12"), "\"'  +12\"");
  assert.equal(csvCell("name,\n\"quoted\""), "\"name,\n\"\"quoted\"\"\"");
});

test("Initial research is actual source-linked data; import reruns preserve records", async () => {
  const input = JSON.parse(await readFile(new URL("../../research/neu-catalog/initial.json", import.meta.url), "utf8"));
  const { batch } = validateBatch(input);
  assert.deepEqual(new Set(batch.coverage.map(c=>c.retailerId)), new Set(["sephora","ulta","target"]));
  assert(batch.coverage.every(c=>c.gaps.length>0 && c.status === "partial"));
  assert.equal(new Set(batch.evidence.map(e=>e.categoryId)).size, 22);
  assert(batch.evidence.every(e => e.status==="verified" && e.sourceUrl.startsWith("https://www.") && e.productName && e.productUrl));
  const first = await importBatch(input);
  assert.equal(first.rejected,0,JSON.stringify(first));
  const before = await pool.query("SELECT count(*)::int AS n FROM catalog_evidence");
  const repeat = await importBatch(input);
  assert.equal(repeat.accepted,0);
  assert.equal(repeat.rejected,0);
  assert(repeat.duplicates>0);
  assert.deepEqual((await pool.query("SELECT count(*)::int AS n FROM catalog_evidence")).rows,before.rows);
  const detail = await brandDetail("elf-cosmetics");
  assert(detail);
  assert(detail.listings.some(l=>l.retailer_id==="target"));
  assert(detail.evidenceHistory.every(e=>e.source_url && e.checked_on && e.batch_id));
});

test("Distinct counts, aliases, scoped evidence, unknowns, pagination, history and atomic imports", async () => {
  const token = "test-" + randomUUID();
  const prefix = "Catalog Fixture " + token;
  const a = token+"-a", b = token+"-b", c = token+"-c";
  const ra = token+"-retailer-a", rb = token+"-retailer-b";
  const day = "2026-10-01", next = "2026-10-02";
  const base = {
    sourceUrl: "https://example.com/public-product", checkedOn: day,
    productName: "Fixture product (tests only)", productUrl: "https://example.com/public-product", note: "Synthetic fixture, removed after test",
  };
  const fixture: ResearchBatch = {
    version: 1, id: token,
    retailers: [{id:ra,name:"Test Retailer A",country:"US"},{id:rb,name:"Test Retailer B",country:"US"}],
    coverage: [ra,rb].map(retailerId=>({retailerId,sourceUrl:"https://example.com/directory",checkedOn:day,status:"partial",inclusionRules:"Test fixtures only",gaps:["Synthetic"]})),
    brands: [{id:a,name:prefix+" Shared",aliases:[prefix+" Alias"]},{id:b,name:prefix+" Pending",aliases:[]},{id:c,name:prefix+" Unavailable",aliases:[]}],
    listings: [{brandId:a,retailerId:ra},{brandId:a,retailerId:rb},{brandId:b,retailerId:ra},{brandId:c,retailerId:ra}].map(l=>({...l,sourceUrl:"https://example.com/directory",checkedOn:day})),
    evidence: [
      {...base,brandId:a,retailerId:ra,categoryId:"foundation",status:"verified"},
      {...base,brandId:a,retailerId:rb,categoryId:"blush",status:"verified"},
      {...base,brandId:b,retailerId:ra,categoryId:"foundation",status:"unknown"},
      {...base,brandId:c,retailerId:ra,categoryId:"foundation",status:"unavailable"},
    ],
  };
  try {
    const dry = await importBatch(fixture,true);
    assert.equal(dry.rejected,0,JSON.stringify(dry));
    assert(dry.accepted>0);
    assert.equal(await brandDetail(a),null,"dry-run must roll back all records");
    const result = await importBatch(fixture);
    assert.equal(result.rejected,0,JSON.stringify(result));
    const all = querySchema.parse({q:prefix,scope:"discovered",limit:1});
    const one = await listBrands(all), two = await listBrands({...all,page:2});
    assert.equal(one.total,3); assert.equal(one.data.length,1);
    assert.notEqual(one.data[0].id,two.data[0].id);
    assert.equal((await listBrands({...all,page:50})).data.length,0);
    assert.equal((await listBrands(querySchema.parse({q:prefix+" Alias"}))).total,1);
    const summary = await counts(all);
    assert.equal(summary.listedBrands,3);
    assert.equal(summary.discoveredDirectoryBrands,3);
    assert.equal(summary.verifiedRelevantBrands,1);
    assert.equal(summary.byRetailer.find(r=>r.id===ra)?.verified_brands,1);
    assert.equal(summary.byRetailer.find(r=>r.id===rb)?.verified_brands,1);
    assert.equal(summary.byDivision.find(r=>r.id==="complexion")?.verified_brands,1);
    assert.equal(summary.byDivision.find(r=>r.id==="cheeks")?.verified_brands,1);
    assert.equal(summary.byCategory.find(r=>r.id==="eyeshadow")?.verified_brands,0);
    assert.equal(summary.coverage.divisionTotalsAdditive,false);
    assert.equal((await listBrands({...all,category:"foundation",retailer:rb})).total,0,"do not infer category at another retailer");
    const detail = await brandDetail(a);
    assert(detail);
    assert.equal(detail.offerings.length,44);
    assert(detail.offerings.some(e=>e.status==="unknown" && e.source_url===null));
    assert((await brandDetail(b))?.offerings.some(e=>e.status==="unknown" && e.source_url!==null));
    assert((await brandDetail(c))?.offerings.some(e=>e.status==="unavailable"));
    const csv = await exportCsv({...all,retailer:ra,category:"foundation"});
    assert(csv.startsWith("\uFEFF"));
    assert(csv.includes('"summary"'));
    assert(csv.includes("sourceUniverse") && csv.includes("asOfDates") && csv.includes("gaps"));
    assert(csv.includes('"verified"') && csv.includes('"foundation"'));
    const empty = await listBrands(querySchema.parse({q:"no match "+token}));
    assert.equal(empty.total,0);
    const emptyCounts = await counts(querySchema.parse({q:"no match "+token}));
    assert.equal(emptyCounts.listedBrands,0);
    assert.equal(emptyCounts.verifiedRelevantBrands,0);
    await assert.rejects(assertRetailer(querySchema.parse({retailer:"nonexistent-"+token})));
    await assert.rejects(assertRetailer(querySchema.parse({division:"lips",category:"foundation"})));
    const invalid = structuredClone(fixture);
    invalid.id=token+"-invalid";
    invalid.evidence[0].brandId=token+"-missing";
    assert.equal((await importBatch(invalid)).unresolved,1);
    const badEvidence = structuredClone(fixture);
    delete badEvidence.evidence[0].productUrl;
    assert((await importBatch(badEvidence)).rejected>0);
    const collision = structuredClone(fixture);
    collision.id=token+"-collision";
    collision.brands[0].aliases.push(fixture.brands[1].name);
    assert((await importBatch(collision)).rejected>0);
    const existingAlias = structuredClone(fixture);
    existingAlias.id=token+"-existing-alias";
    existingAlias.brands=[{id:token+"-new-brand",name:prefix+" New",aliases:[prefix+" Alias"]}];
    existingAlias.listings=[];
    existingAlias.evidence=[];
    assert((await importBatch(existingAlias)).rejected>0,"cross-batch aliases cannot silently create a second canonical brand");
    const conflict = structuredClone(fixture);
    conflict.id=token+"-conflict";
    conflict.evidence[0].status="unavailable";
    assert((await importBatch(conflict)).rejected>0,"same-date evidence conflicts require explicit review");
    const changed = structuredClone(fixture);
    changed.brands[0].aliases.push("Changed content");
    assert((await importBatch(changed)).rejected>0,"batch identity is immutable");
    const update = structuredClone(fixture);
    update.id=token+"-new-check";
    update.evidence=[{...base,brandId:a,retailerId:ra,categoryId:"foundation",status:"unavailable",checkedOn:next}];
    update.coverage.forEach(c=>c.checkedOn=next);
    assert.equal((await importBatch(update)).rejected,0);
    assert.equal((await listBrands({...all,retailer:ra,category:"foundation"})).total,0,"unavailable supersedes old verified");
    assert.equal((await brandDetail(a))?.evidenceHistory.filter(e=>e.category_id==="foundation").length,2);
    assert.equal((await listBrands({...all,retailer:rb,category:"blush"})).total,1,"partial updates do not delete omissions");
  } finally {
    // Only generated fixture IDs are removed. Never reset/truncate a shared database.
    await pool.query("DELETE FROM catalog_evidence WHERE brand_id=ANY($1::text[])", [[a,b,c]]);
    await pool.query("DELETE FROM catalog_aliases WHERE brand_id=ANY($1::text[])", [[a,b,c]]);
    await pool.query("DELETE FROM catalog_listings WHERE brand_id=ANY($1::text[])", [[a,b,c]]);
    await pool.query("DELETE FROM catalog_brands WHERE id=ANY($1::text[])", [[a,b,c]]);
    await pool.query("DELETE FROM catalog_coverage WHERE retailer_id=ANY($1::text[])", [[ra,rb]]);
    await pool.query("DELETE FROM catalog_retailers WHERE id=ANY($1::text[])", [[ra,rb]]);
    await pool.query("DELETE FROM catalog_imports WHERE id LIKE $1", [token+"%"]);
  }
});
