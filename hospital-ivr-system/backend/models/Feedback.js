
const mongoose = require("mongoose");

// Define Feedback Schema
const feedbackSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            default: null
        },

        callLog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CallLog",
            default: null
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        category: {
            type: String,
            enum: [
                "Doctor",
                "Hospital Service",
                "Appointment",
                "IVR Experience",
                "Customer Support",
                "Other"
            ],
            default: "Other"
        },

        comments: {
            type: String,
            trim: true,
            default: ""
        },

        submittedThrough: {
            type: String,
            enum: ["IVR", "Website", "Admin"],
            default: "IVR"
        },

        status: {
            type: String,
            enum: ["New", "Reviewed", "Resolved"],
            default: "New"
        },

        adminResponse: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Index for faster feedback searches
feedbackSchema.index({ createdAt: -1, status: 1 });

// Create Feedback Model
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Export Feedback Model
module.exports = Feedback;
