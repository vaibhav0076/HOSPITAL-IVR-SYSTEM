
import API from "./api";

// Get all appointments
export const getAppointments = async () => {
    const { data } = await API.get("/appointments");
    return data;
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
    const { data } = await API.get(`/appointments/${id}`);
    return data;
};

// Create appointment
export const createAppointment = async (appointmentData) => {
    const { data } = await API.post("/appointments", appointmentData);
    return data;
};

// Get appointments by patient
export const getPatientAppointments = async (patientId) => {
    const { data } = await API.get(`/appointments/patient/${patientId}`);
    return data;
};

// Cancel appointment
export const cancelAppointment = async (id) => {
    const { data } = await API.patch(`/appointments/${id}/cancel`);
    return data;
};

// Reschedule appointment
export const rescheduleAppointment = async (id, appointmentData) => {
    const { data } = await API.patch(
        `/appointments/${id}/reschedule`,
        appointmentData
    );
    return data;
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
    const { data } = await API.patch(`/appointments/${id}/status`, {
        status
    });
    return data;
};
