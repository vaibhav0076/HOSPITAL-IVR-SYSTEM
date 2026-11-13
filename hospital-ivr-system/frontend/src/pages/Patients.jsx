
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import API from "../services/api";

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "",
        address: ""
    };

    const [formData, setFormData] = useState(initialForm);

    const fetchPatients = async () => {
        try {
            const { data } = await API.get("/patients");
            setPatients(data.patients || []);
        } catch (error) {
            setError("Failed to load patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
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
            const patientData = {
                ...formData,
                age: Number(formData.age)
            };

            if (editingId) {
                await API.put(`/patients/${editingId}`, patientData);
            } else {
                await API.post("/patients", patientData);
            }

            setFormData(initialForm);
            setEditingId(null);
            await fetchPatients();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save patient."
            );
        }
    };

    const handleEdit = (patient) => {
        setEditingId(patient._id);

        setFormData({
            name: patient.name || "",
            phone: patient.phone || "",
            email: patient.email || "",
            age: patient.age ?? "",
            gender: patient.gender || "",
            address: patient.address || ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) {
            return;
        }

        try {
            await API.delete(`/patients/${id}`);
            await fetchPatients();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete patient."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading patients..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Manage Patients</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>
                            {editingId ? "Update Patient" : "Add New Patient"}
                        </h3>

                        <input
                            name="name"
                            placeholder="Patient Name"
                            value={formData.name}
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
                            type="email"
                            name="email"
                            placeholder="Email (optional)"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            min="0"
                            required
                        />

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <textarea
                            name="address"
                            placeholder="Patient Address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <button type="submit">
                            {editingId ? "Update Patient" : "Add Patient"}
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

                    <h3>Patients List</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient._id}>
                                        <td>{patient.name}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.email || "N/A"}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                        <td>
                                            <button onClick={() => handleEdit(patient)}>
                                                Edit
                                            </button>

                                            <button onClick={() => handleDelete(patient._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {patients.length === 0 && (
                                    <tr>
                                        <td colSpan="6">No patients found.</td>
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

export default Patients;
