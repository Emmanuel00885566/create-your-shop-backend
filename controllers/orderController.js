import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import { sendMail } from "../utils/mailer.js";

export const validateCreateOrder = [
  body("shop").isMongoId().withMessage("Shop ID must be a valid Mongo ID"),
  body("customerName").isString().notEmpty().withMessage("Customer name is required"),
  body("customerEmail").isEmail().withMessage("Valid customer email is required"),
  body("items").isArray({ min: 1 }).withMessage("Items must be a non-empty array"),
  body("items.*.product").optional().isMongoId().withMessage("Invalid product ID"),
  body("items.*.title").optional().isString().notEmpty().withMessage("Item title must be a string"),
  body("items.*.price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("items.*.qty").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

export async function createOrder(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shop, customerName, customerEmail, items, meta } = req.body;

    const total = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.qty),
      0
    );

    const order = await Order.create({
      shop,
      customerName,
      customerEmail,
      items: items.map((it) => ({
        product: it.product,
        title: it.title ?? "Item",
        price: Number(it.price),
        qty: Number(it.qty),
      })),
      total,
      status: "pending",
      meta,
    });

    const html = `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerName},</p>
      <p>Your order has been received successfully.</p>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Total: ₦${order.total.toFixed(2)}</p>
      <p>We’ll notify you once it’s processed. Thank you!</p>
    `;

    try {
      await sendMail({
        to: customerEmail,
        subject: `Order Confirmation – ${order._id}`,
        html,
      });
    } catch (e) {
      console.error("MAIL ERROR:", e.message);
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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
    const allowed = ["pending", "processing", "completed", "cancelled"];
    if (!allowed.includes(status))
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
      await sendMail({
        to: order.customerEmail,
        subject: `Order Update – ${order._id}`,
        html,
      });
    } catch (e) {
      console.error("MAIL ERROR:", e.message);
    }

    return res.json(order);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
