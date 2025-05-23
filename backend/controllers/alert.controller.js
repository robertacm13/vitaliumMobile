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