
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

const {
    checkDoctorAvailability,
    bookAppointment
} = require("../services/appointmentService");

// @desc Get all appointments
// @route GET /api/appointments
const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
        .populate("patient", "name phone")
        .populate("doctor", "name specialization")
        .populate("department", "name")
        .sort({ appointmentDate: 1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments
    });
});

// @desc Get single appointment
// @route GET /api/appointments/:id
const getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate("patient", "name phone")
        .populate("doctor", "name specialization")
        .populate("department", "name");

    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    res.status(200).json({
        success: true,
        appointment
    });
});

// @desc Book a new appointment
// @route POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
    const {
        patient,
        doctor,
        department,
        appointmentDate,
        appointmentTime,
        reason,
        bookingSource
    } = req.body;

    if (
        !patient ||
        !doctor ||
        !department ||
        !appointmentDate ||
        !appointmentTime
    ) {
        res.status(400);
        throw new Error("Please provide all required appointment details");
    }

    const appointment = await bookAppointment({
        patient,
        doctor,
        department,
        appointmentDate,
        appointmentTime,
        reason,
        bookingSource: bookingSource || "Admin"
    });

    res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment
    });
});

// @desc Cancel appointment
// @route PATCH /api/appointments/:id/cancel
const cancelAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    if (["Cancelled", "Completed"].includes(appointment.status)) {
        res.status(400);
        throw new Error("This appointment cannot be cancelled");
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
        appointment
    });
});

// @desc Reschedule appointment
// @route PATCH /api/appointments/:id/reschedule
const rescheduleAppointment = asyncHandler(async (req, res) => {
    const { appointmentDate, appointmentTime } = req.body;

    if (!appointmentDate || !appointmentTime) {
        res.status(400);
        throw new Error("New appointment date and time are required");
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime)) {
        res.status(400);
        throw new Error("Invalid appointment time. Use HH:MM format");
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    if (["Cancelled", "Completed"].includes(appointment.status)) {
        res.status(400);
        throw new Error("This appointment cannot be rescheduled");
    }

    const newDate = new Date(appointmentDate);

    if (Number.isNaN(newDate.getTime())) {
        res.status(400);
        throw new Error("Invalid appointment date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requestedDate = new Date(newDate);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
        res.status(400);
        throw new Error("Cannot reschedule to a past date");
    }

    const isAvailable = await checkDoctorAvailability(
        appointment.doctor,
        newDate,
        appointmentTime,
        appointment._id
    );

    if (!isAvailable) {
        res.status(400);
        throw new Error("The requested appointment slot is already booked");
    }

    appointment.appointmentDate = newDate;
    appointment.appointmentTime = appointmentTime;
    appointment.status = "Rescheduled";

    await appointment.save();

    res.status(200).json({
        success: true,
        message: "Appointment rescheduled successfully",
        appointment
    });
});

// @desc Get appointments for a particular patient
// @route GET /api/appointments/patient/:patientId
const getPatientAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({
        patient: req.params.patientId
    })
        .populate("doctor", "name specialization")
        .populate("department", "name")
        .sort({ appointmentDate: -1 });

    res.status(200).json({
        success: true,
        count: appointments.length,
        appointments
    });
});

// @desc Update appointment status
// @route PATCH /api/appointments/:id/status
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Cancelled",
        "Completed",
        "Rescheduled"
    ];

    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error("Invalid appointment status");
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        res.status(404);
        throw new Error("Appointment not found");
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        appointment
    });
});

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getPatientAppointments,
    updateAppointmentStatus
};
