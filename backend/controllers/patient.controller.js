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

// GET /api/patient/:id => un pacient
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

// PUT /api/patient/:id => modifică pacientul
exports.updatePatient = async (req, res) => {
    try {
        const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Patient not found' });
        res.json(updated);
    } catch (err) {
        console.error('Error in updatePatient:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /api/patient/:id => șterge pacient
exports.deletePatient = async (req, res) => {
    try {
        const deleted = await Patient.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Patient not found' });
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        console.error('Error in deletePatient:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
