const mongoose = require("mongoose");

// Define CallSession Schema
const callSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    callLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallLog",
      default: null,
    },

    callSid: {
      type: String,
      default: null,
    },

    callerNumber: {
      type: String,
      required: true,
      trim: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },

    language: {
      type: String,
      enum: ["English", "Hindi"],
      default: null,
    },

    currentMenu: {
      type: String,
      default: "LANGUAGE_SELECTION",
    },

    selectedOption: {
      type: String,
      default: null,
    },

    callPurpose: {
      type: String,
      default: null,
    },

    sessionStatus: {
      type: String,
      enum: ["Active", "Completed", "Disconnected", "Transferred", "Failed"],
      default: "Active",
    },

    menuHistory: [
      {
        menu: String,
        option: String,
        selectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically remove old sessions after 30 days
callSessionSchema.index(
  { startedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);

// Create CallSession Model
const CallSession = mongoose.model("CallSession", callSessionSchema);

// Export CallSession Model
module.exports = CallSession;
