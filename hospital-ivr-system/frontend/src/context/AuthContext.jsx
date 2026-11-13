
import { createContext, useContext, useEffect, useState } from "react";
import {
    loginAdmin,
    getAdminProfile,
    logoutAdmin
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check whether admin is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getAdminProfile();
                setAdmin(data.admin);
            } catch (error) {
                logoutAdmin();
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login admin
    const login = async (credentials) => {
        const data = await loginAdmin(credentials);
        setAdmin(data.admin);
        return data;
    };

    // Logout admin
    const logout = () => {
        logoutAdmin();
        setAdmin(null);
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                loading,
                isAuthenticated: !!admin,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication
export const useAuth = () => {
    return useContext(AuthContext);
};
