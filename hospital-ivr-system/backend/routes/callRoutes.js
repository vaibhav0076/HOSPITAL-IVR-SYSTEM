
const express = require("express");

const router = express.Router();

const {
    getCallLogs,
    getCallById,
    createCallLog,
    updateCallLog,
    getPatientCallLogs,
    getActiveSessions,
    getSessionById,
    getCallStats
} = require("../controllers/callController");

const { protect } = require("../middleware/authMiddleware");

// Protect all call management routes
router.use(protect);

// Get all call logs
router.get("/", getCallLogs);

// Get call statistics
router.get("/stats", getCallStats);

// Get all active IVR sessions
router.get("/sessions/active", getActiveSessions);

// Get a particular IVR session
router.get("/sessions/:id", getSessionById);

// Get calls for a particular patient
router.get("/patient/:patientId", getPatientCallLogs);

// Create a call log
router.post("/", createCallLog);

// Update a call log
router.put("/:id", updateCallLog);

// Get a particular call
router.get("/:id", getCallById);

module.exports = router;
