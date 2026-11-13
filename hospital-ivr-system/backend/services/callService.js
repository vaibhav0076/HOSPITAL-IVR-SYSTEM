
const CallLog = require("../models/CallLog");
const CallSession = require("../models/CallSession");
const generateId = require("../utils/generateId");

// Create a new call log
const createCallLog = async ({
    callSid,
    callerNumber,
    receiverNumber,
    patient = null,
    callType = "Incoming",
    language = "English",
    callPurpose = "Other"
}) => {
    if (!callerNumber) {
        throw new Error("Caller phone number is required");
    }

    const call = await CallLog.create({
        callSid,
        callerNumber,
        receiverNumber,
        patient,
        callType,
        callStatus: "In Progress",
        language,
        callPurpose,
        startTime: new Date()
    });

    return call;
};

// Start a new IVR session
const startCallSession = async ({
    callLog,
    callSid,
    callerNumber,
    language = "English"
}) => {
    if (!callLog) {
        throw new Error("Call log is required to start a session");
    }

    if (!callerNumber) {
        throw new Error("Caller phone number is required");
    }

    const session = await CallSession.create({
        sessionId: generateId("SES"),
        callLog,
        callSid,
        callerNumber,
        language,
        currentMenu: "LANGUAGE_SELECTION",
        sessionStatus: "Active",
        startedAt: new Date(),
        menuHistory: []
    });

    return session;
};

// Update current IVR menu
const updateCallMenu = async (sessionId, menuName) => {
    if (!sessionId || !menuName) {
        throw new Error("Session ID and menu name are required");
    }

    const session = await CallSession.findById(sessionId);

    if (!session) {
        throw new Error("Call session not found");
    }

    if (session.sessionStatus !== "Active") {
        throw new Error("Cannot update an inactive call session");
    }

    session.currentMenu = menuName;

    await session.save();

    return session;
};

// Record a keypad selection
const recordKeypadSelection = async (sessionId, selection) => {
    if (!sessionId || selection === undefined || selection === null) {
        throw new Error("Session ID and keypad selection are required");
    }

    const session = await CallSession.findById(sessionId);

    if (!session) {
        throw new Error("Call session not found");
    }

    if (session.sessionStatus !== "Active") {
        throw new Error("Cannot record input for an inactive session");
    }

    session.menuHistory.push({
        menu: session.currentMenu,
        option: String(selection),
        selectedAt: new Date()
    });

    session.selectedOption = String(selection);

    await session.save();

    return session;
};

// End an IVR call session
const endCallSession = async (sessionId, status = "Completed") => {
    const allowedStatuses = [
        "Completed",
        "Disconnected",
        "Transferred",
        "Failed"
    ];

    if (!sessionId) {
        throw new Error("Session ID is required");
    }

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid call session status");
    }

    const session = await CallSession.findById(sessionId);

    if (!session) {
        throw new Error("Call session not found");
    }

    if (session.sessionStatus !== "Active") {
        throw new Error("Call session has already ended");
    }

    const endTime = new Date();

    const duration = Math.max(
        0,
        Math.floor((endTime - session.startedAt) / 1000)
    );

    session.sessionStatus = status;
    session.endedAt = endTime;
    session.duration = duration;

    await session.save();

    // Update the associated call log
    if (session.callLog) {
        const call = await CallLog.findById(session.callLog);

        if (call) {
            call.callStatus = status;
            call.callDuration = duration;
            call.endTime = endTime;

            await call.save();
        }
    }

    return session;
};

module.exports = {
    createCallLog,
    startCallSession,
    updateCallMenu,
    recordKeypadSelection,
    endCallSession
};
