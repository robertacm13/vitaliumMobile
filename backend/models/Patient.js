const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    _id: { type: String }, // @Id și @Field("_id")
    first_name: { type: String, required: true }, // @Field("first_name")
    last_name: { type: String, required: true },  // @Field("last_name")
    cnp: {
        type: String,
        set: v => v ? v.toLowerCase() : null, // transformă la litere mici sau null dacă e falsy
        default: null
    },
    age: { type: Number },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    medical_history: { type: String }, // @Field("medical_history")
    doctor_id: { type: String },       // @Field("doctor_id")
    password: { type: String },
    dateBirth: { type: Date },         // @Field("dateBirth")
    job: { type: String }
}, {
    collection: 'patients'
});