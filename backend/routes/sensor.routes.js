const express = require('express');
const router = express.Router();

const controller= require('../controllers/sensor.controller');

router.get('/', controller.getAllSensors);
router.get('/patient/:patientId', controller.getSensorsByPatientId); // Adaugă această rută


module.exports = router;
