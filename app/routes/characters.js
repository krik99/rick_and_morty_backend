const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const CharacterModel = require('../models/character');
const CommentModel = require('../models/comment');
const { getArticles, fixImgPath } = require('../controllers/articles');

router.get('/', async (req, res) => {
  const {
    status, species, gender, planet,
  } = req.query;

  const filter = { };
  if (status) {
    filter.status = status;
  }
  if (species) {
    filter.species = species;
  }
  if (gender) {
    filter.gender = gender;
  }
  if (planet) {
    filter.planet = planet;
  }

  try {
    const {
      articles, page, pages,
    } = await getArticles(req, CharacterModel, filter);

    return res.status(200).json({
      characters: articles,
      pages,
      page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const uniqCategories = await CharacterModel.aggregate([
      {
        $group: {
          _id: null,
          status: { $addToSet: '$status' },
          species: { $addToSet: '$species' },
          gender: { $addToSet: '$gender' },
          planet: { $addToSet: '$planet' },
        },
      },
    ]);
    const { _id, ...categories } = uniqCategories[0];
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const characterId = req.params.id;
  try {
    const character = await CharacterModel.findById(characterId)
      .select('-_id')
      .populate({ path: 'comments', options: { sort: { published: -1 } } })
      .lean();
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    character.img = fixImgPath(character.img);
    return res.status(200).json(character);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', jsonParser, async (req, res) => {
  const character = new CharacterModel({ ...req.body });

  try {
    const newCharacter = await character.save();
    return res.status(200).json(newCharacter);
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
  const characterId = req.params.id;
  try {
    const character = await CharacterModel.findOneAndUpdate(
      { _id: characterId.toString() },
      req.body,
      { returnOriginal: false },
    );
    return res.status(200).json(character);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const characterId = req.params.id;
  try {
    const rc = await CharacterModel.deleteOne({ _id: characterId.toString() });
    if (rc.deletedCount > 0) {
      return res.status(200).json({ message: 'Character deleted' });
    }
    return res.status(404).json({ message: 'Character not found' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/:id/comments', jsonParser, async (req, res) => {
  const characterId = req.params.id;
  const { message } = req.body;
  try {
    const character = await CharacterModel.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    const comment = new CommentModel({ message });
    character.comments.push(comment._id);
    const newComment = await comment.save();
    await character.save();
    return res.status(200).json(newComment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id/comments/:commentid', jsonParser, async (req, res) => {
  const articleId = req.params.id;
  const commentId = req.params.commentid;
  try {
    const article = await CharacterModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Characters not found' });
    }
    const found = article.comments.find((element) => element.toString() === commentId);
    if (!found) {
      return res.status(404).json({ message: 'Incorrect comment id' });
    }
    const updComments = article.comments.filter((item) => item.toString() !== commentId);
    article.comments = updComments;

    const rc = await CommentModel.deleteOne({ _id: commentId.toString() });
    if (rc.deletedCount > 0) {
      await article.save();
      return res.status(200).json({ message: 'Comment deleted' });
    }
    return res.status(404).json({ message: 'Comment not found' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
