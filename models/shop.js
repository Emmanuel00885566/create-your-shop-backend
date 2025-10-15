import mongoose from 'mongoose';
 export const ShopSchema = new mongoose.Schema({
  owner:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
    unique: true,
  },
  name:{
    type: String,
    required: [true,"shop name is required"],
    trim:true,
  },
  slug:{
    type: String,
    required: true,
    unique: true,
    trim:true,
  },
  logoUrl:{
    type: String,
    default:"/images/logo.png"
  },
  description:{
    type: String,
    default:"You are welcome to our online store!"
  },
  products:{
    type:  mongoose.Schema.Types.ObjectId,
    ref:"Product",
  },
  timestamps: true ,
 });
 const Shop = mongoose.model("Shop", ShopSchema);
 export default Shop;