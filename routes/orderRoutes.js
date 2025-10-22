import express from "express";
import {
  validateCreateOrder,
  createOrder,
  getOrder,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/", protect, validateCreateOrder, createOrder);
router.get("/", protect, listOrders);
router.get("/:id", protect, getOrder);
// 🟢 Update order status — must be logged in (could later be for admin or shop owner)
router.patch("/:id", protect, updateStatus);

export default router;
