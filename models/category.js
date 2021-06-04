const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  categoryName: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Category', CategorySchema);
