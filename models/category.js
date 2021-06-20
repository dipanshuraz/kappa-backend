const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Category', CategorySchema);
