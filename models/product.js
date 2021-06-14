import { Schema, model } from 'mongoose';

const productSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    priority: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 5'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

productSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ productId: this._id });

  next();
});

productSchema.virtual('Reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  justOne: false,
});

const Product = model('Product', productSchema);

export default Product;
