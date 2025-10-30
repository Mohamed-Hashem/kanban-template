export const COLUMNS = {
    BACKLOG: { id: "backlog", title: "Backlog", color: "#E3F2FD", accentColor: "#2196F3" },
    IN_PROGRESS: {
        id: "in-progress",
        title: "In Progress",
        color: "#FFF3E0",
        accentColor: "#FF9800",
    },
    REVIEW: { id: "review", title: "Review", color: "#F3E5F5", accentColor: "#9C27B0" },
    DONE: { id: "done", title: "Done", color: "#E8F5E9", accentColor: "#4CAF50" },
};

export const COLUMN_ORDER = [COLUMNS.BACKLOG, COLUMNS.IN_PROGRESS, COLUMNS.REVIEW, COLUMNS.DONE];

export const API_CONFIG = {
    BASE_URL: "http://localhost:4000",
    TIMEOUT: 10000,
};

export const QUERY_KEYS = {
    TASKS: "tasks",
};

export const STORAGE_KEYS = {
    TASK_STORE: "kanban-task-store",
};

export const PRIORITIES = {
    LOW: { value: "low", label: "Low", color: "#4CAF50" },
    MEDIUM: { value: "medium", label: "Medium", color: "#FF9800" },
    HIGH: { value: "high", label: "High", color: "#F44336" },
};

export const DEBOUNCE_DELAYS = {
    SEARCH: 300,
};
