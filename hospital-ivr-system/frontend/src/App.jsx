
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import CallLogs from "./pages/CallLogs";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import IVRConfiguration from "./pages/IVRConfiguration";
import IVRSimulator from "./pages/IVRSimulator";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/calls" element={<CallLogs />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route
                        path="/ivr-configuration"
                        element={<IVRConfiguration />}
                    />
                    <Route
                        path="/ivr-simulator"
                        element={<IVRSimulator />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<h1>404 - Page Not Found</h1>}
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
