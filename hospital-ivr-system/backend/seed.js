
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Admin = require("./models/Admin");
const Department = require("./models/Department");
const Doctor = require("./models/Doctor");
const IVRConfiguration = require("./models/IVRConfiguration");

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // --------------------------------
        // 1. CREATE INITIAL ADMIN
        // --------------------------------

        let admin = await Admin.findOne({
            email: "admin@hospital.com"
        });

        if (!admin) {
            await Admin.create({
                name: "Hospital Admin",
                email: "admin@hospital.com",
                password: "Admin@12345",
                role: "admin"
            });

            console.log("Admin account created");
        } else {
            console.log("Admin account already exists");
        }

        // --------------------------------
        // 2. CREATE DEPARTMENTS
        // --------------------------------

        const departmentNames = [
            {
                name: "Cardiology",
                description: "Heart and cardiovascular care"
            },
            {
                name: "Neurology",
                description: "Brain and nervous system care"
            },
            {
                name: "Orthopedics",
                description: "Bone and joint treatment"
            },
            {
                name: "General Medicine",
                description: "General healthcare and consultation"
            },
            {
                name: "Pediatrics",
                description: "Healthcare for children"
            }
        ];

        const departments = {};

        for (const departmentData of departmentNames) {
            let department = await Department.findOne({
                name: departmentData.name
            });

            if (!department) {
                department = await Department.create(departmentData);
            }

            departments[departmentData.name] = department._id;
        }

        console.log("Departments created or verified");

        // --------------------------------
        // 3. CREATE SAMPLE DOCTORS
        // --------------------------------

        const doctors = [
            {
                name: "Dr. Rahul Sharma",
                email: "rahul.sharma@hospital.com",
                phone: "9876543210",
                specialization: "Cardiologist",
                department: departments.Cardiology,
                qualification: "MBBS, MD Cardiology",
                experience: 12,
                consultationFee: 800,
                availability: "Available"
            },
            {
                name: "Dr. Priya Verma",
                email: "priya.verma@hospital.com",
                phone: "9876543211",
                specialization: "Neurologist",
                department: departments.Neurology,
                qualification: "MBBS, DM Neurology",
                experience: 10,
                consultationFee: 1000,
                availability: "Available"
            },
            {
                name: "Dr. Amit Singh",
                email: "amit.singh@hospital.com",
                phone: "9876543212",
                specialization: "Orthopedic Surgeon",
                department: departments.Orthopedics,
                qualification: "MBBS, MS Orthopedics",
                experience: 8,
                consultationFee: 700,
                availability: "Available"
            },
            {
                name: "Dr. Neha Gupta",
                email: "neha.gupta@hospital.com",
                phone: "9876543213",
                specialization: "General Physician",
                department: departments["General Medicine"],
                qualification: "MBBS, MD Medicine",
                experience: 9,
                consultationFee: 500,
                availability: "Available"
            },
            {
                name: "Dr. Karan Mehta",
                email: "karan.mehta@hospital.com",
                phone: "9876543214",
                specialization: "Pediatrician",
                department: departments.Pediatrics,
                qualification: "MBBS, MD Pediatrics",
                experience: 7,
                consultationFee: 600,
                availability: "Available"
            }
        ];

        for (const doctorData of doctors) {
            await Doctor.findOneAndUpdate(
                { email: doctorData.email },
                { $setOnInsert: doctorData },
                { upsert: true, new: true }
            );
        }

        console.log("Sample doctors created or verified");

        // --------------------------------
        // 4. CREATE DEFAULT IVR CONFIGURATION
        // --------------------------------

        const existingConfig = await IVRConfiguration.findOne();

        if (!existingConfig) {
            await IVRConfiguration.create({
                hospitalName: "City Hospital",

                welcomeMessage:
                    "Welcome to City Hospital. Thank you for calling.",

                supportedLanguages: [
                    "English",
                    "Hindi"
                ],

                menuOptions: [
                    {
                        key: "1",
                        label: "Book Appointment",
                        description: "Book a new doctor appointment",
                        isActive: true
                    },
                    {
                        key: "2",
                        label: "Existing Appointment",
                        description: "Check or manage an existing appointment",
                        isActive: true
                    },
                    {
                        key: "3",
                        label: "Talk to Department",
                        description: "Connect with a hospital department",
                        isActive: true
                    },
                    {
                        key: "4",
                        label: "Emergency",
                        description: "Get emergency assistance",
                        isActive: true
                    },
                    {
                        key: "5",
                        label: "Billing",
                        description: "Get billing information",
                        isActive: true
                    },
                    {
                        key: "6",
                        label: "Lab Reports",
                        description: "Get laboratory report information",
                        isActive: true
                    },
                    {
                        key: "7",
                        label: "Customer Care",
                        description: "Talk to customer support",
                        isActive: true
                    },
                    {
                        key: "8",
                        label: "Repeat Menu",
                        description: "Listen to the main menu again",
                        isActive: true
                    },
                    {
                        key: "9",
                        label: "End Call",
                        description: "End the IVR call",
                        isActive: true
                    }
                ],

                emergencyContact: "112",
                customerCareNumber: "1800123456",

                openingTime: "09:00",
                closingTime: "18:00",

                isActive: true
            });

            console.log("Default IVR configuration created");
        } else {
            console.log("IVR configuration already exists");
        }

        // --------------------------------
        // 5. COMPLETION MESSAGE
        // --------------------------------

        console.log("\nDatabase seeding completed successfully");

    } catch (error) {
        console.error("Database seeding failed:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

seedDatabase();
