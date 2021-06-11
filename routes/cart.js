const { getCart, addToCart, removeFromCart } = require('../controllers/cart');

const router = require('express').Router();
import { advancedResults } from '../middlewares/advancedResults';

const { Cart } = require('../models/');
import { userAuth } from '../middlewares/auth-guard';

router.route('/').get(advancedResults(Cart), getCart);

router.route('/:product').post(addToCart).delete(removeFromCart);

export default router;
