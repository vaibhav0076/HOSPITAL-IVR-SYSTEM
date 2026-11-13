
const mongoose = require("mongoose");

// Define IVR Configuration Schema
const ivrConfigurationSchema = new mongoose.Schema(
    {
        hospitalName: {
            type: String,
            required: true,
            trim: true,
            default: "City Hospital"
        },

        welcomeMessage: {
            type: String,
            default: "Welcome to City Hospital. Thank you for calling."
        },

        supportedLanguages: {
            type: [String],
            enum: ["English", "Hindi"],
            default: ["English", "Hindi"]
        },

        menuOptions: [
            {
                key: {
                    type: String,
                    required: true
                },

                label: {
                    type: String,
                    required: true
                },

                description: {
                    type: String,
                    default: ""
                },

                isActive: {
                    type: Boolean,
                    default: true
                }
            }
        ],

        emergencyContact: {
            type: String,
            trim: true,
            default: ""
        },

        customerCareNumber: {
            type: String,
            trim: true,
            default: ""
        },

        openingTime: {
            type: String,
            default: "09:00"
        },

        closingTime: {
            type: String,
            default: "18:00"
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

// Create IVR Configuration Model
const IVRConfiguration = mongoose.model(
    "IVRConfiguration",
    ivrConfigurationSchema
);

// Export IVR Configuration Model
module.exports = IVRConfiguration;
