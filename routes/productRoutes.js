import express from 'express';
import { createProduct, updateProduct, getAllProducts, getSingleProduct, deleteProduct } from '../controllers/productController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// CREATE PRODUCT **Working perfectly**
router.post("/create_product", (req, res, next) => {
    upload.single("image")(req, res, function(err) {
        if (err) {
            console.error("Multer error:", err);
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: "File too large" });
                }
            }
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    const { product_name, description, price, category, stock, shop } = req.body;
    const image = req.file ? req.file.path : null;

    console.log("Final image path:", image);
    
    try {
        await createProduct (product_name, description, price, category, image, stock, shop);
        res.status(201).json({message: "Product created successfully"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

// GET PRODUCTS **Working perfectly**
router.get("/products", async (req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// FIND PRODUCT **Working perfectly**
router.get("/product/:product_name", async (req, res) => {
    const { product_name } = req.params;
    try {
        const foundProduct = await getSingleProduct(product_name);
        if (foundProduct) {
            res.status(200).json(foundProduct);
        } else {
            res.status(404).json({ error: "Product not found" });
        } 
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
});

// UPDATE PRODUCT **Working perfectly**
// Look into image upadate as well using Multer
router.put("/product/:product_name", async (req, res) => {
    const { product_name } = req.params;
    const updatedFields = req.body;
    try {
        await updateProduct(product_name, updatedFields);
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE PRODUCT **Working perfectly**
// See if I can make it work to send an error message if a non-existent product is being deleted
router.delete("/product/:product_name", async (req, res) => {
    const { product_name } = req.params;
    try {
        await deleteProduct(product_name);
        res.status(200).json({ message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;