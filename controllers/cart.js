import asyncHandler from 'express-async-handler';
import { Category } from '../models';

/**
 * @description get all categories
 * @api /api/v1/category
 * @access Private/Admin
 * @type GET
 */

const getCart = asyncHandler(async (req, res, next) => {
  res.status(200).json({ data: res.advancedResults });
});

/**
 * @description Create a category
 * @api /api/v1/category
 * @access Private/Admin
 * @type POST
 */

const addToCart = asyncHandler(async (req, res, next) => {
  let categoryName = req.body;
  console.log(req.body, 'req.body');
  categoryName = categoryName.categoryName.toLowerCase();
  console.log(categoryName, 'req.body');

  let category = await Category.findOne({ categoryName });

  console.log(category, 'category');

  if (category) {
    res.status(404);
    throw new Error(`Category already exists ${categoryName}`);
  } else {
    category = await Category.create({ categoryName });
    res.status(201).send({ status: 'success', data: category });
  }
});

/**
 * @description delete a category
 * @api /api/v1/category/:categoryId
 * @access Private/Admin
 * @type DELETE
 */

const removeFromCart = asyncHandler(async (req, res, next) => {
  const findCategory = await Category.findByIdAndDelete(req.params.categoryId);

  if (!findCategory) {
    res.status(404);
    throw new Error(
      `Category is not found with id of ${req.params.categoryId}`
    );
  }

  res
    .status(200)
    .json({ status: 'success', message: 'Category Deleted Successfully' });
});

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
};

if (!findReview && req.user.role !== 'admin') {
  res.status(400);
  throw new Error('Not authorized to update this review');
}
