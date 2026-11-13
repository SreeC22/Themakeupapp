import { Router, type IRouter } from "express";
import healthRouter from "./health";
import catalogRouter from "./catalog";
import neuRouter from "./neu";

const router: IRouter = Router();

router.use(healthRouter);
router.use(catalogRouter);
router.use(neuRouter);

export default router;
