
const IVRConfiguration = require("../models/IVRConfiguration");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get IVR configuration
// @route GET /api/ivr/config
const getIVRConfiguration = asyncHandler(async (req, res) => {
    const configuration = await IVRConfiguration.findOne();

    if (!configuration) {
        res.status(404);
        throw new Error("IVR configuration not found");
    }

    res.status(200).json({
        success: true,
        configuration
    });
});

// @desc Create initial IVR configuration
// @route POST /api/ivr/config
const createIVRConfiguration = asyncHandler(async (req, res) => {
    const existingConfiguration = await IVRConfiguration.findOne();

    if (existingConfiguration) {
        res.status(400);
        throw new Error(
            "IVR configuration already exists. Please update it instead."
        );
    }

    const configuration = await IVRConfiguration.create(req.body);

    res.status(201).json({
        success: true,
        message: "IVR configuration created successfully",
        configuration
    });
});

// @desc Update IVR configuration
// @route PUT /api/ivr/config
const updateIVRConfiguration = asyncHandler(async (req, res) => {
    const configuration = await IVRConfiguration.findOne();

    if (!configuration) {
        res.status(404);
        throw new Error("IVR configuration not found");
    }

    const allowedFields = [
        "hospitalName",
        "welcomeMessage",
        "supportedLanguages",
        "menuOptions",
        "emergencyContact",
        "customerCareNumber",
        "openingTime",
        "closingTime",
        "isActive"
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            configuration[field] = req.body[field];
        }
    });

    const updatedConfiguration = await configuration.save();

    res.status(200).json({
        success: true,
        message: "IVR configuration updated successfully",
        configuration: updatedConfiguration
    });
});

// @desc Activate or deactivate IVR
// @route PATCH /api/ivr/status
const updateIVRStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        res.status(400);
        throw new Error("Please provide a valid IVR status");
    }

    const configuration = await IVRConfiguration.findOne();

    if (!configuration) {
        res.status(404);
        throw new Error("IVR configuration not found");
    }

    configuration.isActive = isActive;

    await configuration.save();

    res.status(200).json({
        success: true,
        message: `IVR system ${isActive ? "activated" : "deactivated"} successfully`,
        configuration
    });
});

module.exports = {
    getIVRConfiguration,
    createIVRConfiguration,
    updateIVRConfiguration,
    updateIVRStatus
};
