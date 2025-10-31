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

router.post('/', validateCreateOrder, createOrder)

router.get('/', listOrders)

router.get('/:id', getOrder)

router.patch('/:id', updateStatus)

router.patch('/:id/delivery', updateDeliveryStatus)

export default router
