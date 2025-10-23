import Shop from "../models/shop.js";
import User from '../models/User.js';
import Product from '../models/productModel.js';
import slugify from 'slugify';

export const createShop =async(req,res) => {
const userId= req.user._id;
const {name,description} = req.body;
if (!name){
return res.status(400).json({message:"Shop name is required"});
}
try {
const user =await User.findById(userId).select('Shop');
// if (user.shop){
//   return res.status(400).json({
//     message:"user already owns a shop. "});

let baseSlug= slugify (name,{lower: true, strict: true});
let slug =baseSlug;
let counter =1;
while (await Shop.findOne({slug})){
slug =`${baseSlug} - ${counter}`;
counter++;
}
const newShop =await Shop.create({
owner:userId,
name,
slug,
description
});
res.status(201).json({
  message:"Shop is created Successfully!",
  shop: newShop
});
} catch (error) {
console.error(error);
res.status(500).json({message:"server error during shop Creation."});
}
};

export const getShopBySlug =async (req, res) =>{
try{
const {slug} =req.params;
const shop =await Shop.findOne({slug});

if (!shop){
return res.status(404).json ({message: "Shop not found."});
}
const products=await Product.find({
shop: shop._id,
isAvailable: true
})
.select("-_v");
res.status(200).json({
shop:{
name:shop.name,
logoUrl:shop.logoUrl,
description:shop.description
}
});
} catch (error){
  console.error(error);
  res.status(500).json({message:"server error retrieving shop data."});
}
};

export const updateShop = async (req, res) => {
const shopId = req.user.shop;
if (!shopId) {
return res.status(400).json({ message: 'You must create a shop before updating it.' });
}

try {
const updateData = { ...req.body };

if (req.body.name) {
updateData.slug = slugify(req.body.name, { lower: true, strict: true });
}

const updatedShop = await Shop.findByIdAndUpdate(shopId, { $set: updateData }, { new: true, runValidators: true });

if (!updatedShop) {
return res.status(404).json({ message: 'Shop not found.' });
}
res.status(200).json({ message: 'Shop updated successfully.', shop: updatedShop });
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Server error during shop update.' });
}
};