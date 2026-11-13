
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all doctors
// @route GET /api/doctors
const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find()
        .populate("department", "name")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: doctors.length,
        doctors
    });
});

// @desc Get single doctor
// @route GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
        .populate("department", "name");

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    res.status(200).json({
        success: true,
        doctor
    });
});

// @desc Create a new doctor
// @route POST /api/doctors
const createDoctor = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        phone,
        specialization,
        department,
        qualification,
        experience,
        consultationFee,
        availability
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !specialization ||
        !department ||
        consultationFee === undefined
    ) {
        res.status(400);
        throw new Error("Please provide all required doctor details");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingDoctor = await Doctor.findOne({
        email: normalizedEmail
    });

    if (existingDoctor) {
        res.status(400);
        throw new Error("Doctor with this email already exists");
    }

    const fee = Number(consultationFee);
    const years = Number(experience ?? 0);

    if (!Number.isFinite(fee) || fee < 0) {
        res.status(400);
        throw new Error("Consultation fee must be a valid non-negative amount");
    }

    if (!Number.isInteger(years) || years < 0) {
        res.status(400);
        throw new Error("Experience must be a non-negative whole number");
    }

    const departmentExists = await Department.findById(department);

    if (!departmentExists || !departmentExists.isActive) {
        res.status(404);
        throw new Error("Department not found or inactive");
    }

    const doctor = await Doctor.create({
        name,
        email: normalizedEmail,
        phone,
        specialization,
        department,
        qualification,
        experience: years,
        consultationFee: fee,
        availability
    });

    res.status(201).json({
        success: true,
        message: "Doctor added successfully",
        doctor
    });
});

// @desc Update doctor details
// @route PUT /api/doctors/:id
const updateDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    if (req.body.email !== undefined) {
        if (!req.body.email.trim()) {
            res.status(400);
            throw new Error("Doctor email cannot be empty");
        }

        const normalizedEmail = req.body.email.toLowerCase().trim();

        const existingDoctor = await Doctor.findOne({
            email: normalizedEmail,
            _id: { $ne: doctor._id }
        });

        if (existingDoctor) {
            res.status(400);
            throw new Error("Another doctor already uses this email");
        }
    }

    if (req.body.department !== undefined) {
        const departmentExists = await Department.findById(
            req.body.department
        );

        if (!departmentExists || !departmentExists.isActive) {
            res.status(404);
            throw new Error("Department not found or inactive");
        }
    }

    if (req.body.consultationFee !== undefined) {
        const fee = Number(req.body.consultationFee);

        if (!Number.isFinite(fee) || fee < 0) {
            res.status(400);
            throw new Error("Invalid consultation fee");
        }

        doctor.consultationFee = fee;
    }

    if (req.body.experience !== undefined) {
        const years = Number(req.body.experience);

        if (!Number.isInteger(years) || years < 0) {
            res.status(400);
            throw new Error("Experience must be a non-negative whole number");
        }

        doctor.experience = years;
    }

    const allowedFields = [
        "name",
        "email",
        "phone",
        "specialization",
        "department",
        "qualification",
        "availability",
        "isActive"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            doctor[field] =
                field === "email"
                    ? req.body[field].toLowerCase().trim()
                    : req.body[field];
        }
    });

    const updatedDoctor = await doctor.save();

    res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        doctor: updatedDoctor
    });
});

// @desc Delete doctor
// @route DELETE /api/doctors/:id
const deleteDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        res.status(404);
        throw new Error("Doctor not found");
    }

    const assignedAppointments = await Appointment.exists({
        doctor: doctor._id,
        status: {
            $in: ["Pending", "Confirmed", "Rescheduled"]
        }
    });

    if (assignedAppointments) {
        res.status(400);
        throw new Error(
            "Cannot delete doctor because active appointments are assigned to them"
        );
    }

    await doctor.deleteOne();

    res.status(200).json({
        success: true,
        message: "Doctor deleted successfully"
    });
});

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
