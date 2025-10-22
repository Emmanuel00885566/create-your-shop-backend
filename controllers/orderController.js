import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import { sendMail } from "../utils/mailer.js";

export const validateCreateOrder = [
  body("shop").isMongoId(),
  body("customerName").isString().notEmpty(),
  body("customerEmail").isEmail(),
  body("items").isArray({ min: 1 }),
  body("items.*.product").optional().isMongoId(),
  body("items.*.title").optional().isString().notEmpty(),
  body("items.*.price").isFloat({ gt: 0 }),
  body("items.*.qty").isInt({ min: 1 })
];

export async function createOrder(req, res) {
  try {
    console.log("BODY:", req.body);

    const { shop, customerName, customerEmail, items, meta } = req.body;

    const total = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty), 0);

    const order = await Order.create({
      shop,
      customerName,
      customerEmail,
      items: items.map(it => ({
        product: it.product,
        title: it.title ?? "Item",
        price: Number(it.price),
        qty: Number(it.qty)
      })),
      total,
      status: "pending",
      meta
    });

    const html = `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerName},</p>
      <p>Your order has been received.</p>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Total: ₦${order.total.toFixed(2)}</p>
    `;

    try {
      await sendMail({ to: customerEmail, subject: `Order Confirmation – ${order._id}`, html });
    } catch (e) {
      console.error("MAIL:", e.message);
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listOrders(req, res) {
  try {
    const { shopId, status } = req.query;
    const filter = {};
    if (shopId) filter.shop = shopId;
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!["pending", "processing", "completed", "cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    const html = `
      <h1>Order Update</h1>
      <p>Your order <strong>${order._id}</strong> is now <strong>${order.status}</strong>.</p>
    `;

    try {
      await sendMail({ to: order.customerEmail, subject: `Order Update – ${order._id}`, html });
    } catch (e) {
      console.error("MAIL:", e.message);
    }

    return res.json(order);
  } catch (error) {
  console.error("UPDATE STATUS ERROR:", error);
  return res.status(500).json({ message: "Server error", error: error.message });
}
}