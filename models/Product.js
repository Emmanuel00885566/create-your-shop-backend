import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String },
    price: {
      type: Number,
      required: true,
    },
    category: { type: String },
    image: { type: String },
    stock: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
