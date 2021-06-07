import asyncHandler from 'express-async-handler';
import { Product, Review } from '../models';
import mongoose from 'mongoose';

const getReviews = asyncHandler(async (req, res, next) => {
  console.log(req.params, 'entry');
  if (req.params.productId) {
    const findProduct = await Product.findById(req.params.productId);
    if (!findProduct) {
      res.status(404);
      throw new Error(
        `Product is not found with id of ${req.params.productId}`
      );
    }

    const productReviews = await Review.find({
      productId: req.params.productId,
    }).populate({
      path: 'userId',
      select: 'name email',
    });

    return res.status(200).send({
      status: 'success',
      count: productReviews.length,
      data: productReviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'userId',
    select: 'name email',
  });

  if (!review) {
    res.status(404);
    throw new Error(`Review is not found with id of ${req.params.id}`);
  }

  res.status(200).send({
    status: 'success',
    count: review.length,
    data: review,
  });
});

const createReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(
    mongoose.Types.ObjectId(req.body.productId)
  );

  if (!product) {
    res.status(404);
    throw new Error(`Product is not found with id of ${req.body.productId}`);
  }

  const isReview = await Review.findOne({
    // productId: mongoose.Types.ObjectId(req.body.productId),
    // userId: mongoose.Types.ObjectId(req.user._id),
    productId: mongoose.Types.ObjectId(req.body.productId),
    userId: mongoose.Types.ObjectId(req.body.userId),
  });

  if (isReview) {
    res.status(409);
    throw new Error(`Already Reviwed`);
  }

  const review = await Review.create({
    ...req.body,
    // productId: req.params.productId,
    // userId: req.user._id,
  });

  res.status(201).send({ status: 'success', data: review });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review is not found with id of ${req.params.id}`);
  }
  //check if review belongs to user created or user is admin

  const findReview = await Review.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!findReview && req.user.role !== 'admin') {
    res.status(400);
    throw new Error('Not authorized to update this review');
  }

  const editReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const updatedreview = await Review.findById(req.params.id);

  res.status(200).send({ status: 'success', data: updatedreview });
});

const updateRating = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review is not found with id of ${req.params.id}`);
  }
  //check if review belongs to user created or user is admin

  const findReview = await Review.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!findReview && req.user.role !== 'admin') {
    res.status(400);
    throw new Error('Not authorized to update this review');
  }
  review.rating = req.body.newRating;

  await review.save();

  const updatedreview = await Review.findById(req.params.id);

  res.status(200).send({ status: 'success', data: updatedreview });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review is not found with id of ${req.params.id}`);
  }

  //check if review belongs to user created or user is admin
  const findReview = await Review.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!findReview && req.user.role !== 'admin') {
    res.status(400);
    throw new Error('Not authorized to update this review');
  }

  await review.remove();

  res
    .status(204)
    .send({ status: 'success', message: 'Review Deleted Successfully' });
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  updateRating,
};
