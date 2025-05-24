const Alert = require('../models/Alert');
const mongoose = require('mongoose');
exports.getAllAlerts = async (req, res) => {
    try {
        // Verifică datele brute din MongoDB
      //  const rawData = await mongoose.connection.db.collection('alerts').find().toArray();
      //  console.log('Date brute din colecția alerts:', rawData.length);
        
        if (rawData.length > 0) {
            console.log('Primul document:', JSON.stringify(rawData[0], null, 2));
        }
        
        const alerts = await Alert.find();
        console.log('Alerte returnate de Mongoose:', alerts.length);
        
        // Pentru debug, returnează datele brute în loc de rezultatul Mongoose
        res.status(200).json(rawData);
    } catch (err) {
        console.error('Error in getAllAlerts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};






exports.getAlertsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        
        // Validate patient ID
        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }
        
        // Find alerts for this patient
        const alerts = await Alert.find({ patient_id: patientId });
        
        console.log(`Found ${alerts.length} alerts for patient ${patientId}`);
        
        res.status(200).json(alerts);
    } catch (err) {
        console.error('Error in getAlertsByPatientId:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};