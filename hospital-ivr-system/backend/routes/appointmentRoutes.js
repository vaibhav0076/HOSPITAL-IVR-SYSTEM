
const express = require("express");

const router = express.Router();

const {
    getAppointments,
    getAppointmentById,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getPatientAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

// Protect all appointment routes
router.use(protect);

// Get all appointments
router.get("/", getAppointments);

// Book a new appointment
router.post("/", createAppointment);

// Get appointments of a particular patient
router.get("/patient/:patientId", getPatientAppointments);

// Cancel an appointment
router.patch("/:id/cancel", cancelAppointment);

// Reschedule an appointment
router.patch("/:id/reschedule", rescheduleAppointment);

// Update appointment status
router.patch("/:id/status", updateAppointmentStatus);

// Get a particular appointment
router.get("/:id", getAppointmentById);

module.exports = router;
