
const express = require("express");

const router = express.Router();

const {
    getIVRConfiguration,
    createIVRConfiguration,
    updateIVRConfiguration,
    updateIVRStatus
} = require("../controllers/ivrController");

const { protect } = require("../middleware/authMiddleware");

// Protect all IVR configuration routes
router.use(protect);

// Get current IVR configuration
router.get("/config", getIVRConfiguration);

// Create initial IVR configuration
router.post("/config", createIVRConfiguration);

// Update IVR configuration
router.put("/config", updateIVRConfiguration);

// Activate or deactivate IVR
router.patch("/status", updateIVRStatus);

module.exports = router;
