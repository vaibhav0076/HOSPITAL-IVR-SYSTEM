
const express = require("express");

const router = express.Router();

const {
    getAllBills,
    getBillById,
    createBill,
    updatePayment,
    getPatientBills,
    getBillingStats
} = require("../controllers/billingController");

const { protect } = require("../middleware/authMiddleware");

// Protect all billing routes
router.use(protect);

// Get all bills
router.get("/", getAllBills);

// Get billing statistics
router.get("/stats", getBillingStats);

// Get bills of a particular patient
router.get("/patient/:patientId", getPatientBills);

// Create a new invoice
router.post("/", createBill);

// Update payment details
router.put("/:id/payment", updatePayment);

// Get a particular bill
router.get("/:id", getBillById);

module.exports = router;
