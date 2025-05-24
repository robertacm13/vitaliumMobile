require('dotenv').config(); // asta trebuie să fie SUS de tot

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// În index.js, adaugă aceste linii după conectare
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`✅ Connected to MongoDB - Database: ${mongoose.connection.db.databaseName}`);
        // Listează colecțiile pentru a verifica
        mongoose.connection.db.listCollections().toArray().then(collections => {
            console.log('Colecții disponibile:', collections.map(c => c.name));
        });
    })

const patientRoutes = require('./routes/patient.routes');
const alertRoutes = require('./routes/alert.routes');
const doctorRoutes = require('./routes/doctor.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const sensorRoutes = require('./routes/sensor.routes');
const authRoutes = require('./routes/auth.routes');
// Adaugă acest middleware înainte de rutele tale

app.use('/api/patient', patientRoutes);
app.use('/api/alert', alertRoutes); // TODO: schimbați asta să fie altceva, nu știu ce
app.use('/api/doctor', doctorRoutes);
app.use('/api/recommendation',recommendationRoutes);
app.use('/api/sensor',sensorRoutes); // TODO: schimbați asta să fie altceva, nu știu ce
app.use('/api', authRoutes); // TODO: schimbați asta să fie altceva, nu știu ce

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
