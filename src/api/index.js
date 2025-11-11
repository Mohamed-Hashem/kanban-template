import axios from "axios";
import { API_CONFIG } from "../constants";

const isJSONBin = API_CONFIG.BASE_URL.includes("jsonbin.io");

class JSONBinAdapter {
    constructor(binUrl) {
        this.binUrl = binUrl;
        this.cache = null;
        this.cacheTimestamp = null;
        this.cacheDuration = 2000;
        this.pendingUpdate = null;
    }

    async fetchBin() {
        try {
            const now = Date.now();
            if (
                this.cache &&
                this.cacheTimestamp &&
                now - this.cacheTimestamp < this.cacheDuration
            ) {
                return this.cache;
            }

            const headers = {};
            const apiKey = import.meta.env.VITE_JSONBIN_API_KEY;
            if (apiKey) {
                headers["X-Master-Key"] = apiKey;
            }

            const response = await axios.get(this.binUrl, { headers });
            this.cache = response.data.record || response.data;
            this.cacheTimestamp = now;
            return this.cache;
        } catch (error) {
            console.error("Failed to fetch from JSONBin:", error);
            return { tasks: [] };
        }
    }

    async updateBin(data) {
        try {
            if (this.pendingUpdate) {
                await this.pendingUpdate;
            }

            const headers = { "Content-Type": "application/json" };
            const apiKey = import.meta.env.VITE_JSONBIN_API_KEY;
            if (apiKey) {
                headers["X-Master-Key"] = apiKey;
            }

            this.pendingUpdate = axios
                .put(this.binUrl, data, { headers })
                .then(() => {
                    this.cache = data;
                    this.cacheTimestamp = Date.now();
                    this.pendingUpdate = null;
                })
                .catch((error) => {
                    console.error("Failed to update JSONBin:", error);
                    this.pendingUpdate = null;
                    throw error;
                });

            await this.pendingUpdate;
        } catch (error) {
            console.error("Failed to update JSONBin:", error);
            throw error;
        }
    }

    async getTasks(params = {}) {
        const data = await this.fetchBin();
        let tasks = data.tasks || [];

        if (params.q) {
            const query = params.q.toLowerCase();
            tasks = tasks.filter(
                (task) =>
                    task.title?.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query)
            );
        }

        if (params.column) {
            tasks = tasks.filter((task) => task.column === params.column);
        }

        return tasks;
    }

    async createTask(task) {
        const data = await this.fetchBin();
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        data.tasks = [...(data.tasks || []), newTask];
        await this.updateBin(data);
        return newTask;
    }

    async updateTask(task) {
        const data = await this.fetchBin();
        const index = (data.tasks || []).findIndex((t) => t.id === task.id);
        if (index === -1) throw new Error("Task not found");

        data.tasks[index] = {
            ...task,
            updatedAt: new Date().toISOString(),
        };
        await this.updateBin(data);
        return data.tasks[index];
    }

    async patchTask(id, updates) {
        const data = await this.fetchBin();
        const index = (data.tasks || []).findIndex((t) => t.id === id);
        if (index === -1) throw new Error("Task not found");

        data.tasks[index] = {
            ...data.tasks[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        await this.updateBin(data);
        return data.tasks[index];
    }

    async deleteTask(id) {
        const data = await this.fetchBin();
        data.tasks = (data.tasks || []).filter((t) => t.id !== id);
        await this.updateBin(data);
        return { id };
    }
}

const jsonBinAdapter = isJSONBin ? new JSONBinAdapter(API_CONFIG.BASE_URL) : null;

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
    if (jsonBinAdapter) {
        return await jsonBinAdapter.getTasks(params);
    }
    const response = await api.get("/tasks", { params });
    return response.data;
};

export const createTask = async (task) => {
    if (jsonBinAdapter) {
        return await jsonBinAdapter.createTask(task);
    }
    const response = await api.post("/tasks", {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const updateTask = async (task) => {
    if (jsonBinAdapter) {
        return await jsonBinAdapter.updateTask(task);
    }
    const response = await api.put(`/tasks/${task.id}`, {
        ...task,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const patchTask = async (id, updates) => {
    if (jsonBinAdapter) {
        return await jsonBinAdapter.patchTask(id, updates);
    }
    const response = await api.patch(`/tasks/${id}`, {
        ...updates,
        updatedAt: new Date().toISOString(),
    });
    return response.data;
};

export const deleteTask = async (id) => {
    if (jsonBinAdapter) {
        return await jsonBinAdapter.deleteTask(id);
    }
    await api.delete(`/tasks/${id}`);
    return { id };
};

export default api;
