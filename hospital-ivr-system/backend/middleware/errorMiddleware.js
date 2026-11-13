
// Handle invalid API routes
const notFound = (req, res, next) => {
    const error = new Error(
        `Route not found: ${req.originalUrl}`
    );

    res.status(404);
    next(error);
};

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
    // Determine HTTP status code
    const statusCode =
        res.statusCode && res.statusCode !== 200
            ? res.statusCode
            : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",

        // Show stack trace only during development
        stack:
            process.env.NODE_ENV === "production"
                ? undefined
                : err.stack
    });
};

// Export middleware functions
module.exports = {
    notFound,
    errorHandler
};
