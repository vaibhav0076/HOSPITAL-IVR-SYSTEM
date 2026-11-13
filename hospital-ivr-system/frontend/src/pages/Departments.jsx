
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from "../services/departmentService";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        name: "",
        description: "",
        headOfDepartment: ""
    };

    const [formData, setFormData] = useState(initialForm);

    const fetchDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data.departments || []);
        } catch (error) {
            setError("Failed to load departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
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
            if (editingId) {
                await updateDepartment(editingId, formData);
            } else {
                await createDepartment(formData);
            }

            setFormData(initialForm);
            setEditingId(null);
            await fetchDepartments();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save department."
            );
        }
    };

    const handleEdit = (department) => {
        setEditingId(department._id);

        setFormData({
            name: department.name || "",
            description: department.description || "",
            headOfDepartment:
                department.headOfDepartment?._id ||
                department.headOfDepartment ||
                ""
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) {
            return;
        }

        try {
            await deleteDepartment(id);
            await fetchDepartments();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete department."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading departments..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Manage Departments</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>
                            {editingId ? "Update Department" : "Add New Department"}
                        </h3>

                        <input
                            name="name"
                            placeholder="Department Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Department Description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        <input
                            name="headOfDepartment"
                            placeholder="Head of Department Doctor ID (optional)"
                            value={formData.headOfDepartment}
                            onChange={handleChange}
                        />

                        <button type="submit">
                            {editingId ? "Update Department" : "Add Department"}
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

                    <h3>Departments List</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Head of Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {departments.map((department) => (
                                    <tr key={department._id}>
                                        <td>{department.name}</td>
                                        <td>{department.description || "N/A"}</td>
                                        <td>
                                            {department.headOfDepartment?.name || "N/A"}
                                        </td>
                                        <td>
                                            <button onClick={() => handleEdit(department)}>
                                                Edit
                                            </button>

                                            <button onClick={() => handleDelete(department._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {departments.length === 0 && (
                                    <tr>
                                        <td colSpan="4">No departments found.</td>
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

export default Departments;
