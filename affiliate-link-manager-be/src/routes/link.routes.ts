import { Router } from "express";
import {
  checkLinkHealth,
  createLink,
  deleteLinkPermanently,
  getMyLinks,
  getTrashLinks,
  restoreLink,
  softDeleteLink,
  updateLink,
} from "../controllers/link.controller.js";
import {
  getDashboardSummary,
  getStats,
} from "../controllers/analytics.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/links", protect, getMyLinks);
router.get("/links/trash", protect, getTrashLinks);
router.post("/links", protect, createLink);

router.get("/stats/summary", protect, getDashboardSummary);
router.get("/links/check-health", protect, checkLinkHealth);

router.get("/stats/link/:id", protect, getStats);
router.patch("/links/:id", protect, updateLink);
router.patch("/links/:id/restore", protect, restoreLink);
router.delete("/links/:id", protect, softDeleteLink);
router.delete("/links/:id/permanent", protect, deleteLinkPermanently);
export default router;
