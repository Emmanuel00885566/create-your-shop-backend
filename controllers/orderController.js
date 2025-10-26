import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import { sendMail } from "../utils/mailer.js";
import { createOrderSvc, getOrderByIdSvc, listOrdersSvc, updateOrderStatusSvc, updateDeliveryStatusSvc } from "../services/orderService.js";

export const validateCreateOrder = [
  body("shop").isMongoId(),
  body("customerName").isString().notEmpty(),
  body("customerEmail").isEmail(),
  body("deliveryAddress").isString().notEmpty(),
  body("items").isArray({ min: 1 }),
  body("items.*.product").optional().isMongoId(),
  body("items.*.title").optional().isString().notEmpty(),
  body("items.*.price").isFloat({ gt: 0 }),
  body("items.*.qty").isInt({ min: 1 })
];

export async function createOrder(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { shop, customerName, customerEmail, deliveryAddress, items, meta } = req.body;
    const total = items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
    const order = await createOrderSvc({
      shop,
      customerName,
      customerEmail,
      deliveryAddress,
      deliveryStatus: "Pending",
      items: items.map(it => ({ product: it.product, title: it.title ?? "Item", price: Number(it.price), qty: Number(it.qty) })),
      total,
      status: "pending",
      meta
    });
    const html = `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerName},</p>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Total: ₦${order.total.toFixed(2)}</p>
      <p>Delivery Address: ${order.deliveryAddress}</p>
      <p>Delivery Status: ${order.deliveryStatus}</p>
    `;
    try{await sendMail({to:customerEmail,subject:`Order Confirmation – ${order._id}`,html})}catch{}
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getOrder(req, res) {
  try {
    const order = await getOrderByIdSvc(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listOrders(req, res) {
  try {
    const { shopId, status, deliveryStatus } = req.query;
    const filter = {};
    if (shopId) filter.shop = shopId;
    if (status) filter.status = status;
    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;
    const orders = await listOrdersSvc(filter);
    return res.json(orders);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateStatus(req, res) {
  try {
    const id = String(req.params.id).trim();
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid order id" });
    if (!["pending","processing","completed","cancelled"].includes(status)) return res.status(400).json({ message: "Invalid status" });
    const order = await updateOrderStatusSvc(id, status);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const html = `
      <h1>Order Update</h1>
      <p>Your order <strong>${order._id}</strong> is now <strong>${order.status}</strong>.</p>
    `;
    try{await sendMail({to:order.customerEmail,subject:`Order Update – ${order._id}`,html})}catch{}
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateDeliveryStatus(req, res) {
  try {
    const id = String(req.params.id).trim();
    const { deliveryStatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid order id" });
    if (!["Pending","In Transit","Delivered"].includes(deliveryStatus)) return res.status(400).json({ message: "Invalid deliveryStatus" });
    const order = await updateDeliveryStatusSvc(id, deliveryStatus);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const html = `
      <h1>Delivery Update</h1>
      <p>Your order <strong>${order._id}</strong> delivery status is now <strong>${order.deliveryStatus}</strong>.</p>
    `;
    try{await sendMail({to:order.customerEmail,subject:`Delivery Update – ${order._id}`,html})}catch{}
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}