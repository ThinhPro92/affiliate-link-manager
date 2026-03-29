import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createCampaign,
  getMyCampaigns,
  deleteCampaign,
} from "../controllers/campaign.controller.js";

const router = Router();

router.use(protect);

router.get("/", getMyCampaigns);
router.post("/", createCampaign);
router.delete("/:id", deleteCampaign);

export default router;
