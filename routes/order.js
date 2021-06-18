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
    userAuth,
    advancedResults(Order, {
      path: 'orderItems.product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    }),
    getOrders
  )
  .post(userAuth, createOrder);

router.route('/:id').get(userAuth, getOrderById);
router.route('/:id/pay').put(userAuth, updateOrderToPaid);
router.route('/:id/deliver').put(userAuth, updateOrderToDelivered);

export default router;
