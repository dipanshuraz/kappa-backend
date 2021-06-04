import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from '../controllers/order';

import express from 'express';
const router = express.Router();
import { userAuth } from '../middlewares/auth-guard';

router.route('/').post(userAuth, addOrderItems).get(userAuth, getOrders);
router.route('/myorders').get(userAuth, getMyOrders);
router.route('/:id').get(userAuth, getOrderById);
router.route('/:id/pay').put(userAuth, updateOrderToPaid);
router.route('/:id/deliver').put(userAuth, updateOrderToDelivered);

export default router;
