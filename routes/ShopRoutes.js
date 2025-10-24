import express from "express";
import {
  createShop,
  updateShop,
  getShopBySlug,
  getAllShops,
} from "../controllers/ShopController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new shop (protected)
router.post("/", protect, createShop);

// Update existing shop (protected)
router.put("/", protect, updateShop);

// Get all shops (public or protected based on your logic)
router.get("/", getAllShops);

// Get shop by slug (public)
router.get("/:slug", getShopBySlug);

export default router;
