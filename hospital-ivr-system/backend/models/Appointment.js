
const mongoose = require("mongoose");

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: String,
            required: true,
            unique: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        appointmentDate: {
            type: Date,
            required: true
        },

        appointmentTime: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Cancelled",
                "Completed",
                "Rescheduled"
            ],
            default: "Pending"
        },

        bookingSource: {
            type: String,
            enum: ["IVR", "Admin", "Website"],
            default: "IVR"
        },

        consultationFee: {
            type: Number,
            min: 0,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for finding appointments by doctor and date
appointmentSchema.index({
    doctor: 1,
    appointmentDate: 1,
    appointmentTime: 1
});

// Create Appointment Model
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Export Appointment Model
module.exports = Appointment;
