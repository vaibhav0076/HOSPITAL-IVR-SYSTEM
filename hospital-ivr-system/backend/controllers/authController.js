
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

// Generate JWT Token
const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    const admin = await Admin.findOne({
        email: email.toLowerCase().trim()
    }).select("+password");

    if (!admin || !(await admin.comparePassword(password))) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // Prevent inactive admin login
    if (admin.isActive === false) {
        res.status(403);
        throw new Error("Your admin account is inactive");
    }

    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
});

// Get Logged-in Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    if (admin.isActive === false) {
        res.status(403);
        throw new Error("Admin account is inactive");
    }

    res.status(200).json({
        success: true,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }
    });
});

module.exports = {
    loginAdmin,
    getAdminProfile
};
