import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getUserCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.productId");
  if (!cart) return { items: [], totalAmount: 0 };

  const totalAmount = cart.items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return { items: cart.items, totalAmount };
};

export const addItem = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, shop: product.shop });
  }

  await cart.save();
  return cart;
};

export const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart;
};

export const checkoutCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.productId");
  if (!cart || cart.items.length === 0)
    throw new Error("Cart is empty");

  const totalAmount = cart.items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: userId,
    items: cart.items,
    totalAmount,
    status: "pending",
  });

  cart.items = [];
  await cart.save();

  return order;
};
