import asyncHandler from 'express-async-handler';
import { Category } from '../models';

/**
 * @description get all categories
 * @api /api/v1/category
 * @access Private/Admin
 * @type GET
 */

const getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json({ data: res.advancedResults });
});

/**
 * @description get a category
 * @api /api/v1/category/:categoryId
 * @access Private/Admin
 * @type GET
 */
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    res.status(200).send({
      success: false,
      data: [],
      message: `Category is not found with id of ${req.params.categoryId}`,
    });
  }

  res.status(200).send({ status: 'success', data: category });
});

/**
 * @description Create a category
 * @api /api/v1/category
 * @access Private/Admin
 * @type POST
 */

const addCategory = asyncHandler(async (req, res, next) => {
  let categoryName = req.body;
  console.log(req.body, 'req.body');
  categoryName = categoryName.categoryName.toLowerCase();
  console.log(categoryName, 'req.body');

  let category = await Category.findOne({ categoryName });

  console.log(category, 'category');

  if (category) {
    res.status(200).send({
      success: false,
      data: [],
      message: `Category already exists ${categoryName}`,
    });
  } else {
    category = await Category.create({ categoryName });
    res.status(201).send({ success: true, data: category });
  }
});

/**
 * @description update a category
 * @api /api/v1/category/:categoryId
 * @access Private/Admin
 * @type PUT
 */

const updateCategory = asyncHandler(async (req, res, next) => {
  console.log(req.params.categoryId, 'req.params.categoryId');
  console.log(req.body, 'body');

  const editCategory = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editCategory) {
    res.status(200).send({
      success: false,
      data: [],
      message: `Category is not found with id of ${req.params.categoryId}`,
    });
  }

  const updatedUser = await Category.findById(req.params.categoryId);

  res.status(201).send({ success: true, data: updatedUser });
});

/**
 * @description delete a category
 * @api /api/v1/category/:categoryId
 * @access Private/Admin
 * @type DELETE
 */

const removeCategory = asyncHandler(async (req, res, next) => {
  const findCategory = await Category.findByIdAndDelete(req.params.categoryId);

  if (!findCategory) {
    res.status(200).send({
      success: false,
      data: [],
      message: `Category is not found with id of ${req.params.categoryId}`,
    });
  }

  res
    .status(200)
    .json({ success: true, message: 'Category Deleted Successfully' });
});

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory,
};
