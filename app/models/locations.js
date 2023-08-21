const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is missing'],
  },
  img: {
    type: String,
    required: [true, 'Img is missing'],
  },
  type: {
    type: String,
    required: [true, 'Type is missing'],
  },
  dimension: {
    type: String,
    required: [true, 'Dimension is missing'],
  },
  description: {
    type: String,
    required: [true, 'Description is missing'],
  },
  content: {
    type: String,
    required: [true, 'Content is missing'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  published: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Number,
    required: [true, 'Author is missing'],
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
}, {
  versionKey: false,
});

module.exports = mongoose.model('location', locationSchema);
