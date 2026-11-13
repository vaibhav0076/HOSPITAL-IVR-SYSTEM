
// Load environment variables first
require("dotenv").config();

// Import application and database connection
const app = require("./app");
const connectDB = require("./config/db");

// Server port
const PORT = process.env.PORT || 5000;

// Start backend server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

// Execute server startup
startServer();
