const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor.controller');

// Define routes
router.get('/', controller.getAllDoctors);
// Add other routes as needed
// router.get('/:id', controller.getDoctorById);
// router.post('/', controller.createDoctor);
// etc.

module.exports = router;  // This export is critical

