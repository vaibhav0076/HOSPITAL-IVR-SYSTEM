
const mongoose = require("mongoose");

// Define Patient Schema
const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: null
        },

        age: {
            type: Number,
            min: 0,
            max: 120
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Other"
        },

        address: {
            type: String,
            trim: true
        },

        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-"
            ]
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Create Patient Model
const Patient = mongoose.model("Patient", patientSchema);

// Export Patient Model
module.exports = Patient;
