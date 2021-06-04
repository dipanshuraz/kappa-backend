const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

import { json } from 'body-parser';
import consola from 'consola';
import passport from 'passport';
import morgan from 'morgan';

import { notFound, errorHandler } from './middlewares/asyncHandler';

import { PORT } from './constants';

import authApi from './routes/auth';
import productApi from './routes/products';
import userApi from './routes/user';
import orderApi from './routes/order';
import categoryApi from './routes/category';
import filesApi from './routes/files';
import reviewApi from './routes/review';

const app = express();

connectDB();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(json());

app.use(passport.initialize());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

require('./middlewares/passport-middleware');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Node.js & Express' });
});

app.use('/api/v1/auth', authApi);
app.use('/api/v1/users', userApi);
app.use('/api/v1/products', productApi);
app.use('/api/v1/order', orderApi);
app.use('/api/v1/categories', categoryApi);
app.use('/api/v1/files', filesApi);
app.use('/api/v1/review', reviewApi);

app.use(notFound);
app.use(errorHandler);

console.log(PORT, 'PORT');

app.listen(PORT || 3000, () => {
  consola.success(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
