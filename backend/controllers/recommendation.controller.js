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