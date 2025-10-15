import express from "express";

import * as ShopController from "/controllers/ShopController.js";

import protect from "/middlewares/authMiddleware.js"

export const router = express.Router();

 router.post('/', protect,ShopController.createshop);

 router.get('/me',protect,ShopController.getOwnerShop);

 router.put('/me',protect,ShopController.getOwnerShop);

 router.get('/:slug',ShopController.getShopBySlug);
