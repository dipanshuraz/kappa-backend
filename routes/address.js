import express from 'express';
const router = express.Router();

import { userAuth, authorize } from '../middlewares/auth-guard';
import { advancedResults } from '../middlewares/advancedResults';
import { user } from '../models';

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address';

router.route('/').get(userAuth, getAddresses).post(userAuth, addAddress);

router
  .route('/:id')
  .put(userAuth, updateAddress)
  .delete(userAuth, deleteAddress);

export default router;
