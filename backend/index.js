require('dotenv').config(); // asta trebuie să fie SUS de tot

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Mongo error:", err));

const patientRoutes = require('./routes/patient.routes');
app.use('/api/patient', patientRoutes);


