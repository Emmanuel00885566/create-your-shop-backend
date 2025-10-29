import express from "express";
import {
  createShop,
  updateShop,
  getShopBySlug,
  getAllShops,
} from "../controllers/ShopController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { upload } from "../config/multer.js";

const router = express.Router();

// Create new shop (protected)
router.post("/create_shop", protect, 
  (req, res, next) => {
      upload.single("logo")(req, res, function (err) {
        if (err) {
          console.error("Multer error:", err);
          if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large" });
          }
          return res.status(400).json({ error: err.message });
        } console.log(req);
        next();
      });
    },
  createShop);

// Update existing shop (protected)
router.put("/update_shop", protect, updateShop);

// Get all shops (public or protected based on your logic)
router.get("/", getAllShops);

// Get shop by slug (public)
router.get("/:slug", getShopBySlug);

export default router;