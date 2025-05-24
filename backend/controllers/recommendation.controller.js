const Recommendation = require('../models/Recommendation'); // Import the Doctor model
const mongoose = require('mongoose');

exports.getAllRecommendations = async (req, res) => {
    try {
        const Recommendations = await Recommendation.find();
        res.status(200).json(Recommendations);
    } catch (err) {
        console.error('Error in getAllPatients:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.getRecommendationsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        
        // Validate patient ID
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        // Find recommendations for this patient
        const recommendations = await Recommendation.find({ patient_id: patientId });
        
        console.log(`Found ${recommendations.length} recommendations for patient ${patientId}`);
        
        res.status(200).json(recommendations);
    } catch (err) {
        console.error('Error in getRecommendationsByPatientId:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};