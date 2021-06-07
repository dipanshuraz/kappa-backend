import async from 'async';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import util from 'util';
import { Product } from '../models';
import mongoose from 'mongoose';

import { uploadFileS3, getFileStreamS3, deleteFileS3 } from '../config/s3';

const unlinkFile = util.promisify(fs.unlink);

const uploadFiles = (req, res) => {
  console.log(req.params, 'paams');
  let array = [];
  async.series(
    [
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
                  return;
                });
            },
            (err) => {
              if (err) {
                cb(err);
                return;
              }
              cb();
            }
          );
        } else {
          res.json({ success: true, files: [] });
        }
      },
      (cb) => {
        Product.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).exec(
          (err, product) => {
            if (err) {
              cb(err);
              return;
            }
            product.images = array;
            product.save((err, doc) => {
              if (err) {
                cb(err);
                return;
              }
              req.product = doc;
              cb();
            });
          }
        );
      },
    ],
    (err) => {
      if (err) {
        res.json({ success: false, err });
        return;
      }

      res.json({ success: true, files: array, product: req.product });
    }
  );
};

const getFile = (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStreamS3(key);

  readStream.pipe(res);
};

const deleteFile = asyncHandler(async (req, res) => {
  console.log(req.params, 'params for delete');
  const key = req.params.key;
  const result = await deleteFileS3(key);

  console.log(result, 'result delete');
  res.send({ success: true });
});

const uploadSingleFile = asyncHandler(async (req, res) => {
  const file = req.file;
  console.log(file, 'file');

  // apply filter
  // resize

  const result = await uploadFileS3(file);
  await unlinkFile(file.path);
  console.log(result);

  res.send({ imagePath: result.Key });
});

export { uploadFiles, getFile, deleteFile, uploadSingleFile };
