import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/order';

import express from 'express';
const router = express.Router();
import { userAuth } from '../middlewares/auth-guard';
import { advancedResults } from '../middlewares/advancedResults';
import { Order } from '../models';

router
  .route('/')
  .get(
    advancedResults(Order, {
      path: 'orderItems.product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    }),
    getOrders
  )
  .post(createOrder);

router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/deliver').put(updateOrderToDelivered);

export default router;
