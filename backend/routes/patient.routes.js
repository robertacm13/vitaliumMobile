const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient.controller');
const controllerAlerts = require('../controllers/alert.controller');

// Adaugă această rută alternativă
router.get('/email', controller.getPatientByEmailQuery);
router.get('/', controller.getAllPatients);
//router.get('/email/:email', controller.getPatientByEmail);
router.post('/', controller.createPatient);

router.put('/:id', controller.updatePatient);
//router.delete('/:id', controller.deletePatient);

router.get('/:id/doctor', controller.getPatientDoctor);

module.exports = router;
