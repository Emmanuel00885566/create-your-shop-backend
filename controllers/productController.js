/*
•	Ensure that only the shop owner can modify their products.
*/

import Product from "../models/productModel.js";

export const createProduct = async (product_name, 
    description, 
    price, 
    category, 
    image,
    stock,
    shop) => {
    const product = new Product ({ 
        product_name, 
        description, 
        price, 
        category, 
        image,
        stock, 
        shop });

    const result = await product.save();
    console.log("Product created:", result);
    return result;
};

export const getAllProducts = async () => {
    const products = await Product.find();
    console.log("Products:", products)
    return products;
};

export const getSingleProduct = async (product_name) => {
    const result = await Product.findOne({ product_name });
    console.log("Product found", result);
    return result;
};

export const updateProduct = async (product_name, updatedFields) => {
    const result = await Product.updateOne(
        { product_name },
        { $set: updatedFields }
    );
    console.log("Product updated:", result);
};

export const deleteProduct = async (product_name) => {
    const result = await Product.deleteOne({ product_name});
    console.log("Product removed:", result);
};