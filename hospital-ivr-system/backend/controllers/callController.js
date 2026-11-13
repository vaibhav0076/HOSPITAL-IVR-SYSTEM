
const CallLog = require("../models/CallLog");
const CallSession = require("../models/CallSession");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all call logs
// @route GET /api/calls
const getCallLogs = asyncHandler(async (req, res) => {
    const calls = await CallLog.find()
        .populate("patient", "name phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: calls.length,
        calls
    });
});

// @desc Get single call log
// @route GET /api/calls/:id
const getCallById = asyncHandler(async (req, res) => {
    const call = await CallLog.findById(req.params.id)
        .populate("patient", "name phone");

    if (!call) {
        res.status(404);
        throw new Error("Call record not found");
    }

    res.status(200).json({
        success: true,
        call
    });
});

// @desc Create a new call log
// @route POST /api/calls
const createCallLog = asyncHandler(async (req, res) => {
    const {
        callSid,
        callerNumber,
        receiverNumber,
        patient,
        callType,
        callStatus,
        language,
        callPurpose,
        notes
    } = req.body;

    if (!callerNumber) {
        res.status(400);
        throw new Error("Caller phone number is required");
    }

    const call = await CallLog.create({
        callSid,
        callerNumber,
        receiverNumber,
        patient: patient || null,
        callType,
        callStatus,
        language,
        callPurpose,
        notes
    });

    res.status(201).json({
        success: true,
        message: "Call log created successfully",
        call
    });
});

// @desc Update call log
// @route PUT /api/calls/:id
const updateCallLog = asyncHandler(async (req, res) => {
    const call = await CallLog.findById(req.params.id);

    if (!call) {
        res.status(404);
        throw new Error("Call record not found");
    }

    if (req.body.callDuration !== undefined) {
        const duration = Number(req.body.callDuration);

        if (!Number.isFinite(duration) || duration < 0) {
            res.status(400);
            throw new Error("Call duration must be a valid non-negative number");
        }

        call.callDuration = duration;
    }

    const allowedFields = [
        "callStatus",
        "language",
        "callPurpose",
        "endTime",
        "notes"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            call[field] = req.body[field];
        }
    });

    const updatedCall = await call.save();

    res.status(200).json({
        success: true,
        message: "Call log updated successfully",
        call: updatedCall
    });
});

// @desc Get calls for a particular patient
// @route GET /api/calls/patient/:patientId
const getPatientCallLogs = asyncHandler(async (req, res) => {
    const calls = await CallLog.find({
        patient: req.params.patientId
    })
        .populate("patient", "name phone")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: calls.length,
        calls
    });
});

// @desc Get all active IVR sessions
// @route GET /api/calls/sessions/active
const getActiveSessions = asyncHandler(async (req, res) => {
    const sessions = await CallSession.find({
        sessionStatus: "Active"
    })
        .populate("patient", "name phone")
        .populate("callLog")
        .sort({ startedAt: -1 });

    res.status(200).json({
        success: true,
        count: sessions.length,
        sessions
    });
});

// @desc Get a particular IVR session
// @route GET /api/calls/sessions/:id
const getSessionById = asyncHandler(async (req, res) => {
    const session = await CallSession.findById(req.params.id)
        .populate("patient", "name phone")
        .populate("appointment")
        .populate("callLog");

    if (!session) {
        res.status(404);
        throw new Error("Call session not found");
    }

    res.status(200).json({
        success: true,
        session
    });
});

// @desc Get dashboard call statistics
// @route GET /api/calls/stats
const getCallStats = asyncHandler(async (req, res) => {
    const totalCalls = await CallLog.countDocuments();

    const completedCalls = await CallLog.countDocuments({
        callStatus: "Completed"
    });

    const missedCalls = await CallLog.countDocuments({
        callStatus: "Missed"
    });

    const activeSessions = await CallSession.countDocuments({
        sessionStatus: "Active"
    });

    res.status(200).json({
        success: true,
        stats: {
            totalCalls,
            completedCalls,
            missedCalls,
            activeSessions
        }
    });
});

module.exports = {
    getCallLogs,
    getCallById,
    createCallLog,
    updateCallLog,
    getPatientCallLogs,
    getActiveSessions,
    getSessionById,
    getCallStats
};
