require('dotenv').config();
const mongoose = require('mongoose');

module.exports = (callback) => {
  mongoose.set('useFindAndModify', false);
    mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  let db = mongoose.connection;
  db.on('open', function () {
    console.log(`connected to DB -> ${process.env.DATABASE}`);
  });

  db.on('error', function (error) {
    console.log('Database connection error ' + error.message);
  });

  callback(db);
};