const { Schema, model } = require('mongoose');

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      default: 0,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Cart', CartSchema);
