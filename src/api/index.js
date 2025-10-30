import axios from "axios";
import { API_CONFIG } from "../constants";

/**
 * Enhanced API client with interceptors, retry logic, and error handling
 */

// Create axios instance with configuration
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for adding auth tokens, logging, etc.
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and retry logic
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(
                `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.data
            );
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            console.error("[Network Error]", error.message);
            return Promise.reject({
                message: "Network error. Please check your connection.",
                type: "network",
            });
        }

        // Retry logic for failed requests
        if (!originalRequest._retry && error.response.status >= 500) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            if (originalRequest._retryCount <= API_CONFIG.RETRY_ATTEMPTS) {
                console.log(
                    `[API Retry] Attempt ${originalRequest._retryCount} for ${originalRequest.url}`
                );

                // Wait before retrying
                await new Promise((resolve) =>
                    setTimeout(resolve, API_CONFIG.RETRY_DELAY * originalRequest._retryCount)
                );

                return api(originalRequest);
            }
        }

        // Handle specific error codes
        const errorMessage = getErrorMessage(error.response);
        console.error("[API Error]", errorMessage, error.response);

        return Promise.reject({
            message: errorMessage,
            status: error.response.status,
            data: error.response.data,
        });
    }
);

/**
 * Get user-friendly error message based on response
 */
const getErrorMessage = (response) => {
    if (response.data?.message) return response.data.message;

    switch (response.status) {
        case 400:
            return "Invalid request. Please check your input.";
        case 401:
            return "Unauthorized. Please login again.";
        case 403:
            return "You do not have permission to perform this action.";
        case 404:
            return "Resource not found.";
        case 409:
            return "Conflict. The resource already exists.";
        case 500:
            return "Server error. Please try again later.";
        case 503:
            return "Service unavailable. Please try again later.";
        default:
            return "An unexpected error occurred.";
    }
};

/**
 * Task API endpoints
 */

// Get all tasks with optional filtering
export const getTasks = async (params = {}) => {
    const response = await api.get("/tasks", { params });
    return response.data;
};

// Get a single task by ID
export const getTaskById = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

// Create a new task
export const createTask = async (task) => {
    const response = await api.post("/tasks", {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

// Update an existing task
export const updateTask = async (task) => {
    const response = await api.put(`/tasks/${task.id}`, {
        ...task,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

// Partially update a task (PATCH)
export const patchTask = async (id, updates) => {
    const response = await api.patch(`/tasks/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    return { id };
};

// Bulk update tasks (useful for drag and drop)
export const bulkUpdateTasks = async (tasks) => {
    const promises = tasks.map((task) => updateTask(task));
    return Promise.all(promises);
};

// Search tasks
export const searchTasks = async (query) => {
    const response = await api.get("/tasks", {
        params: { q: query },
    });
    return response.data;
};

export default api;
