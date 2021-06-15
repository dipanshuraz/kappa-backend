import express from 'express';
const router = express.Router();

import { userAuth, authorize } from '../middlewares/auth-guard';
import { advancedResults } from '../middlewares/advancedResults';
import { User } from '../models';

import {
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/user';

router.route('/').get(advancedResults(User), getUsers);

router.route('/profile').put(userAuth, authorize('user'), updateUserProfile);
router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser);

export default router;
