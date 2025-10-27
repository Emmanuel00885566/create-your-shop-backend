import mongoose from "mongoose";
const CartItemSchema =new mongoose.Schema({
  productId:{
    ref: "Product",
    required: true
  },
  quantity:{
    type:Number,
    required: true,
    default: 1,
    min: 1
  },
  // for selecting from multiple shops
  shop:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  }
});
const CartSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    unique:true,
    required:true,
  },
},
  {
    timestamps: true
});
const Cart = mongoose.model("Cart",CartSchema);
export default Cart;