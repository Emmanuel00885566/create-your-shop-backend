<<<<<<< HEAD
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
=======
import express from 'express'
import { validateCreateOrder, createOrder, getOrder, listOrders, updateStatus, updateDeliveryStatus } from '../controllers/orderController.js'

const router = express.Router()

router.post('/', validateCreateOrder, createOrder)
router.get('/', listOrders)
router.get('/:id', getOrder)
router.patch('/:id', updateStatus)
router.patch('/:id/delivery', updateDeliveryStatus)

export default router
>>>>>>> 948c3c9 (Finalized updates for Order and Product controllers)
