const mongoose = require('mongoose');

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = process.env;

const mongoString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/`;

mongoose.connect(mongoString)
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.log(error);
  });
