
const express = require('express');
const router = express.Router();

const controller= require('../controllers/alert.controller');

router.get('/', controller.getAllAlerts);

router.get('/patient/:patientId', controller.getAlertsByPatientId); // Adaugă această rută


module.exports = router;

