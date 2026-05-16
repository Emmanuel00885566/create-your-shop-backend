import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import {
  validateCreateOrder,
  createOrder,
  getOrder,
  listOrders,
  updateStatus,
  updateDeliveryStatus,
} from '../controllers/orderController.js'

const router = express.Router()

// Public - customers don't need to login to place orders
router.post('/create_order', validateCreateOrder, createOrder)

// Protected - only shop owners can view and manage orders
router.use(protect)
router.get('/list_orders', listOrders)
router.get('/get_order/:id', getOrder)
router.patch('/update_order/:id', updateStatus)
router.patch('/:id/delivery', updateDeliveryStatus)

export default router