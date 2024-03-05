const router = require('express').Router()
const smsController = require('../Controllers/sms')
const verify = require('./utils/verifyToken')

router.post('/send', smsController.send);

module.exports = router