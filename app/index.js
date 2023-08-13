const express = require('express');
const cors = require('cors');
require('./database/mongo');

const charactersRoutes = require('./routes/characters');

const app = express();
const port = 3000;

app.use(cors());
app.use('/v1/characters', charactersRoutes);

app.listen(port, () => {
  console.log('Server runing on port 3000');
});
