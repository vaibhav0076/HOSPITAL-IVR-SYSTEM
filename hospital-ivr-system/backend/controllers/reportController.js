
const LabReport = require("../models/LabReport");
const Patient = require("../models/Patient");
const asyncHandler = require("../utils/asyncHandler");

// Validate an optional date
const validateReportDate = (value, fieldName) => {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid ${fieldName}`);
    }

    return date;
};

// @desc Get all laboratory reports
// @route GET /api/reports
const getAllReports = asyncHandler(async (req, res) => {
    const reports = await LabReport.find()
        .populate("patient", "name phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        reports
    });
});

// @desc Get a single laboratory report
// @route GET /api/reports/:id
const getReportById = asyncHandler(async (req, res) => {
    const report = await LabReport.findById(req.params.id)
        .populate("patient", "name phone");

    if (!report) {
        res.status(404);
        throw new Error("Laboratory report not found");
    }

    res.status(200).json({
        success: true,
        report
    });
});

// @desc Create a new laboratory report
// @route POST /api/reports
const createReport = asyncHandler(async (req, res) => {
    const {
        patient,
        reportName,
        reportType,
        reportFile,
        testDate,
        resultDate,
        status,
        description,
        notes
    } = req.body;

    if (!patient || !reportName || !reportType) {
        res.status(400);
        throw new Error("Patient, report name and report type are required");
    }

    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
        res.status(404);
        throw new Error("Patient not found");
    }

    const validatedTestDate = validateReportDate(
        testDate,
        "test date"
    );

    const validatedResultDate = validateReportDate(
        resultDate,
        "result date"
    );

    if (
        validatedTestDate &&
        validatedResultDate &&
        validatedResultDate < validatedTestDate
    ) {
        res.status(400);
        throw new Error("Result date cannot be before test date");
    }

    const report = await LabReport.create({
        patient,
        reportName,
        reportType,
        reportFile,
        testDate: validatedTestDate,
        resultDate: validatedResultDate,
        status,
        description,
        notes
    });

    res.status(201).json({
        success: true,
        message: "Laboratory report created successfully",
        report
    });
});

// @desc Update laboratory report
// @route PUT /api/reports/:id
const updateReport = asyncHandler(async (req, res) => {
    const report = await LabReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error("Laboratory report not found");
    }

    const allowedFields = [
        "reportName",
        "reportType",
        "reportFile",
        "testDate",
        "resultDate",
        "status",
        "description",
        "notes"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            report[field] = req.body[field];
        }
    });

    if (req.body.testDate !== undefined) {
        report.testDate = validateReportDate(
            req.body.testDate,
            "test date"
        );
    }

    if (req.body.resultDate !== undefined) {
        report.resultDate = validateReportDate(
            req.body.resultDate,
            "result date"
        );
    }

    if (
        report.testDate &&
        report.resultDate &&
        report.resultDate < report.testDate
    ) {
        res.status(400);
        throw new Error("Result date cannot be before test date");
    }

    const updatedReport = await report.save();

    res.status(200).json({
        success: true,
        message: "Laboratory report updated successfully",
        report: updatedReport
    });
});

// @desc Delete laboratory report
// @route DELETE /api/reports/:id
const deleteReport = asyncHandler(async (req, res) => {
    const report = await LabReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error("Laboratory report not found");
    }

    await report.deleteOne();

    res.status(200).json({
        success: true,
        message: "Laboratory report deleted successfully"
    });
});

// @desc Get all reports of a particular patient
// @route GET /api/reports/patient/:patientId
const getPatientReports = asyncHandler(async (req, res) => {
    const patientExists = await Patient.findById(
        req.params.patientId
    );

    if (!patientExists) {
        res.status(404);
        throw new Error("Patient not found");
    }

    const reports = await LabReport.find({
        patient: req.params.patientId
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: reports.length,
        reports
    });
});

module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
    getPatientReports
};
