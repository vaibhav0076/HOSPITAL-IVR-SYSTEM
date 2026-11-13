
const twilioClient = require("../config/twilio");

// Send an SMS notification
const sendSMS = async (phoneNumber, message) => {
    if (!phoneNumber || !message) {
        throw new Error("Phone number and message are required");
    }

    if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn(
            "SMS not sent: Twilio is not configured yet."
        );

        return {
            success: false,
            message: "SMS service is not configured yet."
        };
    }

    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        return {
            success: true,
            message: "SMS sent successfully",
            messageSid: result.sid
        };
    } catch (error) {
        console.error("SMS sending failed:", error.message);

        return {
            success: false,
            message: "Unable to send SMS",
            error: error.message
        };
    }
};

// Send appointment booking confirmation
const sendAppointmentConfirmation = async (patient, appointment) => {
    if (!patient || !appointment) {
        throw new Error("Patient and appointment details are required");
    }

    const message =
        `Hello ${patient.name}, your hospital appointment has been booked successfully. ` +
        `Appointment ID: ${appointment.appointmentId}. ` +
        `Date: ${new Date(appointment.appointmentDate).toLocaleDateString("en-IN")}. ` +
        `Time: ${appointment.appointmentTime}. Thank you.`;

    return sendSMS(patient.phone, message);
};

// Send appointment cancellation notification
const sendAppointmentCancellation = async (patient, appointment) => {
    if (!patient || !appointment) {
        throw new Error("Patient and appointment details are required");
    }

    const message =
        `Hello ${patient.name}, your appointment ${appointment.appointmentId} ` +
        `has been cancelled. Please contact the hospital for assistance.`;

    return sendSMS(patient.phone, message);
};

// Send appointment rescheduling notification
const sendAppointmentRescheduled = async (patient, appointment) => {
    if (!patient || !appointment) {
        throw new Error("Patient and appointment details are required");
    }

    const message =
        `Hello ${patient.name}, your appointment ${appointment.appointmentId} ` +
        `has been rescheduled to ${new Date(appointment.appointmentDate).toLocaleDateString("en-IN")} ` +
        `at ${appointment.appointmentTime}. Thank you.`;

    return sendSMS(patient.phone, message);
};

module.exports = {
    sendSMS,
    sendAppointmentConfirmation,
    sendAppointmentCancellation,
    sendAppointmentRescheduled
};
