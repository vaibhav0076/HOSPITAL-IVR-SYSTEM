
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const generateId = require("../utils/generateId");

// Check whether a doctor has an available appointment slot
const checkDoctorAvailability = async (
    doctorId,
    appointmentDate,
    appointmentTime,
    excludeAppointmentId = null
) => {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)
    ? new Date(
        Number(appointmentDate.split("-")[0]),
        Number(appointmentDate.split("-")[1]) - 1,
        Number(appointmentDate.split("-")[2])
      )
    : new Date(appointmentDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid appointment date");
    }

    // Match the entire calendar day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
        doctor: doctorId,
        appointmentDate: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        appointmentTime,
        status: { $in: ["Pending", "Confirmed" ,"Rescheduled"] }
    };

    if (excludeAppointmentId) {
        query._id = { $ne: excludeAppointmentId };
    }

    const existingAppointment = await Appointment.findOne(query);

    return !existingAppointment;
};

// Book an appointment
const bookAppointment = async ({
    patient,
    doctor,
    department,
    appointmentDate,
    appointmentTime,
    reason,
    bookingSource = "Admin"
}) => {
    if (
        !patient ||
        !doctor ||
        !department ||
        !appointmentDate ||
        !appointmentTime
    ) {
        throw new Error("Please provide all required appointment details");
    }

    // Validate appointment time format (HH:MM)
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime)) {
        throw new Error("Invalid appointment time. Use HH:MM format");
    }

    // Check patient
    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
        throw new Error("Patient not found");
    }

    // Check doctor
    const doctorExists = await Doctor.findById(doctor);

    if (!doctorExists || !doctorExists.isActive) {
        throw new Error("Doctor not found or inactive");
    }

    if (doctorExists.availability !== "Available") {
        throw new Error("Doctor is currently unavailable");
    }

    // Check department
    const departmentExists = await Department.findById(department);

    if (!departmentExists || !departmentExists.isActive) {
        throw new Error("Department not found or inactive");
    }

    // Verify doctor belongs to the selected department
    if (doctorExists.department.toString() !== department.toString()) {
        throw new Error("Doctor does not belong to this department");
    }

    // Validate appointment date
    const date = /^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)
    ? new Date(
        Number(appointmentDate.split("-")[0]),
        Number(appointmentDate.split("-")[1]) - 1,
        Number(appointmentDate.split("-")[2])
      )
    : new Date(appointmentDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid appointment date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
        throw new Error("Cannot book an appointment in the past");
    }

    // Check slot availability
    const isAvailable = await checkDoctorAvailability(
        doctor,
        date,
        appointmentTime
    );

    if (!isAvailable) {
        throw new Error("This appointment slot is already booked");
    }

    // Create appointment
    const appointment = await Appointment.create({
        appointmentId: generateId("APT"),
        patient,
        doctor,
        department,
        appointmentDate: date,
        appointmentTime,
        reason,
        bookingSource,
        consultationFee: doctorExists.consultationFee
    });

    return appointment;
};

module.exports = {
    checkDoctorAvailability,
    bookAppointment
};
