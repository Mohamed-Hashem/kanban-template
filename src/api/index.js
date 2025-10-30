import axios from "axios";
import { API_CONFIG } from "../constants";

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (import.meta.env.DEV) console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject({
                message: "Network error. Check your connection.",
                type: "network",
            });
        }

        const errorMessage =
            error.response.data?.message ||
            {
                400: "Invalid request",
                401: "Unauthorized",
                403: "Forbidden",
                404: "Not found",
                500: "Server error",
            }[error.response.status] ||
            "An error occurred";

        return Promise.reject({
            message: errorMessage,
            status: error.response.status,
            data: error.response.data,
        });
    }
);

export const getTasks = async (params = {}) => {
    const response = await api.get("/tasks", { params });
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

export const createTask = async (task) => {
    const response = await api.post("/tasks", {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const updateTask = async (task) => {
    const response = await api.put(`/tasks/${task.id}`, {
        ...task,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const patchTask = async (id, updates) => {
    const response = await api.patch(`/tasks/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    return { id };
};

export const bulkUpdateTasks = async (tasks) => Promise.all(tasks.map((task) => updateTask(task)));

export const searchTasks = async (query) => {
    const response = await api.get("/tasks", { params: { q: query } });
    return response.data;
};

export default api;
