const {
  getCart,
  getSingleCart,
  addToCart,
  removeFromCart,
  updateItem,
} = require('../controllers/cart');

const router = require('express').Router();
import { advancedResults } from '../middlewares/advancedResults';

const { Cart } = require('../models/');
// import { userAuth } from '../middlewares/auth-guard';

router
  .route('/')
  .get(advancedResults(Cart), getCart)
  .post(addToCart)
  .put(updateItem);

router.route('/:id').get(getSingleCart).put(removeFromCart);

export default router;
