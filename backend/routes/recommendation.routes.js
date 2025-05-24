
const express = require('express');
const router = express.Router();

const controller= require('../controllers/recommendation.controller');

router.get('/', controller.getAllRecommendations);
router.get('/patient/:patientId', controller.getRecommendationsByPatientId); // Adaugă această rută


module.exports = router;
