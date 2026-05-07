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

router.use(protect)

router.post('/create_order', validateCreateOrder, createOrder)

router.get('/list_orders', listOrders)

router.get('/get_order/:id', getOrder)

router.patch('/update_order/:id', updateStatus)

router.patch('/:id/delivery', updateDeliveryStatus)

export default router
