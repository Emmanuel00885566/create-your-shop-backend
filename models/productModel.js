import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: { type: String },
        image: { type: String }, // Image path from Multer
        stock: { type: Number, default: 0 },
        shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }, //  required: true 
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;