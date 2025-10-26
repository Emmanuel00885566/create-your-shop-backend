import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

<<<<<<< HEAD
const OrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    items: {
      type: [OrderItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);
=======
const OrderSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  deliveryStatus: { type: String, enum: ['Pending','In Transit','Delivered'], default: 'Pending' },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed }
})
>>>>>>> 948c3c9 (Finalized updates for Order and Product controllers)

export default mongoose.model("Order", OrderSchema);
