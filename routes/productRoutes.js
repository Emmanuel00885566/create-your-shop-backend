import express from 'express';
import { createProduct, updateProduct, getAllProducts, getSingleProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../config/multer.js';

const router = express.Router();

// CREATE PRODUCT
router.post("/create_product", upload.single("image"), async (req, res) => {
    const { product_name, description, price, category, stock, shop } = req.body;
    const imagePath = req.file ? req.file.path : null;

    console.log("Image path:", imagePath);
    
    try {
        await createProduct (product_name, description, price, category, imagePath, stock, shop);
        res.status(201).json({message: "Product created successfully"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

export default router;