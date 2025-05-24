const Patient = require('../models/Patient');
const mongoose = require('mongoose');

// GET /api/patient/ => toți pacienții
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (err) {
        console.error('Error in getAllPatients:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getPatientDoctor = async (req, res) => {
    try {
        const patientId = req.params.id;
        console.log('ID căutat:', patientId);
        
        // Găsim pacientul
        let patient = await Patient.findById(patientId);
        
        if (!patient) {
            console.log('findById nu a găsit pacientul, încercăm cu findOne');
            patient = await Patient.findOne({ _id: patientId });
        }
        
        if (!patient) {
            console.log('findOne nu a găsit pacientul, interogăm direct colecția');
            patient = await mongoose.connection.db.collection('patients').findOne({ _id: patientId });
        }
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        console.log('Pacient găsit:', patient);
        
        // Verifică dacă pacientul are un doctor_id
        if (!patient.doctor_id) {
            return res.status(404).json({ error: 'Patient has no assigned doctor' });
        }
        
        // Obține toți doctorii din baza de date
        const Doctor = require('../models/Doctor');
        const allDoctors = await mongoose.connection.db.collection('doctors').find().toArray();
        
        console.log(`Găsit ${allDoctors.length} doctori în total`);
        if (allDoctors.length > 0) {
            console.log('ID-uri doctori disponibili:', allDoctors.map(d => d._id));
        }
        
        // Caută doctorul cu ID-ul corespunzător
        const patientDoctorId = patient.doctor_id;
        console.log('Căutăm doctorul cu ID-ul:', patientDoctorId);
        
        let matchedDoctor = null;
        
        // Parcurge lista de doctori și găsește potrivirea
        for (const doc of allDoctors) {
            console.log(`Comparăm ${doc._id} cu ${patientDoctorId}`);
            
            // Verifică potrivirea exactă a string-urilor
            if (doc._id.toString() === patientDoctorId.toString()) {
                console.log('Găsit doctor potrivit!');
                matchedDoctor = doc;
                break;
            }
        }
        
        if (!matchedDoctor) {
            console.log('Nu am găsit doctorul, verifică ID-urile și tipurile lor');
            console.log('Tipul ID-ului pacientului:', typeof patientDoctorId);
            
            // Încearcă o potrivire aproximativă
            matchedDoctor = allDoctors.find(d => 
                d._id.toString().includes(patientDoctorId) || 
                patientDoctorId.includes(d._id.toString())
            );
            
            if (matchedDoctor) {
                console.log('Am găsit o potrivire aproximativă:', matchedDoctor._id);
            }
        }
        
        if (!matchedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        // Returnează doctorul găsit
        res.status(200).json(matchedDoctor);
    } catch (err) {
        console.error('Error in getPatientDoctor:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/patient/email?email=example@gmail.com => un pacient
exports.getPatientByEmailQuery = async (req, res) => {
    try {
        const email = req.query.email;
        console.log(`Căutăm pacient cu emailul (din query): ${email}`);
        
        // Verifică dacă email-ul este furnizat
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }
        
        const Patient = require('../models/Patient'); // Asigură-te că modelul este importat
        const patient = await Patient.findOne({ email: email });
        
        if (!patient) {
            console.log(`Nu s-a găsit niciun pacient cu emailul: ${email}`);
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        console.log(`Pacient găsit:`, patient);
        res.json(patient);
    } catch (err) {
        console.error('Error in getPatientByEmailQuery:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};



// POST /api/patient/ => adaugă un nou pacient
// POST /api/patient/ => adaugă un nou pacient
exports.createPatient = async (req, res) => {
    try {
        console.log('Încercăm să creăm un nou pacient cu datele:', req.body);
        
        // Verificăm dacă req.body este gol sau undefined
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Body-ul cererii este gol sau invalid');
            return res.status(400).json({ error: 'Date lipsă. Te rugăm să furnizezi datele pacientului.' });
        }
        
        // Verificăm dacă conține câmpurile obligatorii
        if (!req.body.first_name || !req.body.last_name) {
            console.error('Lipsesc câmpuri obligatorii');
            return res.status(400).json({ error: 'first_name și last_name sunt obligatorii' });
        }
        
        // Eliminăm _id dacă există, pentru a lăsa MongoDB să genereze unul automat
        const patientData = { ...req.body };
        if (patientData._id) {
            delete patientData._id;
        }
        
        // Creăm un nou obiect Patient
        const newPatient = new Patient(patientData);
        console.log('Obiect pacient creat:', newPatient);
        
        // Salvăm pacientul în baza de date
        try {
            const saved = await newPatient.save();
            console.log('Pacient salvat cu succes:', saved);
            return res.status(201).json(saved);
        } catch (saveError) {
            console.error('Eroare la salvare:', saveError);
            if (saveError.name === 'ValidationError') {
                return res.status(400).json({ error: 'Eroare de validare', details: saveError.message });
            } else {
                return res.status(500).json({ error: 'Eroare la salvarea pacientului', details: saveError.message });
            }
        }
    } catch (err) {
        console.error('Error in createPatient:', err);
        
        // Afișăm mai multe detalii despre eroare
        if (err.name === 'ValidationError') {
            const validationErrors = {};
            Object.keys(err.errors).forEach(key => {
                validationErrors[key] = err.errors[key].message;
                console.error(`Eroare validare: ${key}:`, err.errors[key].message);
            });
            return res.status(400).json({ error: 'Eroare de validare', details: validationErrors });
        }
        
        res.status(500).json({ error: 'Eroare server', details: err.message });
    }
};

// PUT /api/patient/:id => modifică pacientul
exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        console.log('Încercăm să actualizăm pacientul cu ID:', patientId);
        console.log('Date primite:', req.body);
        
        // Verifică dacă ID-ul este valid
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            return res.status(400).json({ error: 'Invalid patient ID format' });
        }
        
        // Restul codului rămâne neschimbat
        // Încearcă diferite metode de actualizare
        let updated = null;
        
        try {
            // Metoda 1: folosind findByIdAndUpdate standard
            updated = await Patient.findByIdAndUpdate(patientId, req.body, { new: true });
        } catch (err) {
            console.log('Eroare la prima încercare:', err.message);
            
            // Metoda 2: folosind findOneAndUpdate
            updated = await Patient.findOneAndUpdate({ _id: patientId }, req.body, { new: true });
        }
        
        console.log('Rezultat actualizare:', updated);
        
        if (!updated) return res.status(404).json({ error: 'Patient not found' });
        res.json(updated);
    } catch (err) {
        console.error('Error in updatePatient:', err);
        res.status(500).json({ error: err.message });
    }
};

/*// DELETE /api/patient/:id => șterge pacient
exports.deletePatient = async (req, res) => {
    try {
        const deleted = await Patient.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Patient not found' });
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        console.error('Error in deletePatient:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};*/
