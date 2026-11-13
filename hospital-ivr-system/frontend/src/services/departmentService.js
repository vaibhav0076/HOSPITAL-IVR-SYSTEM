
import API from "./api";

// Get all departments
export const getDepartments = async () => {
    const { data } = await API.get("/departments");
    return data;
};

// Get department by ID
export const getDepartmentById = async (id) => {
    const { data } = await API.get(`/departments/${id}`);
    return data;
};

// Create department
export const createDepartment = async (departmentData) => {
    const { data } = await API.post("/departments", departmentData);
    return data;
};

// Update department
export const updateDepartment = async (id, departmentData) => {
    const { data } = await API.put(`/departments/${id}`, departmentData);
    return data;
};

// Delete department
export const deleteDepartment = async (id) => {
    const { data } = await API.delete(`/departments/${id}`);
    return data;
};
