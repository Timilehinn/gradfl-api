const express = require('express');
const user = require('./user')
const shop = require('./shop')
const mongodb = require('../config/db');

let router = express();

mongodb(() => {
  router.use('/user', user);
  router.use('/market', shop);
});

module.exports = router;