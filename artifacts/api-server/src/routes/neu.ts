import { Router, type IRouter } from "express";
import { loadNeuCatalog, loadNeuResearch, recommend } from "@workspace/db/neu";
import { GetNeuCatalogResponse, GetNeuResearchResponse, RecommendNeuShadesBody, RecommendNeuShadesResponse } from "@workspace/api-zod";

const router: IRouter = Router();
router.get("/neu/research", async (req, res): Promise<void> => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json(GetNeuResearchResponse.parse(await loadNeuResearch()));
  } catch (error) {
    req.log.error({ err: error }, "Neu research unavailable");
    res.status(503).json({ error: "Curated research is unavailable. No review or endorsement is inferred." });
  }
});
router.get("/neu/catalog", async (req, res): Promise<void> => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json(GetNeuCatalogResponse.parse(await loadNeuCatalog()));
  } catch (error) {
    req.log.error({ err: error }, "Neu catalog unavailable");
    res.status(503).json({ error: "The verified catalog is unavailable. Please retry; local profile data remains in your browser." });
  }
});
router.post("/neu/recommendations", async (req, res): Promise<void> => {
  const parsed = RecommendNeuShadesBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid complexion or category preferences." }); return; }
  try {
    res.setHeader("Cache-Control", "no-store");
    // No member data, persistence, user identity or request-body logging.
    res.json(RecommendNeuShadesResponse.parse(recommend(await loadNeuCatalog(), parsed.data)));
  } catch (error) {
    req.log.error({ err: error }, "Neu recommendations unavailable");
    res.status(503).json({ error: "Recommendations are unavailable. Your local answers have not been changed." });
  }
});
export default router;
