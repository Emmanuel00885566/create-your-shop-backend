import express from "express";
import multer from "multer";
import {
  createShop,
  updateShop,
  getShopBySlug,
  getAllShops,
} from "../controllers/ShopController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

/**
 * @route   POST /api/shops/create_shop
 * @desc    Create a new shop (vendor/admin only)
 * @access  Private
 */
router.post(
  "/create_shop",
  protect,
  authorize("vendor", "admin"),
  (req, res, next) => {
    upload.single("logo")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err);
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large" });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  createShop
);

/**
 * @route   PUT /api/shops/update_shop
 * @desc    Update existing shop (vendor/admin only)
 * @access  Private
 */
router.put("/update_shop", protect, authorize("vendor", "admin"), updateShop);

/**
 * @route   GET /api/shops
 * @desc    Get all shops (public)
 * @access  Public
 */
router.get("/", getAllShops);

/**
 * @route   GET /api/shops/:slug
 * @desc    Get a specific shop by slug (public)
 * @access  Public
 */
router.get("/:slug", getShopBySlug);

export default router;
