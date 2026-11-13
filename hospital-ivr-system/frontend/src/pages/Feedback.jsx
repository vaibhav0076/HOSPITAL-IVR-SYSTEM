
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import API from "../services/api";

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const initialForm = {
        patient: "",
        rating: "",
        comments: "",
        submittedThrough: "Dashboard"
    };

    const [formData, setFormData] = useState(initialForm);

    const fetchFeedback = async () => {
        try {
            const { data } = await API.get("/feedback");
            setFeedbackList(data.feedback || []);
        } catch (error) {
            setError("Failed to load feedback.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
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
            await API.post("/feedback", {
                ...formData,
                rating: Number(formData.rating)
            });

            setFormData(initialForm);
            await fetchFeedback();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to submit feedback."
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) {
            return;
        }

        try {
            await API.delete(`/feedback/${id}`);
            await fetchFeedback();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete feedback."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading feedback..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Patient Feedback</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>Add Feedback</h3>

                        <input
                            name="patient"
                            placeholder="Patient ID (optional)"
                            value={formData.patient}
                            onChange={handleChange}
                        />

                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Rating</option>
                            <option value="1">1 - Very Poor</option>
                            <option value="2">2 - Poor</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4 - Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>

                        <textarea
                            name="comments"
                            placeholder="Enter feedback comments"
                            value={formData.comments}
                            onChange={handleChange}
                        />

                        <button type="submit">Submit Feedback</button>
                    </form>

                    <h3>Feedback Records</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Rating</th>
                                    <th>Comments</th>
                                    <th>Submitted Through</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {feedbackList.map((feedback) => (
                                    <tr key={feedback._id}>
                                        <td>{feedback.patient?.name || "Anonymous"}</td>
                                        <td>{feedback.rating} / 5</td>
                                        <td>{feedback.comments || "N/A"}</td>
                                        <td>{feedback.submittedThrough}</td>
                                        <td>
                                            {new Date(
                                                feedback.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleDelete(feedback._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {feedbackList.length === 0 && (
                                    <tr>
                                        <td colSpan="6">No feedback found.</td>
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

export default Feedback;
