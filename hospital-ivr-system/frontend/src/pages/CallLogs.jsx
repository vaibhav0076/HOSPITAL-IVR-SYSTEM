
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import { getCallLogs } from "../services/callService";

const CallLogs = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const data = await getCallLogs();
                setCalls(data.callLogs || []);
            } catch (error) {
                setError("Failed to load call logs.");
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);

    if (loading) {
        return <Loader message="Loading call logs..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Hospital Call Logs</h1>

                    {error && <p className="error-message">{error}</p>}

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Caller Number</th>
                                    <th>Receiver Number</th>
                                    <th>Call Type</th>
                                    <th>Call Purpose</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th>Duration</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {calls.map((call) => (
                                    <tr key={call._id}>
                                        <td>{call.callerNumber}</td>
                                        <td>{call.receiverNumber || "N/A"}</td>
                                        <td>{call.callType}</td>
                                        <td>{call.callPurpose}</td>
                                        <td>{call.language}</td>
                                        <td>{call.status}</td>
                                        <td>{call.duration ?? "N/A"}</td>
                                        <td>
                                            {new Date(
                                                call.createdAt
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                                {calls.length === 0 && (
                                    <tr>
                                        <td colSpan="8">No call logs found.</td>
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

export default CallLogs;
