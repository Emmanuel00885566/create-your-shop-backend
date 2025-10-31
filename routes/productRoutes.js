import express from 'express';
import { 
  createProduct, 
  updateProduct, 
  getAllProducts, 
  getSingleProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { upload } from '../config/multer.js'; 

const router = express.Router();

router.post('/create_product', upload.single('image'), createProduct);

router.get('/products', getAllProducts);
router.get('/product/:product_name', getSingleProduct);
router.put('/product/:product_name', updateProduct);
router.delete('/product/:product_name', deleteProduct);

export default router;
