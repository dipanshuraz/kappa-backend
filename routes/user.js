import express from 'express';
const router = express.Router();

import { userAuth, authorize } from '../middlewares/auth-guard';
import { advancedResults } from '../middlewares/advancedResults';
import { Product } from '../models';

import {
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/user';

router
  .route('/')
  .get(advancedResults(Product), userAuth, authorize('admin'), getUsers);

router.route('/profile').put(userAuth, authorize('user'), updateUserProfile);
router
  .route('/:id')
  .delete(userAuth, authorize('admin'), deleteUser)
  .get(userAuth, authorize('admin'), getUserById)
  .put(userAuth, authorize('admin'), updateUser);

export default router;
