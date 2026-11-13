
const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// CORS configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173"
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hospital IVR API is running"
    });
});

// Authentication routes
app.use("/api/auth", require("./routes/authRoutes"));

// Doctor routes
app.use("/api/doctors", require("./routes/doctorRoutes"));

// Department routes
app.use("/api/departments", require("./routes/departmentRoutes"));

// Patient routes
app.use("/api/patients", require("./routes/patientRoutes"));

// Appointment routes
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Call management routes
app.use("/api/calls", require("./routes/callRoutes"));

// Billing routes
app.use("/api/billing", require("./routes/billingRoutes"));

// Laboratory report routes
app.use("/api/reports", require("./routes/reportRoutes"));

// IVR configuration routes
app.use("/api/ivr", require("./routes/ivrRoutes"));

// Feedback routes
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// Twilio voice webhook routes
app.use("/api/twilio", require("./routes/twilioRoutes"));

// Handle invalid routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
