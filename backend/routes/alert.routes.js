
const express = require('express');
const router = express.Router();

const controller= require('../controllers/alert.controller');

router.get('/', controller.getAllAlerts);


module.exports = router;

