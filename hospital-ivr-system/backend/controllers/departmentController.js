
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all departments
// @route GET /api/departments
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find()
        .populate("headOfDepartment", "name specialization");

    res.status(200).json({
        success: true,
        count: departments.length,
        departments
    });
});

// @desc Get single department
// @route GET /api/departments/:id
const getDepartmentById = asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id)
        .populate("headOfDepartment", "name specialization");

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    res.status(200).json({
        success: true,
        department
    });
});

// @desc Create department
// @route POST /api/departments
const createDepartment = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        headOfDepartment,
        contactNumber,
        location
    } = req.body;

    if (!name || !name.trim()) {
        res.status(400);
        throw new Error("Department name is required");
    }

    const trimmedName = name.trim();

    const existingDepartment = await Department.findOne({
        name: { $regex: `^${trimmedName}$`, $options: "i" }
    });

    if (existingDepartment) {
        res.status(400);
        throw new Error("Department already exists");
    }

    if (headOfDepartment) {
        const doctor = await Doctor.findById(headOfDepartment);

        if (!doctor) {
            res.status(404);
            throw new Error("Head of department doctor not found");
        }

        if (!doctor.department) {
            res.status(400);
            throw new Error("Doctor is not assigned to a department");
        }
    }

    const department = await Department.create({
        name: trimmedName,
        description,
        headOfDepartment: headOfDepartment || null,
        contactNumber,
        location
    });

    res.status(201).json({
        success: true,
        message: "Department created successfully",
        department
    });
});

// @desc Update department
// @route PUT /api/departments/:id
const updateDepartment = asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    const allowedFields = [
        "name",
        "description",
        "headOfDepartment",
        "contactNumber",
        "location",
        "isActive"
    ];

    if (req.body.headOfDepartment) {
        const doctor = await Doctor.findById(
            req.body.headOfDepartment
        );

        if (!doctor) {
            res.status(404);
            throw new Error("Head of department doctor not found");
        }

        if (
            doctor.department &&
            doctor.department.toString() !== department._id.toString()
        ) {
            res.status(400);
            throw new Error(
                "Head of department doctor must belong to this department"
            );
        }
    }

    if (req.body.name !== undefined) {
        if (!req.body.name.trim()) {
            res.status(400);
            throw new Error("Department name cannot be empty");
        }

        const existingDepartment = await Department.findOne({
            name: {
                $regex: `^${req.body.name.trim()}$`,
                $options: "i"
            },
            _id: { $ne: department._id }
        });

        if (existingDepartment) {
            res.status(400);
            throw new Error("Another department already uses this name");
        }
    }

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            department[field] =
                field === "name"
                    ? req.body[field].trim()
                    : req.body[field];
        }
    });

    const updatedDepartment = await department.save();

    res.status(200).json({
        success: true,
        message: "Department updated successfully",
        department: updatedDepartment
    });
});

// @desc Delete department
// @route DELETE /api/departments/:id
const deleteDepartment = asyncHandler(async (req, res) => {
    const department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    // Prevent deletion if doctors are assigned
    const assignedDoctors = await Doctor.exists({
        department: department._id
    });

    if (assignedDoctors) {
        res.status(400);
        throw new Error(
            "Cannot delete department because doctors are assigned to it"
        );
    }

    await department.deleteOne();

    res.status(200).json({
        success: true,
        message: "Department deleted successfully"
    });
});

module.exports = {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
