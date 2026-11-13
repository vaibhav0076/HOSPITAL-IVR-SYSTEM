
const crypto = require("crypto");

// Generate a unique ID with a custom prefix
const generateId = (prefix) => {
    const year = new Date().getFullYear();

    // Generate a random 6-character hexadecimal string
    const randomString = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return `${prefix}-${year}-${randomString}`;
};

// Export function
module.exports = generateId;
