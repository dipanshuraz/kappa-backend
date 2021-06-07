const { getCart, addToCart, removeFromCart } = require('../controllers/cart');

const router = require('express').Router();
import { advancedResults } from '../middlewares/advancedResults';

const { Cart } = require('../models/');
import { userAuth } from '../middlewares/auth-guard';

router.route('/').get(userAuth, advancedResults(Cart), getCart);

router
  .route('/:product')
  .post(userAuth, addToCart)
  .delete(userAuth, removeFromCart);

export default router;
