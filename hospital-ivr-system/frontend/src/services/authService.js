
import API from "./api";

// Admin login
export const loginAdmin = async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);

    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    return data;
};

// Get logged-in admin profile
export const getAdminProfile = async () => {
    const { data } = await API.get("/auth/profile");
    return data;
};

// Admin logout
export const logoutAdmin = () => {
    localStorage.removeItem("token");
};
