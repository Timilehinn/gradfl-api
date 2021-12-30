const express = require('express');
const user = require('../controllers/User.controller.js')
const verifyJWT = require('../utils/verifyJWT')

var router = require("express").Router();

router.post('/auth/signin', user.login)
router.post('/create-purchase-code', verifyJWT, user.createPurchaseCode)
router.get('/transactions', verifyJWT, user.getTransactions)
router.get('/orders', verifyJWT, user.getOrders)
router.get('/isuserauth', verifyJWT, user.isUserAuth)

// router.post('/verify_login_token', verifyJWT.verify_for_login, user.verifyLoginToken)

module.exports = router;
