const {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
} = require('../controllers/category');

const router = require('express').Router();
import { advancedResults } from '../middlewares/advancedResults';

const { Category } = require('../models/');
import { userAuth, authorize } from '../middlewares/auth-guard';

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(userAuth, authorize('admin'), addCategory);

router
  .route('/:categoryId')
  .get(userAuth, authorize('admin'), getCategory)
  .put(userAuth, authorize('admin'), updateCategory)
  .delete(userAuth, authorize('admin'), removeCategory);

export default router;
