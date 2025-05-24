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


 /*// GET /api/patient/:id => un pacient
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        console.error('Error in getPatientById:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/patient/ => adaugă un nou pacient
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const saved = await newPatient.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('Error in createPatient:', err);
        res.status(400).json({ error: err.message });
    }
};
*/
// PUT /api/patient/:id => modifică pacientul
exports.updatePatient = async (req, res) => {
    try {
        
        const patientId = req.params.id;
        console.log('Încercăm să actualizăm pacientul cu ID:', patientId);
        console.log('Date primite:', req.body);
        
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
