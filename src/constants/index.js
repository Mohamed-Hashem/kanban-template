/**
 * Application-wide constants
 * Centralized configuration for kanban columns, statuses, and settings
 */

// Column definitions with metadata
export const COLUMNS = {
    BACKLOG: {
        id: "backlog",
        title: "Backlog",
        color: "#E3F2FD",
        accentColor: "#2196F3",
        description: "Tasks waiting to be started",
    },
    IN_PROGRESS: {
        id: "in-progress",
        title: "In Progress",
        color: "#FFF3E0",
        accentColor: "#FF9800",
        description: "Tasks currently being worked on",
    },
    REVIEW: {
        id: "review",
        title: "Review",
        color: "#F3E5F5",
        accentColor: "#9C27B0",
        description: "Tasks pending review",
    },
    DONE: {
        id: "done",
        title: "Done",
        color: "#E8F5E9",
        accentColor: "#4CAF50",
        description: "Completed tasks",
    },
};

// Column order array for rendering
export const COLUMN_ORDER = [COLUMNS.BACKLOG, COLUMNS.IN_PROGRESS, COLUMNS.REVIEW, COLUMNS.DONE];

// API configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

// Pagination settings
export const PAGINATION = {
    ITEMS_PER_PAGE: 10,
    INITIAL_PAGE: 1,
    INFINITE_SCROLL_THRESHOLD: 0.8,
};

// Query keys for React Query
export const QUERY_KEYS = {
    TASKS: "tasks",
    TASK_BY_ID: (id) => ["task", id],
    TASKS_BY_COLUMN: (column) => ["tasks", column],
};

// Local storage keys
export const STORAGE_KEYS = {
    TASK_STORE: "kanban-task-store",
    USER_PREFERENCES: "kanban-user-preferences",
    THEME: "kanban-theme",
};

// Animation durations (ms)
export const ANIMATION = {
    DRAG_DURATION: 200,
    FADE_DURATION: 300,
    SLIDE_DURATION: 250,
};

// Task priorities
export const PRIORITIES = {
    LOW: { value: "low", label: "Low", color: "#4CAF50" },
    MEDIUM: { value: "medium", label: "Medium", color: "#FF9800" },
    HIGH: { value: "high", label: "High", color: "#F44336" },
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
    SEARCH: 300,
    AUTO_SAVE: 500,
    RESIZE: 150,
};
