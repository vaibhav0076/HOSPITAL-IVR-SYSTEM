
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import AppointmentForm from "../components/appointments/AppointmentForm";
import {
    getAppointments,
    cancelAppointment
} from "../services/appointmentService";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAppointments = async () => {
        try {
            const data = await getAppointments();
            setAppointments(data.appointments || []);
        } catch (error) {
            setError("Failed to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            await cancelAppointment(id);
            await fetchAppointments();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to cancel appointment."
            );
        }
    };

    if (loading) {
        return <Loader message="Loading appointments..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Manage Appointments</h1>

                    {error && <p className="error-message">{error}</p>}

                    <AppointmentForm
                        onAppointmentCreated={fetchAppointments}
                    />

                    <h3>Appointments List</h3>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Department</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{appointment.appointmentId}</td>
                                        <td>
                                            {appointment.patient?.name || "N/A"}
                                        </td>
                                        <td>
                                            {appointment.doctor?.name || "N/A"}
                                        </td>
                                        <td>
                                            {appointment.department?.name || "N/A"}
                                        </td>
                                        <td>
                                            {new Date(
                                                appointment.appointmentDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{appointment.appointmentTime}</td>
                                        <td>{appointment.status}</td>
                                        <td>
                                            {appointment.status !== "Cancelled" &&
                                                appointment.status !== "Completed" && (
                                                    <button
                                                        onClick={() =>
                                                            handleCancel(appointment._id)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                        </td>
                                    </tr>
                                ))}

                                {appointments.length === 0 && (
                                    <tr>
                                        <td colSpan="8">
                                            No appointments found.
                                        </td>
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

export default Appointments;
