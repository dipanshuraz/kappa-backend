import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
} from '../controllers/products';

import express from 'express';
const router = express.Router();

import { Product } from '../models';
import { advancedResults } from '../middlewares/advancedResults';
import { userAuth, authorize } from '../middlewares/auth-guard';

// protect, admin,
router
  .route('/')
  .get(
    advancedResults(Product, {
      path: 'Reviews',
      select: 'title',
    }),
    getProducts
  )
  .post(createProduct);

router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(userAuth, authorize('admin'), getProductById)
  .delete(userAuth, authorize('admin'), deleteProduct)
  .put(userAuth, authorize('admin'), updateProduct);

export default router;
