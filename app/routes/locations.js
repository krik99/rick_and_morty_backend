const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const LocationModel = require('../models/locations');
const { getArticles, fixImgPath } = require('../controllers/articles');

router.get('/', async (req, res) => {
  const {
    type, dimension,
  } = req.query;

  const filter = {};
  if (type) {
    filter.type = type;
  }
  if (dimension) {
    filter.dimension = dimension;
  }
  try {
    const {
      articles, page, pages,
    } = await getArticles(req, LocationModel, filter);

    return res.status(200).json({
      locations: articles,
      pages,
      page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const uniqLocations = await LocationModel.aggregate([
      {
        $group: {
          _id: null,
          type: { $addToSet: '$type' },
          dimension: { $addToSet: '$dimension' },
        },
      },
    ]);
    const { _id, ...categories } = uniqLocations[0];
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const locationId = req.params.id;
  try {
    const location = await LocationModel.findById(locationId)
      .select('-_id')
      .populate('comments')
      .populate({ path: 'comments', options: { sort: { published: -1 } } })
      .lean();
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    location.img = fixImgPath(location.img);
    return res.status(200).json(location);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', jsonParser, async (req, res) => {
  const location = new LocationModel({ ...req.body });
  try {
    const newLocation = await location.save();
    return res.status(200).json(newLocation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send({ message: errors });
    }
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', jsonParser, async (req, res) => {
  const locationId = req.params.id;
  try {
    const location = await LocationModel.findOneAndUpdate(
      { _id: locationId.toString() },
      req.body,
      { returnOriginal: false },
    );
    return res.status(200).json(location);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const locationId = req.params.id;
  try {
    const rc = await LocationModel.deleteOne({ _id: locationId.toString() });
    if (rc.deletedCount > 0) {
      return res.status(200).json({ message: 'Loaction deleted' });
    }
    return res.status(404).json({ message: 'Loaction not found' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
