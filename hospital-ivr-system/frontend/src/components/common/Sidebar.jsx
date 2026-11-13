
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/" },
        { name: "Doctors", path: "/doctors" },
        { name: "Departments", path: "/departments" },
        { name: "Patients", path: "/patients" },
        { name: "Appointments", path: "/appointments" },
        { name: "Call Logs", path: "/calls" },
        { name: "Billing", path: "/billing" },
        { name: "Lab Reports", path: "/reports" },
        { name: "Feedback", path: "/feedback" },
        { name: "IVR Configuration", path: "/ivr-configuration" },
        { name: "IVR Simulator", path: "/ivr-simulator" }
    ];

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    isActive ? "active" : ""
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
