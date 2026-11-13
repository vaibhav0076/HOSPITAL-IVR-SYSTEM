
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import RecentCalls from "../components/dashboard/RecentCalls";
import Loader from "../components/common/Loader";
import { getDoctors } from "../services/doctorService";
import { getDepartments } from "../services/departmentService";
import { getAppointments } from "../services/appointmentService";
import { getCallStats } from "../services/callService";
import API from "../services/api";

const Dashboard = () => {
    const [stats, setStats] = useState({
        doctors: 0,
        departments: 0,
        patients: 0,
        appointments: 0,
        calls: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    doctorData,
                    departmentData,
                    appointmentData,
                    patientResponse,
                    callData
                ] = await Promise.all([
                    getDoctors(),
                    getDepartments(),
                    getAppointments(),
                    API.get("/patients"),
                    getCallStats()
                ]);

                const callStats = callData.stats || {};

                setStats({
                    doctors: doctorData.doctors?.length || 0,
                    departments: departmentData.departments?.length || 0,
                    patients: patientResponse.data.patients?.length || 0,
                    appointments: appointmentData.appointments?.length || 0,
                    calls: callStats.totalCalls || 0
                });
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <Loader message="Loading dashboard..." />;
    }

    return (
        <div className="dashboard-layout">
            <Navbar />

            <div className="dashboard-body">
                <Sidebar />

                <main className="dashboard-content">
                    <h1>Dashboard</h1>
                    <p>Welcome to Hospital IVR Management System.</p>

                    <div className="stats-grid">
                        <StatCard
                            title="Total Doctors"
                            value={stats.doctors}
                            icon="👨‍⚕️"
                            color="#2563eb"
                        />

                        <StatCard
                            title="Departments"
                            value={stats.departments}
                            icon="🏥"
                            color="#16a34a"
                        />

                        <StatCard
                            title="Total Patients"
                            value={stats.patients}
                            icon="🧑"
                            color="#9333ea"
                        />

                        <StatCard
                            title="Appointments"
                            value={stats.appointments}
                            icon="📅"
                            color="#ea580c"
                        />

                        <StatCard
                            title="Total Calls"
                            value={stats.calls}
                            icon="📞"
                            color="#0891b2"
                        />
                    </div>

                    <RecentCalls />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
