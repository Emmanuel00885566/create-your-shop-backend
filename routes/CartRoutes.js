import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {
  getCart,
  addItemToCart,
  RemoveItemFromCart,
  Checkout} from "../controllers/CartController.js";
  const router= express.Router();
  // Cart endpoint auth
  router.use(protect);
  //GET/API/CART - view user's cart
  router.get("/",getCart);
  //post /api/cart/add- add to cart
  router.post("/add",addItemToCart);
  //DELETE/api/cart/delete -remove fom cart
  router.delete('/remove/:productId',RemoveItemFromCart);
  //POST /api/cart/checkout -convert cart to order
  router.post('/checkout',Checkout);
  export default router;
