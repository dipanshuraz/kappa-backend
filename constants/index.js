require('dotenv').config();

export const NODE_ENV = process.env.NODE_ENV;

export const DB = process.env.DATABASE_CLOUD;
export const SECRET = process.env.APP_SECRET;
export const DOMAIN = process.env.APP_DOMAIN;
export const SENDGRID_API = process.env.SENDGRID_API_KEY;
export const PORT = process.env.PORT || 3000;
export const HOST_EMAIL = process.env.APP_HOST_EMAIL;

export const bucketName = process.env.AWS_BUCKET_NAME;
export const region = process.env.AWS_BUCKET_REGION;
export const accessKeyId = process.env.AWS_ACCESS_KEY;
export const secretAccessKey = process.env.AWS_SECRET_KEY;

export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE;
