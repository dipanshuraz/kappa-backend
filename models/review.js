const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'title cannot be longer than 100 character'],
  },
  text: {
    type: String,
    required: [true, 'Please add a text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

reviewSchema.statics.getRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { productId: productId },
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post('save', function () {
  this.constructor.getRating(this.productId);
});

reviewSchema.pre('remove', function () {
  this.constructor.getRating(this.productId);
});

const Review = model('Review', reviewSchema);

export default Review;
