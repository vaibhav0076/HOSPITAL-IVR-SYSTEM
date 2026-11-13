
const Billing = require("../models/Billing");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const generateId = require("../utils/generateId");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all billing records
// @route GET /api/billing
const getAllBills = asyncHandler(async (req, res) => {
    const bills = await Billing.find()
        .populate("patient", "name phone")
        .populate("appointment", "appointmentId appointmentDate")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bills.length,
        bills
    });
});

// @desc Get single bill
// @route GET /api/billing/:id
const getBillById = asyncHandler(async (req, res) => {
    const bill = await Billing.findById(req.params.id)
        .populate("patient", "name phone")
        .populate("appointment");

    if (!bill) {
        res.status(404);
        throw new Error("Billing record not found");
    }

    res.status(200).json({
        success: true,
        bill
    });
});

// @desc Create new bill
// @route POST /api/billing
const createBill = asyncHandler(async (req, res) => {
    const {
        patient,
        appointment,
        description,
        totalAmount,
        dueDate,
        notes
    } = req.body;

    if (
        !patient ||
        !description ||
        totalAmount === undefined
    ) {
        res.status(400);
        throw new Error("Please provide all required billing details");
    }

    const amount = Number(totalAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
        res.status(400);
        throw new Error("Total amount must be greater than zero");
    }

    // Validate due date
    let validatedDueDate = null;

    if (dueDate) {
        validatedDueDate = new Date(dueDate);

        if (Number.isNaN(validatedDueDate.getTime())) {
            res.status(400);
            throw new Error("Invalid due date");
        }
    }

    // Check patient
    const patientExists = await Patient.findById(patient);

    if (!patientExists) {
        res.status(404);
        throw new Error("Patient not found");
    }

    // Check appointment if provided
    if (appointment) {
        const appointmentExists = await Appointment.findById(appointment);

        if (!appointmentExists) {
            res.status(404);
            throw new Error("Appointment not found");
        }

        if (
            appointmentExists.patient.toString() !== patient.toString()
        ) {
            res.status(400);
            throw new Error("Appointment does not belong to this patient");
        }
    }

    // Create bill
    const bill = await Billing.create({
        invoiceNumber: generateId("INV"),
        patient,
        appointment: appointment || null,
        description,
        totalAmount: amount,
        paidAmount: 0,
        paymentStatus: "Pending",
        dueDate: validatedDueDate,
        notes
    });

    res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        bill
    });
});

// @desc Update payment details
// @route PUT /api/billing/:id/payment
const updatePayment = asyncHandler(async (req, res) => {
    const { paidAmount, paymentMethod } = req.body;

    const bill = await Billing.findById(req.params.id);

    if (!bill) {
        res.status(404);
        throw new Error("Billing record not found");
    }

    if (paidAmount === undefined) {
        res.status(400);
        throw new Error("Paid amount is required");
    }

    const amount = Number(paidAmount);

    if (!Number.isFinite(amount) || amount < 0) {
        res.status(400);
        throw new Error("Invalid payment amount");
    }

    if (amount > bill.totalAmount) {
        res.status(400);
        throw new Error("Paid amount cannot exceed total amount");
    }

    const allowedMethods = [
        "Cash",
        "Card",
        "UPI",
        "Online",
        "Other"
    ];

    if (
        paymentMethod &&
        !allowedMethods.includes(paymentMethod)
    ) {
        res.status(400);
        throw new Error("Invalid payment method");
    }

    bill.paidAmount = amount;

    if (paymentMethod) {
        bill.paymentMethod = paymentMethod;
    }

    if (amount === bill.totalAmount) {
        bill.paymentStatus = "Paid";
        bill.paymentDate = new Date();
    } else if (amount > 0) {
        bill.paymentStatus = "Partially Paid";
        bill.paymentDate = new Date();
    } else {
        bill.paymentStatus = "Pending";
        bill.paymentDate = null;
    }

    const updatedBill = await bill.save();

    res.status(200).json({
        success: true,
        message: "Payment details updated successfully",
        bill: updatedBill
    });
});

// @desc Get bills for a patient
// @route GET /api/billing/patient/:patientId
const getPatientBills = asyncHandler(async (req, res) => {
    const bills = await Billing.find({
        patient: req.params.patientId
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: bills.length,
        bills
    });
});

// @desc Get billing statistics
// @route GET /api/billing/stats
const getBillingStats = asyncHandler(async (req, res) => {
    const totalBills = await Billing.countDocuments();

    const paidBills = await Billing.countDocuments({
        paymentStatus: "Paid"
    });

    const pendingBills = await Billing.countDocuments({
        paymentStatus: "Pending"
    });

    const partialBills = await Billing.countDocuments({
        paymentStatus: "Partially Paid"
    });

    const result = await Billing.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$paidAmount"
                },
                totalOutstanding: {
                    $sum: {
                        $subtract: ["$totalAmount", "$paidAmount"]
                    }
                }
            }
        }
    ]);

    const stats = result[0] || {
        totalRevenue: 0,
        totalOutstanding: 0
    };

    res.status(200).json({
        success: true,
        stats: {
            totalBills,
            paidBills,
            pendingBills,
            partialBills,
            totalRevenue: stats.totalRevenue,
            totalOutstanding: stats.totalOutstanding
        }
    });
});

module.exports = {
    getAllBills,
    getBillById,
    createBill,
    updatePayment,
    getPatientBills,
    getBillingStats
};
