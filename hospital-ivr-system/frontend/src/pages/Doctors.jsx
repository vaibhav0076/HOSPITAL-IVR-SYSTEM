
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
} from "../services/doctorService";
import { getDepartments } from "../services/departmentService";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        name: "",
        email: "",
        phone: "",
        specialization: "",
        department: "",
        qualification: "",
        experience: "",
        consultationFee: ""
    };

    const [formData, setFormData] = useState(initialForm);

    const fetchData = async () => {
        try {
            const [doctorData, departmentData] = await Promise.all([
                getDoctors(),
                getDepartments()
            ]);

            setDoctors(doctorData.doctors || []);
            setDepartments(departmentData.departments || []);
        } catch (error) {
            setError("Failed to load doctors.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const doctorData = {
                ...formData,
                experience: Number(formData.experience),
                consultationFee: Number(formData.consultationFee)
            };

            if (editingId) {
                await updateDoctor(editingId, doctorData);
            } else {
                await createDoctor(doctorData);
            }

            setFormData(initialForm);
            setEditingId(null);
            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save doctor."
            );
        }
    };

    const handleEdit = (doctor) => {
        setEditingId(doctor._id);

        setFormData({
            name: doctor.name || "",
            email: doctor.email || "",
            phone: doctor.phone || "",
            specialization: doctor.specialization || "",
            department: doctor.department?._id || doctor.department || "",
            qualification: doctor.qualification || "",
            experience: doctor.experience ?? "",
            consultationFee: doctor.consultationFee ?? ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) {
            return;
        }

        try {
            await deleteDoctor(id);
            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete doctor."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading doctors..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Manage Doctors</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>{editingId ? "Update Doctor" : "Add New Doctor"}</h3>

                        <input
                            name="name"
                            placeholder="Doctor Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="specialization"
                            placeholder="Specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />

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

                        <input
                            name="qualification"
                            placeholder="Qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="experience"
                            placeholder="Experience (years)"
                            value={formData.experience}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                        <input
                            type="number"
                            name="consultationFee"
                            placeholder="Consultation Fee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                        <button type="submit">
                            {editingId ? "Update Doctor" : "Add Doctor"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData(initialForm);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <h3>Doctors List</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>Department</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>
                                            {doctor.department?.name || "N/A"}
                                        </td>
                                        <td>{doctor.phone}</td>
                                        <td>
                                            <button onClick={() => handleEdit(doctor)}>
                                                Edit
                                            </button>

                                            <button onClick={() => handleDelete(doctor._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {doctors.length === 0 && (
                                    <tr>
                                        <td colSpan="5">No doctors found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Doctors;
