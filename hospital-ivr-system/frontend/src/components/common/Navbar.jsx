
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <h2>Hospital IVR System</h2>
            </div>

            <div className="navbar-user">
                <span>{admin?.name || admin?.email || "Admin"}</span>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
