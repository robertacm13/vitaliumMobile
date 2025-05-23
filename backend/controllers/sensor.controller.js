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