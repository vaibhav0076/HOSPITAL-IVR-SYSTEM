
const mongoose = require("mongoose");

// Define LabReport Schema
const labReportSchema = new mongoose.Schema(
    {
        reportId: {
            type: String,
            required: true,
            unique: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        testName: {
            type: String,
            required: true,
            trim: true
        },

        testCategory: {
            type: String,
            trim: true
        },

        testDate: {
            type: Date,
            required: true
        },

        reportDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Completed", "Cancelled"],
            default: "Pending"
        },

        reportFile: {
            type: String,
            default: null
        },

        remarks: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Index for faster patient report searches
labReportSchema.index({ patient: 1, testDate: -1 });

// Create LabReport Model
const LabReport = mongoose.model("LabReport", labReportSchema);

// Export LabReport Model
module.exports = LabReport;
