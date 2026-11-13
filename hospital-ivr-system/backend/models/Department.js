
const mongoose = require("mongoose");

// Define Department Schema
const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        headOfDepartment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null
        },

        contactNumber: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Create Department Model
const Department = mongoose.model("Department", departmentSchema);

// Export Department Model
module.exports = Department;
