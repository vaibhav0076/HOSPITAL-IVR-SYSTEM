
const jwt = require("jsonwebtoken");

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token;

        // Check whether authorization header contains a Bearer token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If token is missing, deny access
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token is missing."
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach admin information to request
        req.admin = {
            id: decoded.id,
            role: decoded.role
        };

        // Continue to the next middleware or controller
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Invalid or expired token."
        });
    }
};

// Export middleware
module.exports = { protect };
