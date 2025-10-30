import Cart from '../models/Cart.js';
import Order from "../models/Order.js";
import Product from "../models/productModel.js";
//GET /api/cart
export const getCart = async (req,res) =>{
  try {
  if (!Cart){
    return res.status(200).json({items:[], totalAmount:0});
  }
   //to calculate total 
  let totalAmount =0;
  const cartItems =Cart.items.map(items =>{
    if(items.productId){
      const price =items.productId.price;
      const subtotal= price*items.quantity;
      totalAmount += subtotal;
      return{
        productId:items.product._id,
        name: items.productId.name,
        price:price,
        quantity:items.quantity,
        imageUrl:items.productId.imageUrl,
        subtotal:subtotal,
        shopId: items.productId.shop
      };
    }return null;
    });

  } catch (error){
    console.error('Error fectching Cart:', error);
    res.status(500).json({message:"server error retrieving cart"});
  }

  };
  //post/api/cart/add
  export const addItemToCart = async(req,res) =>{
    const {productId,shopId,quantity =1} = req.body;
    const userId =req.user._id;
  };
  try{
    let cart =await Cart.findOne ({user: userId,items:[]});
    if (!cart){
      cart=await Cart.create({user:userId,items:[]});
    }
 
  const itemIndex =Cart.items.findIndex(item => item.productId.eauals(productId));
  if (itemIndex > -1){
   cart.items[itemIndex].quantity += quantity;
        } else {
            // Item is new: add to cart
            const product = await Product.findById(productId).select('shop');
            if (!product || !product.shop.equals(shopId)) {
                 return res.status(404).json({ message: 'Product not found in specified shop.' });
            }

            cart.items.push({ product:productId, quantity, shop: shopId });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart successfully.', cart });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error adding item to cart.' });
    }

// DELETE /api/cart/remove/:productId
export const removeItemFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => !item.productId.equals(productId));
        
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart.', cart });

    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error removing item from cart.' });
    }
};

// POST /api/cart/checkout
export const checkout = async (req, res) => {
    const userId = req.user._id;
    const { customerName, customerEmail, deliveryAddress } = req.body;

    // Basic validation
    if (!customerName || !customerEmail) {
        return res.status(400).json({ message: 'Customer name and email are required for checkout.' });
    }
    
    try {
        const cart = await Cart.findOne({ user: userId })
            .populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot checkout an empty cart.' });
        }

        // 1. Process cart items and calculate total
        let totalAmount = 0;
        const shopOrders = {}; // Group items by shop ID

        cart.items.forEach(item => {
            const product = item.productId;
            if (!product || product.isAvailable === false) return; // Skip invalid/unavailable products

            const shopId = product.shop.toString();
            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            const orderItem = {
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price 
            };
            
            if (!shopOrders[shopId]) {
                shopOrders[shopId] = {
                    shop: shopId,
                    items: [],
                    totalAmount: 0
                };
            }
            shopOrders[shopId].items.push(orderItem);
            shopOrders[shopId].totalAmount += subtotal;
        });

        // 2. Create one Order document for each shop
        const createdOrders = [];
        for (const shopId in shopOrders) {
            const orderData = {
                ...shopOrders[shopId],
                customerName,
                customerEmail,
                deliveryAddress,
                // Status defaults to 'pending'
            };
            const newOrder = await Order.create(orderData);
            createdOrders.push(newOrder);
        }

        // 3. Clear the cart (important step)
        cart.items = [];
        await cart.save();

        // 4. Respond (In a real app, you'd send an email confirmation here)
        res.status(201).json({ 
            message: 'Checkout successful! Thank you for your purchase.', 
            orders: createdOrders 
        });

    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Server error during checkout process.' });
    }
};