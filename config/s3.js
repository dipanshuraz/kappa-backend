import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';

import { bucketName, region, accessKeyId, secretAccessKey } from '../constants';

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
const uploadFileS3 = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

// downloads a file from s3
const getFileStreamS3 = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

// delete a file from s3
const deleteFileS3 = (fileKey) => {
  const params = {
    Key: fileKey,
    Bucket: bucketName,
  };

  console.log('delete start');

  return s3.deleteObject(params).promise();
};

export { getFileStreamS3, uploadFileS3, deleteFileS3 };
