const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const recommendationSchema = new Schema({
    _id: { type: Types.ObjectId, required: true, auto: true }, // ObjectId obligatoriu, generat automat dacă nu e setat
    patient_id: { type: String, required: true },  // @Field("patient_id")
    doctor_id: { type: String, required: true },   // @Field("doctor_id")
    activity_type: { type: String },                // @Field("activity_type")
    duration: { type: String },
    created_at: { type: Date, default: Date.now }   // @Field("created_at") + setat automat la creare
}, {
    collection: 'recommendations'
});

module.exports = mongoose.model('Recommendation', recommendationSchema);