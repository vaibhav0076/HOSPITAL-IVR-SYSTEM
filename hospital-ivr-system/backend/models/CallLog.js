const mongoose = require("mongoose");

// Define CallLog Schema
const callLogSchema = new mongoose.Schema(
  {
    callSid: {
      type: String,
      unique: true,
      sparse: true,
    },

    callerNumber: {
      type: String,
      required: true,
      trim: true,
    },

    receiverNumber: {
      type: String,
      trim: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    callType: {
      type: String,
      enum: ["Incoming", "Outgoing"],
      default: "Incoming",
    },

    callStatus: {
      type: String,
      enum: [
        "Received",
        "In Progress",
        "Answered",
        "Missed",
        "Completed",
        "Failed",
        "Disconnected",
        "Transferred",
      ],
      default: "Received",
    },

    callDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    language: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English",
    },

    callPurpose: {
      type: String,
      enum: [
        "Appointment Booking",
        "Existing Appointment",
        "Department Enquiry",
        "Emergency",
        "Billing",
        "Lab Reports",
        "Customer Care",
        "Other",
      ],
      default: "Other",
    },

    startTime: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster call history searches
callLogSchema.index({ callerNumber: 1, createdAt: -1 });

// Create CallLog Model
const CallLog = mongoose.model("CallLog", callLogSchema);

// Export CallLog Model
module.exports = CallLog;
