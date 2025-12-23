const express = require('express');
const router = express.Router();

const {userPayment, webhooks, homeFunc} = require('../controller/payment/payment')

router.route('/homeFunc').get(homeFunc);
router.route('/create-checkout-session').post(userPayment);
router.route('/webhooks').post(webhooks);

module.exports = router;