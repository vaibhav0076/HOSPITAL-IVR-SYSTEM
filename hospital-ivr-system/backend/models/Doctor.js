
const mongoose = require("mongoose");

// Define Doctor Schema
const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        specialization: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        qualification: {
            type: String,
            trim: true
        },

        experience: {
            type: Number,
            min: 0,
            default: 0
        },

        consultationFee: {
            type: Number,
            required: true,
            min: 0
        },

        availability: {
            type: String,
            enum: ["Available", "Unavailable"],
            default: "Available"
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

// Create Doctor Model
const Doctor = mongoose.model("Doctor", doctorSchema);

// Export Doctor Model
module.exports = Doctor;
