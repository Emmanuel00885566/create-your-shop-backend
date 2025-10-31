import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  getCart,
  addItemToCart,
  RemoveItemFromCart,
  Checkout,
} from "../controllers/CartController.js";

const router = express.Router();

router.use(protect);

/**
 * @route   GET /api/cart
 * @desc    View user's cart
 * @access  Private (user only)
 */
router.get("/", authorize("user"), getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to user's cart
 * @access  Private (user only)
 */
router.post("/add", authorize("user"), addItemToCart);

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove item from cart
 * @access  Private (user only)
 */
router.delete("/remove/:productId", authorize("user"), RemoveItemFromCart);

/**
 * @route   POST /api/cart/checkout
 * @desc    Convert cart to order (checkout)
 * @access  Private (user only)
 */
router.post("/checkout", authorize("user"), Checkout);

export default router;
