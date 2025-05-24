const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    _id: { type: String },                  // @Id și @Field("_id")
    patient_id: { type: String ,
        alias:'patient_id;',           // @Field("patient_id;") — am scos punctul și virgula
    },           // @Field("patient_id;") — am scos punctul și virgula
    ekg_signal: { type: String,
        alias:'ekg_signal;',           // @Field("ekg_signal;") — am scos punctul și virgula
     },           // @Field("ekg_signal;") — am scos punctul și virgula
    heart_rate: { type: String },           // @Field("heart_rate")
    temperature: { type: Number },          // double în Java -> Number în JS
    humidity: { type: Number },
    timestamp: { type: Date }                // LocalDateTime în Java -> Date în JS
}, {
    collection: 'sensors'
});

module.exports = mongoose.model('Sensor', sensorSchema);