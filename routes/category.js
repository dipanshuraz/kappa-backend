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
  .post(addCategory);

router
  .route('/:categoryId')
  .get(getCategory)
  .put(updateCategory)
  .delete(removeCategory);

export default router;
