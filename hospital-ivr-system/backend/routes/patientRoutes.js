
const express = require("express");

const router = express.Router();

const {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByPhone
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");

// Protect all patient routes
router.use(protect);

// Get all patients
router.get("/", getPatients);

// Register a new patient
router.post("/", createPatient);

// Search patient using phone number
router.get("/phone/:phone", getPatientByPhone);

// Get a particular patient
router.get("/:id", getPatientById);

// Update patient details
router.put("/:id", updatePatient);

// Delete patient
router.delete("/:id", deletePatient);

module.exports = router;
