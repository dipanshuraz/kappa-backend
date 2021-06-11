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

router.route('/').post(addOrderItems).get(getOrders);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/deliver').put(updateOrderToDelivered);

export default router;
