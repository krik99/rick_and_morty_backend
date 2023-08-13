const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const CharacterModel = require('../models/character');

router.get('/', async (req, res) => {
  try {
    const characters = await CharacterModel.find()
      .select('-author')
      .sort({ published: -1 });
    return res.status(200).json({ ...characters });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const characterId = req.params.id;
  try {
    const character = await CharacterModel.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
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

module.exports = router;
