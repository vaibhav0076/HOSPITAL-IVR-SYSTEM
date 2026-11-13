
const mongoose = require("mongoose");

// Define Billing Schema
const billingSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Partially Paid", "Paid", "Refunded"],
            default: "Pending"
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "Card", "UPI", "Online", "Other"],
            default: "Other"
        },

        paymentDate: {
            type: Date,
            default: null
        },

        dueDate: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// Create Billing Model
const Billing = mongoose.model("Billing", billingSchema);

// Export Billing Model
module.exports = Billing;
