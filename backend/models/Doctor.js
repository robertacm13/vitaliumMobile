const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    _id: { type: String },        // @Id și @Field("_id")
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    // specialization: { type: String, default: "medical" }, // dacă vrei să folosești câmpul acesta, descomentează-l
}, {
    collection: 'doctors'
});

module.exports = mongoose.model('Doctor', doctorSchema);