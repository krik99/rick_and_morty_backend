const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is missing'],
  },
  img: {
    type: String,
    required: [true, 'Img is missing'],
  },
  status: {
    type: String,
    required: [true, 'Status is missing'],
  },
  species: {
    type: String,
    required: [true, 'Species is missing'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is missing'],
  },
  planet: {
    type: String,
    required: [true, 'Planet is missing'],
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
}, {
  versionKey: false,
});

module.exports = mongoose.model('characters', characterSchema);
