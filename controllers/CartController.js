import Cart from '../models/Cart.js';
import Order from "../models/Order.js";
import Product from "../models/Product.js";
//GET /api/cart
export const getCart = async (req,res) =>{
  try {
  if (!Cart){
    return res.status(200).json({items:[], totalAmount:0});
  }
  }
}