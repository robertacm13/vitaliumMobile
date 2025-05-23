const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    _id: { type: String }, // corespunde la @Id și @Field("_id")
    patient_id: { type: String }, // corespunde la @Field("patient_id")
    message: { type: String },
    timestamp: { type: Date } // echivalent pentru LocalDateTime
}, {
    collection: 'alerts' // specificăm colecția, similar cu @Document(collection = "alerts")
});

module.exports = mongoose.model('Alert', alertSchema);