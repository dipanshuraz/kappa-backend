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
import { userAuth } from '../middlewares/auth-guard';

router
  .route('/')
  .get(advancedResults(Cart), userAuth, getCart)
  .post(userAuth, addToCart)
  .put(userAuth, updateItem);

router.route('/user').get(userAuth, getSingleCart);

router.route('/item/:id').put(userAuth, removeFromCart);

export default router;
