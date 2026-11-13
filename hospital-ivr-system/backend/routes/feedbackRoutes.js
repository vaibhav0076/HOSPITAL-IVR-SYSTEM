
const express = require("express");

const router = express.Router();

const {
    getAllFeedback,
    getFeedbackById,
    createFeedback,
    deleteFeedback
} = require("../controllers/feedbackController");

const { protect } = require("../middleware/authMiddleware");

// Protect all feedback routes
router.use(protect);

// Get all feedback
router.get("/", getAllFeedback);

// Submit feedback
router.post("/", createFeedback);

// Get particular feedback
router.get("/:id", getFeedbackById);

// Delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;
