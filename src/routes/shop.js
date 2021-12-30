const express = require('express');
const shop = require('../controllers/Shop.controller.js')
const verifyJWT = require('../utils/verifyJWT')

var router = require("express").Router();

router.get('/all', verifyJWT, shop.getMarketItems)
router.get('/item/:code', verifyJWT, shop.getMarketItem)
router.post('/item/decline/:code', verifyJWT, shop.declinePurchase)
router.post('/item/pay/:code', verifyJWT, shop.makePayment)

// router.post('/verify_login_token', verifyJWT.verify_for_login, user.verifyLoginToken)

module.exports = router;
