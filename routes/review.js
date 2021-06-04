const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  updateRating,
} = require('../controllers/review');

const router = require('express').Router({ mergeParams: true });

import { advancedResults } from '../middlewares/advancedResults';
import { userAuth } from '../middlewares/auth-guard';
import { Review } from '../models';

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'productId',
      select: 'title',
    }),
    getReviews
  )
  .post(createReview);

router.route('/:id').get(getReview).put(updateReview).delete(deleteReview);
router.route('/update-rating/:id').put(updateRating);

export default router;
