
const { randomUUID } = require("crypto");
const twilio = require("twilio");

const CallLog = require("../models/CallLog");
const CallSession = require("../models/CallSession");

const {
    getLanguageMenu,
    getMainMenu,
    processIVRInput
} = require("../services/ivrService");

const VoiceResponse = twilio.twiml.VoiceResponse;

// Build the URL Twilio will call when the caller presses a key
const getInputUrl = (req, sessionId) => {
    return `${req.protocol}://${req.get("host")}/api/twilio/input?sessionId=${sessionId}`;
};

// Create a Twilio response containing a keypad menu
const createMenuResponse = (req, sessionId, menu, language = "en-US") => {
    const response = new VoiceResponse();

    const gather = response.gather({
        input: "dtmf",
        numDigits: 1,
        action: getInputUrl(req, sessionId),
        method: "POST",
        timeout: 8
    });

    gather.say(
        { voice: "alice", language },
        menu.message
    );

    response.say(
        { voice: "alice", language },
        "We did not receive your selection. Goodbye."
    );

    response.hangup();

    return response;
};

// @desc Handle incoming Twilio call
// @route POST /api/twilio/incoming
const incomingCall = async (req, res) => {
    try {
        const callSid = req.body.CallSid;
        const callerNumber = req.body.From;
        const receiverNumber = req.body.To;

        if (!callSid || !callerNumber) {
            return res.status(400).send("Missing call information");
        }

        // Prevent duplicate records if Twilio retries the webhook
        let callLog = await CallLog.findOne({ callSid });

        if (!callLog) {
            callLog = await CallLog.create({
                callSid,
                callerNumber,
                receiverNumber,
                callType: "Incoming",
                callStatus: "In Progress",
                callPurpose: "Other"
            });
        }

        let session = await CallSession.findOne({ callSid });

        if (!session) {
            const languageMenu = await getLanguageMenu();

            session = await CallSession.create({
                sessionId: randomUUID(),
                callLog: callLog._id,
                callSid,
                callerNumber,
                currentMenu: languageMenu.currentMenu,
                sessionStatus: "Active"
            });
        }

        const menu = await getLanguageMenu();

        const response = createMenuResponse(
            req,
            session._id,
            menu
        );

        res.type("text/xml").send(response.toString());

    } catch (error) {
        console.error("Incoming call error:", error);

        const response = new VoiceResponse();
        response.say("Sorry, the hospital IVR system is unavailable.");
        response.hangup();

        res.type("text/xml").send(response.toString());
    }
};

// @desc Handle caller keypad input
// @route POST /api/twilio/input
const handleKeypadInput = async (req, res) => {
    try {
        const sessionId = req.query.sessionId;
        const selection = req.body.Digits;

        if (!sessionId || !selection) {
            const response = new VoiceResponse();
            response.say("Invalid input. Goodbye.");
            response.hangup();

            return res.type("text/xml").send(response.toString());
        }

        const result = await processIVRInput(
            sessionId,
            selection
        );

        const response = new VoiceResponse();

        if (!result.success) {
            response.say(result.message || "Invalid selection.");
        }

        if (result.action === "END_CALL") {
            response.say(result.message);
            response.hangup();

            return res.type("text/xml").send(response.toString());
        }

        if (result.action === "REPEAT_MENU") {
            const menu = await getMainMenu(
                result.language || "English"
            );

            const menuResponse = createMenuResponse(
                req,
                sessionId,
                menu
            );

            return res.type("text/xml").send(menuResponse.toString());
        }

        const session = await CallSession.findById(sessionId);

        if (!session) {
            response.say("Call session not found.");
            response.hangup();

            return res.type("text/xml").send(response.toString());
        }

        let menu;

        if (session.currentMenu === "LANGUAGE_SELECTION") {
            menu = await getLanguageMenu();
        } else if (session.currentMenu === "MAIN_MENU") {
            menu = await getMainMenu(session.language || "English");
        } else {
            response.say(
                "This service is not available yet. Please call again later."
            );
            response.hangup();

            return res.type("text/xml").send(response.toString());
        }

        const language =
            session.language === "Hindi" ? "hi-IN" : "en-US";

        const menuResponse = createMenuResponse(
            req,
            sessionId,
            menu,
            language
        );

        res.type("text/xml").send(menuResponse.toString());

    } catch (error) {
        console.error("Keypad input error:", error);

        const response = new VoiceResponse();
        response.say("Sorry, something went wrong.");
        response.hangup();

        res.type("text/xml").send(response.toString());
    }
};

module.exports = {
    incomingCall,
    handleKeypadInput
};
