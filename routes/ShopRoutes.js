import express from "express";

import { createShop, updateShop, getShopBySlug } from '../controllers/ShopController.js';

// import protect from "/middlewares/authMiddleware.js"

const router = express.Router();

// router.post('/', protect,ShopController.createshop);

// router.get('/me',protect,ShopController.getOwnerShop);

// router.put('/me',protect,ShopController.getOwnerShop);

// router.get('/:slug',ShopController.getShopBySlug);


router.post('/create_shop', createShop);
router.post('/update_shop', updateShop); // for updateShop
router.get('/:slug', getShopBySlug);

export default router;