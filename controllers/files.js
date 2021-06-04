import asyncHandler from 'express-async-handler';
import fs from 'fs';
import util from 'util';

import { uploadFileS3, getFileStreamS3, deleteFileS3 } from '../config/s3';

const unlinkFile = util.promisify(fs.unlink);

const uploadFiles = asyncHandler(async (req, res) => {
  const file = req.file;
  console.log(file, 'file');

  // apply filter
  // resize

  const result = await uploadFileS3(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.Key}` });
});

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
  console.log(file);

  // apply filter
  // resize

  const result = await uploadFileS3(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.Key}` });
});

export { uploadFiles, getFile, deleteFile, uploadSingleFile };
