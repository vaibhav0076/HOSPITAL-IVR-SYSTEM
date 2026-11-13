
const express = require("express");

const router = express.Router();

const {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");

const { protect } = require("../middleware/authMiddleware");

// Protect all doctor routes
router.use(protect);

// Get all doctors
router.get("/", getDoctors);

// Add a new doctor
router.post("/", createDoctor);

// Get a particular doctor
router.get("/:id", getDoctorById);

// Update doctor details
router.put("/:id", updateDoctor);

// Delete a doctor
router.delete("/:id", deleteDoctor);

module.exports = router;
