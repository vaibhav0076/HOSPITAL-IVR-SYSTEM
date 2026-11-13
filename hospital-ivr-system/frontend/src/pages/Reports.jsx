
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import API from "../services/api";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        patient: "",
        testName: "",
        testDate: "",
        result: "",
        notes: ""
    });

    const fetchReports = async () => {
        try {
            const { data } = await API.get("/reports");
            setReports(data.reports || []);
        } catch (error) {
            setError("Failed to load laboratory reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
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
            await API.post("/reports", formData);

            setFormData({
                patient: "",
                testName: "",
                testDate: "",
                result: "",
                notes: ""
            });

            await fetchReports();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create laboratory report."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading laboratory reports..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Laboratory Reports</h1>

                    {error && <p className="error-message">{error}</p>}

                    <form className="data-form" onSubmit={handleSubmit}>
                        <h3>Add New Lab Report</h3>

                        <input
                            name="patient"
                            placeholder="Patient ID"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="testName"
                            placeholder="Test Name"
                            value={formData.testName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="testDate"
                            value={formData.testDate}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="result"
                            placeholder="Test Result"
                            value={formData.result}
                            onChange={handleChange}
                        />

                        <textarea
                            name="notes"
                            placeholder="Additional Notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />

                        <button type="submit">Add Report</button>
                    </form>

                    <h3>Laboratory Reports List</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Report ID</th>
                                    <th>Patient</th>
                                    <th>Test Name</th>
                                    <th>Test Date</th>
                                    <th>Result</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report._id}>
                                        <td>{report.reportId}</td>
                                        <td>{report.patient?.name || "N/A"}</td>
                                        <td>{report.testName}</td>
                                        <td>
                                            {report.testDate
                                                ? new Date(report.testDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td>{report.result || "Pending"}</td>
                                        <td>{report.status}</td>
                                    </tr>
                                ))}

                                {reports.length === 0 && (
                                    <tr>
                                        <td colSpan="6">No laboratory reports found.</td>
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

export default Reports;
