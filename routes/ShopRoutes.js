import express from "express";
import {
  createShop,
  updateShop,
  getShopBySlug,
} from "../controllers/ShopController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new shop (protected)
router.post("/", protect, createShop);

// Update existing shop (protected)
router.put("/", protect, updateShop);

// Get shop by slug (public)
router.get("/:slug", getShopBySlug);

export default router;
