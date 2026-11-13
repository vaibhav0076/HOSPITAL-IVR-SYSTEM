
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");
const LabReport = require("../models/LabReport");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all patients
// @route GET /api/patients
const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: patients.length,
        patients
    });
});

// @desc Get single patient
// @route GET /api/patients/:id
const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found");
    }

    res.status(200).json({
        success: true,
        patient
    });
});

// @desc Register a new patient
// @route POST /api/patients
const createPatient = asyncHandler(async (req, res) => {
    const {
        name,
        phone,
        email,
        age,
        gender,
        address,
        bloodGroup
    } = req.body;

    if (!name || !phone) {
        res.status(400);
        throw new Error("Patient name and phone number are required");
    }

    const normalizedPhone = phone.trim();

    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
        res.status(400);
        throw new Error("Please provide a valid phone number");
    }

    if (age !== undefined && age !== null && age !== "") {
        const patientAge = Number(age);

        if (!Number.isInteger(patientAge) || patientAge < 0 || patientAge > 120) {
            res.status(400);
            throw new Error("Please provide a valid patient age");
        }
    }

    const existingPatient = await Patient.findOne({
        phone: normalizedPhone
    });

    if (existingPatient) {
        res.status(400);
        throw new Error("Patient with this phone number already exists");
    }

    const patient = await Patient.create({
        name: name.trim(),
        phone: normalizedPhone,
        email,
        age,
        gender,
        address,
        bloodGroup
    });

    res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        patient
    });
});

// @desc Update patient details
// @route PUT /api/patients/:id
const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found");
    }

    if (req.body.phone !== undefined) {
        const normalizedPhone = req.body.phone.trim();

        if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
            res.status(400);
            throw new Error("Please provide a valid phone number");
        }

        const existingPatient = await Patient.findOne({
            phone: normalizedPhone,
            _id: { $ne: patient._id }
        });

        if (existingPatient) {
            res.status(400);
            throw new Error("Another patient already uses this phone number");
        }
    }

    if (req.body.age !== undefined && req.body.age !== null && req.body.age !== "") {
        const patientAge = Number(req.body.age);

        if (!Number.isInteger(patientAge) || patientAge < 0 || patientAge > 120) {
            res.status(400);
            throw new Error("Please provide a valid patient age");
        }

        patient.age = patientAge;
    }

    const allowedFields = [
        "name",
        "phone",
        "email",
        "gender",
        "address",
        "bloodGroup",
        "isActive"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            patient[field] =
                typeof req.body[field] === "string"
                    ? req.body[field].trim()
                    : req.body[field];
        }
    });

    const updatedPatient = await patient.save();

    res.status(200).json({
        success: true,
        message: "Patient details updated successfully",
        patient: updatedPatient
    });
});

// @desc Delete patient
// @route DELETE /api/patients/:id
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found");
    }

    const [hasAppointments, hasBills, hasReports] = await Promise.all([
        Appointment.exists({ patient: patient._id }),
        Billing.exists({ patient: patient._id }),
        LabReport.exists({ patient: patient._id })
    ]);

    if (hasAppointments || hasBills || hasReports) {
        res.status(400);
        throw new Error(
            "Cannot delete patient because medical or billing records are associated with them"
        );
    }

    await patient.deleteOne();

    res.status(200).json({
        success: true,
        message: "Patient deleted successfully"
    });
});

// @desc Find patient using phone number
// @route GET /api/patients/phone/:phone
const getPatientByPhone = asyncHandler(async (req, res) => {
    const patient = await Patient.findOne({
        phone: req.params.phone.trim()
    });

    if (!patient) {
        res.status(404);
        throw new Error("Patient not found with this phone number");
    }

    res.status(200).json({
        success: true,
        patient
    });
});

module.exports = {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByPhone
};
