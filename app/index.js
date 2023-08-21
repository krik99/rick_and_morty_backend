const path = require('path');
const express = require('express');
const cors = require('cors');
require('./database/mongo');
const filestorage = require('./database/filestorage');
const charactersRoutes = require('./routes/characters');
const locationsRoutes = require('./routes/locations');

const app = express();
const port = 3000;

app.use(cors());
app.use('/v1/characters', charactersRoutes);
app.use('/v1/locations', locationsRoutes);

app.listen(port, () => {
  console.log('Server runing on port 3000');
});
app.use(filestorage.route, express.static(path.join(__dirname, '../static')));
