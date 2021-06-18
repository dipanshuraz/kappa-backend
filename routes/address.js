import express from 'express';
const router = express.Router();

import { userAuth, authorize } from '../middlewares/auth-guard';
import { advancedResults } from '../middlewares/advancedResults';
import validatorMiddleware from '../middlewares/validator-middleware';
import { user } from '../models';

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address';

router
  .route('/')
  .get(userAuth, getAddresses)
  .post(userAuth, validatorMiddleware, addAddress);

router
  .route('/:id')
  .put(userAuth, updateAddress)
  .delete(userAuth, deleteAddress);

export default router;
