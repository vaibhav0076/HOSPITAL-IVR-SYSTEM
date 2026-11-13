
const express = require("express");

const router = express.Router();

const {
    loginAdmin,
    getAdminProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Admin login
router.post("/login", loginAdmin);

// Get logged-in admin profile
router.get("/profile", protect, getAdminProfile);

module.exports = router;
