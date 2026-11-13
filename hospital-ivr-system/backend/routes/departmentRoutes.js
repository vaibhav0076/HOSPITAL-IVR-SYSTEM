
const express = require("express");

const router = express.Router();

const {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const { protect } = require("../middleware/authMiddleware");

// Protect all department routes
router.use(protect);

// Get all departments
router.get("/", getDepartments);

// Add a new department
router.post("/", createDepartment);

// Get a particular department
router.get("/:id", getDepartmentById);

// Update department
router.put("/:id", updateDepartment);

// Delete department
router.delete("/:id", deleteDepartment);

module.exports = router;
