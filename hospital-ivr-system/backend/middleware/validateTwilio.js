
const twilio = require("twilio");

// Middleware to validate Twilio webhook requests
const validateTwilio = (req, res, next) => {
    try {
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        // Check whether Twilio Auth Token is configured
        if (!authToken) {
            return res.status(500).json({
                success: false,
                message: "Twilio authentication is not configured."
            });
        }

        // Get signature sent by Twilio
        const signature = req.headers["x-twilio-signature"];

        if (!signature) {
            return res.status(403).json({
                success: false,
                message: "Twilio signature is missing."
            });
        }

        // Construct the exact public URL Twilio called
        const webhookUrl =
            `${req.protocol}://${req.get("host")}${req.originalUrl}`;

        // Verify the request signature
        const isValid = twilio.validateRequest(
            authToken,
            signature,
            webhookUrl,
            req.body
        );

        if (!isValid) {
            return res.status(403).json({
                success: false,
                message: "Invalid Twilio request."
            });
        }

        // Request is verified
        next();

    } catch (error) {
        console.error("Twilio validation error:", error.message);

        return res.status(403).json({
            success: false,
            message: "Unable to verify Twilio request."
        });
    }
};

// Export middleware
module.exports = validateTwilio;
