
import API from "./api";

// Get all call logs
export const getCallLogs = async () => {
    const { data } = await API.get("/calls");
    return data;
};

// Get call statistics
export const getCallStats = async () => {
    const { data } = await API.get("/calls/stats");
    return data;
};

// Get call log by ID
export const getCallById = async (id) => {
    const { data } = await API.get(`/calls/${id}`);
    return data;
};

// Create a call log
export const createCallLog = async (callData) => {
    const { data } = await API.post("/calls", callData);
    return data;
};

// Update a call log
export const updateCallLog = async (id, callData) => {
    const { data } = await API.put(`/calls/${id}`, callData);
    return data;
};

// Get call logs for a patient
export const getPatientCallLogs = async (patientId) => {
    const { data } = await API.get(`/calls/patient/${patientId}`);
    return data;
};

// Get active call sessions
export const getActiveSessions = async () => {
    const { data } = await API.get("/calls/sessions/active");
    return data;
};

// Get call session by ID
export const getSessionById = async (id) => {
    const { data } = await API.get(`/calls/sessions/${id}`);
    return data;
};
