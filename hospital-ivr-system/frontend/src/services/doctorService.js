
import API from "./api";

// Get all doctors
export const getDoctors = async () => {
    const { data } = await API.get("/doctors");
    return data;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
    const { data } = await API.get(`/doctors/${id}`);
    return data;
};

// Create doctor
export const createDoctor = async (doctorData) => {
    const { data } = await API.post("/doctors", doctorData);
    return data;
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
    const { data } = await API.put(`/doctors/${id}`, doctorData);
    return data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
    const { data } = await API.delete(`/doctors/${id}`);
    return data;
};
