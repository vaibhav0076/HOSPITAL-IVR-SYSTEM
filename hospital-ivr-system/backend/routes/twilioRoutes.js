
const express = require("express");
const router = express.Router();

const {
    incomingCall,
    handleKeypadInput
} = require("../controllers/twilioController");

const validateTwilio = require("../middleware/validateTwilio");

// Validate incoming Twilio requests
router.use(validateTwilio);

// Incoming call webhook
router.post("/incoming", incomingCall);

// Keypad input webhook
router.post("/input", handleKeypadInput);

module.exports = router;
