import express from "express";
import multer from "multer";
import { upload } from "../config/multer.js";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err);
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File too large" });
        }
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const { product_name, description, price, category, stock, shop } = req.body;
    const image = req.file ? req.file.path : "";

    try {
      const result = await createProduct(
        product_name,
        description,
        price,
        category,
        image,
        stock,
        shop
      );
      res
        .status(201)
        .json({ success: true, message: "Product created successfully", data: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:product_name", async (req, res) => {
  const { product_name } = req.params;
  try {
    const product = await getSingleProduct(product_name);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:product_name", async (req, res) => {
  const { product_name } = req.params;
  const updatedFields = req.body;
  try {
    await updateProduct(product_name, updatedFields);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:product_name", async (req, res) => {
  const { product_name } = req.params;
  try {
    const product = await getSingleProduct(product_name);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await deleteProduct(product_name);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
