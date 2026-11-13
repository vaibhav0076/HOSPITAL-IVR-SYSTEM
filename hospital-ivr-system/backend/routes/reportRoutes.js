
const express = require("express");

const router = express.Router();

const {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
    getPatientReports
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

// Protect all report routes
router.use(protect);

// Get all laboratory reports
router.get("/", getAllReports);

// Get reports belonging to a patient
router.get("/patient/:patientId", getPatientReports);

// Create a new laboratory report
router.post("/", createReport);

// Get a particular report
router.get("/:id", getReportById);

// Update a report
router.put("/:id", updateReport);

// Delete a report
router.delete("/:id", deleteReport);

module.exports = router;
