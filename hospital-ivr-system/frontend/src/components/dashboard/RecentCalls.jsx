
import { useEffect, useState } from "react";
import { getCallLogs } from "../../services/callService";
import Loader from "../common/Loader";

const RecentCalls = () => {
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const data = await getCallLogs();
                setCalls((data.callLogs || []).slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch recent calls:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);

    if (loading) {
        return <Loader message="Loading recent calls..." />;
    }

    return (
        <div className="recent-calls">
            <h3>Recent Calls</h3>

            {calls.length === 0 ? (
                <p>No calls found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Caller</th>
                                <th>Call Type</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {calls.map((call) => (
                                <tr key={call._id}>
                                    <td>{call.callerNumber}</td>
                                    <td>{call.callType}</td>
                                    <td>{call.status}</td>
                                    <td>
                                        {new Date(call.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentCalls;
