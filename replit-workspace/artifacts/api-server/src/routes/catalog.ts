import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";
import {
  querySchema, assertRetailer, listBrands, counts, coverage, brandDetail, exportCsv,
  taxonomy, categories, type CatalogQuery,
} from "@workspace/db/catalog";
import {
  ListCatalogBrandsResponse, GetCatalogCountsResponse, GetCatalogCoverageResponse,
  GetCatalogBrandResponse, GetCatalogTaxonomyResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
// No public catalog write routes. Only local, trusted import commands can write.
const filtered = (handler: (q: CatalogQuery, res: Response) => Promise<void>) =>
  async (req: Request, res: Response) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) { res.status(400).json({ error: "Invalid catalog query", details: parsed.error.issues }); return; }
    try { await assertRetailer(parsed.data); }
    catch (e) {
      if (e instanceof Error && ["Unknown retailer","Category does not belong to division"].includes(e.message)) {
        res.status(400).json({ error: e.message }); return;
      }
      req.log.error({ err: e }, "Catalog lookup failed");
      res.status(503).json({ error: "Catalog temporarily unavailable" }); return;
    }
    try { await handler(parsed.data, res); }
    catch (e) {
      req.log.error({ err: e }, "Catalog query failed");
      res.status(503).json({ error: "Catalog temporarily unavailable" });
    }
  };

router.get("/catalog/brands", filtered(async (q,res) => { res.json(ListCatalogBrandsResponse.parse(await listBrands(q))); }));
router.get("/catalog/counts", filtered(async (q,res) => { res.json(GetCatalogCountsResponse.parse(await counts(q))); }));
router.get("/catalog/export.csv", filtered(async (q,res) => {
  const csv = await exportCsv(q);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="neu-brand-coverage.csv"');
  res.send(csv);
}));
router.get("/catalog/coverage", async (req,res) => {
  try { res.json(GetCatalogCoverageResponse.parse(await coverage())); }
  catch (e) {
    req.log.error({ err: e }, "Catalog coverage failed");
    res.status(503).json({ error: "Catalog temporarily unavailable" });
  }
});
router.get("/catalog/taxonomy", async (req,res) => {
  try {
    const retailers = (await pool.query("SELECT * FROM catalog_retailers ORDER BY id")).rows;
    res.json(GetCatalogTaxonomyResponse.parse({ divisions: taxonomy.map(({id,name})=>({id,name})), categories, retailers }));
  } catch (e) {
    req.log.error({ err: e }, "Catalog taxonomy failed");
    res.status(503).json({ error: "Catalog temporarily unavailable" });
  }
});
router.get("/catalog/brands/:brandId", async (req,res) => {
  const id = req.params.brandId;
  if (typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id.length > 120) {
    res.status(400).json({ error: "Invalid canonical brand ID" }); return;
  }
  try {
    const brand = await brandDetail(id);
    if (!brand) { res.status(404).json({ error: "Brand not found" }); return; }
    res.json(GetCatalogBrandResponse.parse(brand));
  } catch (e) {
    req.log.error({ err: e }, "Catalog brand lookup failed");
    res.status(503).json({ error: "Catalog temporarily unavailable" });
  }
});
export default router;
