import { createProductSvc, listProductsSvc, getSingleProductSvc, updateProductSvc, deleteProductSvc } from '../services/productService.js'

export const createProduct = async (req, res) => {
  try {
    const { product_name, description, price, category, image, stock, shop } = req.body
    const product = await createProductSvc({ product_name, description, price, category, image, stock, shop })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await listProductsSvc(req.query)
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const getSingleProduct = async (req, res) => {
  try {
    const product = await getSingleProductSvc(req.params.product_name)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const result = await updateProductSvc(req.params.product_name, req.body)
    res.json({ message: "Product updated", result })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductSvc(req.params.product_name)
    res.json({ message: "Product deleted", result })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}