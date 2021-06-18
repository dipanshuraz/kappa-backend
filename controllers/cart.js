import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Cart } from '../models';

const upsert = (array, item) => {
  const i = array.findIndex(
    (_item) => _item.product.toString() === item.product
  );
  if (i > -1) {
    let _item = array[i];
    item.quantity += _item.quantity;
    array[i] = item;
  } else array.push(item);
};

/**
 * @description get all categories
 * @api /api/v1/category
 * @access Private/Admin
 * @type GET
 */

const getCart = asyncHandler(async (req, res, next) => {
  res.status(200).json({ data: res.advancedResults });
});

const getSingleCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Cart.findOne({
    user: mongoose.Types.ObjectId(id),
  }).populate({
    path: 'items.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  if (cart) {
    res.status(200).json({ data: cart.items, success: true });
  } else {
    res.status(200).json({
      success: false,
      message: 'Cart is empty',
      data: null,
    });
  }
});

/**
 * @description Create a category
 * @api /api/v1/category
 * @access Private/Admin
 * @type POST
 */

const addToCart = asyncHandler(async (req, res, next) => {
  console.log(req.body, 'req.body');
  const { item } = req.body;

  if (!req.body.user) {
    res
      .status(200)
      .json({ success: false, data: [], message: 'No user found' });
  }

  let cart = await Cart.findOne({ user: req.body.user });

  if (cart) {
    upsert(cart.items, item);
    console.log('cart 1');
  } else {
    cart = await Cart.create({ user: req.body.user });
    cart.items.push(item);
    console.log('cart 2');
  }

  await cart.save();

  cart = await Cart.findOne({
    user: mongoose.Types.ObjectId(req.body.user),
  }).populate({
    path: 'items.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  res.status(200).json({ success: true, data: cart });
});

/**
 * @description delete a category
 * @api /api/v1/category/:categoryId
 * @access Private/Admin
 * @type DELETE
 */

const removeFromCart = asyncHandler(async (req, res, next) => {
  req.body.user = '60b91c696807c4197c691214';

  let cart = await Cart.findOne({
    user: mongoose.Types.ObjectId(req.body.user),
  });

  console.log(cart, 'cart in backnd');

  const { id } = req.params;

  if (!cart) {
    res.status(404);
    throw new Error(`Cart is not found with this user.`);
  }

  let result = cart.items.filter((elem) => elem._id.toString() !== id);

  cart.items = result;
  await cart.save();

  cart = await Cart.findOne({
    user: mongoose.Types.ObjectId(req.body.user),
  }).populate({
    path: 'items.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  res.status(200).json({ status: 'success', data: cart });
});

const updateItem = asyncHandler(async (req, res) => {
  const { itemId, type } = req.body;
  let cart = await Cart.findOne({ user: req.body.user });

  if (!cart) {
    res.status(200).json({ success: 'false', data: [] });
  }

  cart.items.forEach((elem) => {
    if (elem._id.toString() === itemId) {
      switch (type) {
        case 'inc':
          elem.quantity += 1;
          break;
        case 'dec':
          elem.quantity -= 1;
          break;
        default:
          elem.quantity;
      }
    }
    return elem;
  });

  await cart.save();

  cart = await Cart.findOne({
    user: mongoose.Types.ObjectId(req.body.user),
  }).populate({
    path: 'items.product',
    populate: {
      path: 'category',
      model: 'Category',
    },
  });

  res.status(200).json({ success: false, data: cart });
});

module.exports = {
  getCart,
  getSingleCart,
  addToCart,
  removeFromCart,
  updateItem,
};

// if (!findReview && req.user.role !== 'admin') {
//   res.status(400);
//   throw new Error('Not authorized to update this review');
// }

// initialize empty cart on user creation
// empty after each order
