import asyncHandler from 'express-async-handler';
import { Product } from '../models';
import mongoose from 'mongoose';
import async from 'async';
import fs from 'fs';
import util from 'util';
import { uploadFileS3, getFileStreamS3, deleteFileS3 } from '../config/s3';
const unlinkFile = util.promisify(fs.unlink);

/**
 * @description Fetch all products
 * @api /api/products
 * @access Public
 * @type GET
 */

const getProducts = asyncHandler(async (req, res) => {
  // console.log(req.query, 'query');
  // const pageSize = 10;
  // const page = Number(req.query.pageNumber) || 1;
  // const keyword = req.query.keyword
  //   ? {
  //       title: {
  //         $regex: req.query.keyword,
  //         $options: 'i',
  //       },
  //     }
  //   : {};
  // const count = await Product.countDocuments({ ...keyword });
  // const products = await Product.find({ ...keyword })
  //   .sort([
  //     // ['price', req.query.sortBy],
  //     ['title', req.query.sortBy],
  //   ])
  //   .limit(pageSize)
  //   .skip(pageSize * (page - 1));
  // res.json({ products, page, pages: Math.ceil(count / pageSize) });
  res.status(200).json(res.advancedResults);
});

/**
 * @description Fetch single product
 * @api /api/products/:id
 * @access Public
 * @type GET
 */
const getProductById = asyncHandler(async (req, res) => {
  console.log(req.params.id, 'req.params.id');
  const product = await Product.find({ _id: req.params.id }).populate(
    'category'
  );

  if (product) {
    res.json({ data: product, success: true });
  } else {
    res.status(200).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }
});

/**
 * @description Delete a product
 * @api /api/products/:id
 * @access Private/Admin
 * @type DELETE
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ success: true, message: 'Product removed' });
  } else {
    res.status(200).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }
});

/**
 * @description Create a product
 * @api /api/products
 * @access Private/Admin
 * @type POST
 */

const createProduct = asyncHandler(async (req, res) => {
  console.log(req.files, 'files');
  console.log(JSON.parse(req.body.data), 'body');
  let formData = JSON.parse(req.body.data);
  const {
    user,
    title,
    price,
    images,
    description,
    discount,
    category,
    countInStock,
  } = formData;

  let array = [];
  async.series(
    [
      (cb) => {
        const product = new Product();
        product.title = title;
        product.price = price;
        product.discount = discount;
        product.user = mongoose.Types.ObjectId(user);
        product.images = images;
        product.category = mongoose.Types.ObjectId(category);
        product.countInStock = countInStock;
        product.description = description;

        product.save((err, product) => {
          if (err) {
            cb(err);
          }
          // console.log(product, 'product');
          req.product = product;
          cb();
        });
      },
      (cb) => {
        if (req.files && req.files.length) {
          async.eachSeries(
            req.files,
            (file, callback) => {
              uploadFileS3(file)
                .then((res) => {
                  array.push(res.key);
                  unlinkFile(file.path);
                  callback();
                })
                .catch((err) => {
                  callback(err);
                  console.log('in erro', err);
                  return;
                });
            },
            (err) => {
              if (err) {
                console.log('in erro2', err);
                cb(err);
                return;
              }
              req.product.images = array;
              req.product.save((err, product) => {
                if (err) {
                  cb(err);
                }
                console.log('qwertyui');
                cb();
              });
            }
          );
        } else {
          cb();
        }
      },
    ],
    (err) => {
      if (err) {
        res.json({ success: false, err, data: null });
        return;
      }
      res.status(201).json({ product: req.product });

      res.status(201).json({
        success: false,
        product: req.product,
        data: null,
      });
    }
  );
});

/**
 * @description Update a product
 * @api /api/products/:id
 * @access Private/Admin
 * @type PUT
 */

const updateProduct = asyncHandler(async (req, res) => {
  console.log(req.files, 'files');
  console.log(JSON.parse(req.body.data), 'body');
  let formData = JSON.parse(req.body.data);
  const {
    user,
    title,
    price,
    images,
    description,
    discount,
    category,
    countInStock,
  } = formData;

  let array = [];
  async.series(
    [
      (cb) => {
        Product.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).exec(
          (err, product) => {
            if (err) {
              cb(err);
              return;
            }

            if (product) {
              product.title = title;
              product.price = price;
              product.description = description;
              product.discount = discount;
              product.category = category;
              product.countInStock = countInStock;
              product.save((err, doc) => {
                if (err) {
                  cb(err);
                  return;
                }
                req.product = doc;
                cb();
              });
            } else {
              cb();
            }
          }
        );
      },
      (cb) => {
        if (req.files && req.files.length) {
          async.eachSeries(
            req.files,
            (file, callback) => {
              uploadFileS3(file)
                .then((res) => {
                  array.push(res.key);
                  unlinkFile(file.path);
                  callback();
                })
                .catch((err) => {
                  callback(err);
                  console.log('in erro', err);
                  return;
                });
            },
            (err) => {
              if (err) {
                console.log('in erro2', err);
                cb(err);
                return;
              }

              if (array && array.length) {
                array.forEach((img) => {
                  req.product.images.push(img);
                });
              }

              req.product.save((err, product) => {
                if (err) {
                  cb(err);
                }
                console.log('qwertyui');
                cb();
              });
            }
          );
        } else {
          cb();
        }
      },
    ],
    (err) => {
      if (err) {
        res.json({ success: false, err, data: null });
        return;
      }
      res.status(201).json({ success: true, data: req.product });
    }
  );
});

// const updateProduct = asyncHandler(async (req, res) => {
//   const { title, price, discount, description, category, countInStock } =
//     req.body;

//   const product = await Product.findById(req.params.id);

//   if (product) {
//     product.title = title;
//     product.price = price;
//     product.description = description;
//     // product.image = image;
//     product.discount = discount;
//     product.category = category;
//     product.countInStock = countInStock;

//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404);
//     throw new Error('Product not found');
//   }
// });

/**
 * @description Create new review
 * @api /api/products/:id/reviews
 * @access Private
 * @type POST
 */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @description Get top rated products
 * @api /api/products/top
 * @access Public
 * @type GET
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  if (products) {
    res.json({ data: products, success: true });
  } else {
    res.json({ data: null, success: false });
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
