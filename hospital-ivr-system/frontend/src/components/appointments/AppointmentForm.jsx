
import { useEffect, useState } from "react";
import { getDoctors } from "../../services/doctorService";
import { getDepartments } from "../../services/departmentService";
import { createAppointment } from "../../services/appointmentService";

const AppointmentForm = ({ onAppointmentCreated }) => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        department: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorData, departmentData] = await Promise.all([
                    getDoctors(),
                    getDepartments()
                ]);

                setDoctors(doctorData.doctors || []);
                setDepartments(departmentData.departments || []);
            } catch (error) {
                setError("Failed to load doctors and departments.");
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await createAppointment(formData);

            setSuccess("Appointment booked successfully!");

            setFormData({
                patient: "",
                doctor: "",
                department: "",
                appointmentDate: "",
                appointmentTime: "",
                reason: ""
            });

            if (onAppointmentCreated) {
                onAppointmentCreated();
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to book appointment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="appointment-form" onSubmit={handleSubmit}>
            <h3>Book New Appointment</h3>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="form-group">
                <label>Patient ID</label>
                <input
                    type="text"
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    placeholder="Enter patient ID"
                    required
                />
            </div>

            <div className="form-group">
                <label>Department</label>
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                        <option key={department._id} value={department._id}>
                            {department.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Doctor</label>
                <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Doctor</option>
                    {doctors
                        .filter(
                            (doctor) =>
                                !formData.department ||
                                doctor.department?._id === formData.department ||
                                doctor.department === formData.department
                        )
                        .map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.name}
                            </option>
                        ))}
                </select>
            </div>

            <div className="form-group">
                <label>Appointment Date</label>
                <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Appointment Time</label>
                <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Reason for Appointment</label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter appointment reason"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
            </button>
        </form>
    );
};

export default AppointmentForm;
