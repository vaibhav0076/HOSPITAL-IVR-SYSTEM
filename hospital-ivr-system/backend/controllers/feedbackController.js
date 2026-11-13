
const Feedback = require("../models/Feedback");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all feedback
// @route GET /api/feedback
const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find()
        .populate("patient", "name phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: feedback.length,
        feedback
    });
});

// @desc Get feedback by ID
// @route GET /api/feedback/:id
const getFeedbackById = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)
        .populate("patient", "name phone");

    if (!feedback) {
        res.status(404);
        throw new Error("Feedback not found");
    }

    res.status(200).json({
        success: true,
        feedback
    });
});

// @desc Create feedback
// @route POST /api/feedback
const createFeedback = asyncHandler(async (req, res) => {
    const { patient, rating, comments, category } = req.body;

    if (!patient || rating === undefined) {
        res.status(400);
        throw new Error("Patient and rating are required");
    }

    const feedback = await Feedback.create({
        patient,
        rating,
        comments,
        category
    });

    res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
        feedback
    });
});

// @desc Delete feedback
// @route DELETE /api/feedback/:id
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error("Feedback not found");
    }

    await feedback.deleteOne();

    res.status(200).json({
        success: true,
        message: "Feedback deleted successfully"
    });
});

module.exports = {
    getAllFeedback,
    getFeedbackById,
    createFeedback,
    deleteFeedback
};

