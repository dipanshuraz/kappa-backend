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

router.route('/').get(getAddresses).post(addAddress);

router.route('/:id').put(updateAddress).delete(deleteAddress);

export default router;
