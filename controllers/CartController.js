import {
  getUserCart,
  addItem,
  removeItem,
  checkoutCart,
} from "../services/cartService.js";

export const getCart = async (req, res) => {
  try {
    const data = await getUserCart(req.user._id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await addItem(req.user._id, productId, quantity);
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const RemoveItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await removeItem(req.user._id, productId);
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Checkout = async (req, res) => {
  try {
    const order = await checkoutCart(req.user._id);
    res.status(201).json({
      message: "Checkout successful! Order created.",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
