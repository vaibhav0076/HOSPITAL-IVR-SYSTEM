
const twilio = require("twilio");

// Read Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create Twilio client only when credentials are available
let twilioClient = null;

if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
}

// Export Twilio client
module.exports = twilioClient;
