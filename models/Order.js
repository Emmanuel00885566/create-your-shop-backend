import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true }
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed }
})

export default mongoose.model('Order', OrderSchema)