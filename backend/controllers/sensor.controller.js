const Sensor = require('../models/Sensor'); // Import the Doctor model
const mongoose = require('mongoose');

exports.getAllSensors = async (req, res) => {
    try {
        const Sensors = await Sensor.find();
        res.status(200).json(Sensors);
    } catch (err) {
        console.error('Error in getAllPatients:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSensorsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        // Folosește numele corect al câmpului cu punct și virgulă
        const sensors = await Sensor.find({ "patient_id;": patientId });
        
        console.log(`Found ${sensors.length} sensors for patient ${patientId}`);
        
        res.status(200).json(sensors);
    } catch (err) {
        console.error('Error in getSensorsByPatientId:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};