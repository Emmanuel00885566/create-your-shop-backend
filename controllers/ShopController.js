import Shop from "/models/Shop.js";
import User from '/models/User.js';
import Product from '/models/Product.js';
import slugify from 'slugify';
exports.createShop =async(req,res) => {
  const userId= req.user._id;
  const {name,description} = req.body;
  if (!name){
    return res.status(400).json({message:"Shop name is required"});
  }
  try {
    const user =await User.findById(userId).select('Shop');
    if (user.shop){}
  }
}
