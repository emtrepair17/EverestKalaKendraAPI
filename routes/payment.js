const express = require('express');
const router = express.Router();

const {userPayment, webhooks, homeFunc} = require('../controller/payment/payment');
const { createUser, userList } = require('../controller/user/user');

router.route('/homeFunc').get(homeFunc);
router.route('/create-checkout-session').post(userPayment);
router.route('/webhooks').post(webhooks);
router.route('/createuser').post(createUser);
router.route('/userList').get(userList);

module.exports = router;