/**
 * Helper functions for task manipulation and validation
 */

/**
 * Validates a task object
 * @param {Object} task - Task object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTask = (task) => {
    const errors = {};

    if (!task.title || task.title.trim() === "") {
        errors.title = "Title is required";
    } else if (task.title.length > 100) {
        errors.title = "Title must be less than 100 characters";
    }

    if (!task.column) {
        errors.column = "Column is required";
    }

    if (task.description && task.description.length > 500) {
        errors.description = "Description must be less than 500 characters";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Filters tasks based on search query
 * @param {Array} tasks - Array of tasks
 * @param {string} searchQuery - Search string
 * @returns {Array} Filtered tasks
 */
export const filterTasks = (tasks, searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") return tasks;

    const query = searchQuery.toLowerCase().trim();

    return tasks.filter((task) => {
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descriptionMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
    });
};

/**
 * Groups tasks by column
 * @param {Array} tasks - Array of tasks
 * @returns {Object} Tasks grouped by column
 */
export const groupTasksByColumn = (tasks) => {
    return tasks.reduce((acc, task) => {
        const column = task.column || "backlog";
        if (!acc[column]) {
            acc[column] = [];
        }
        acc[column].push(task);
        return acc;
    }, {});
};

/**
 * Sorts tasks by a specific field
 * @param {Array} tasks - Array of tasks
 * @param {string} sortBy - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted tasks
 */
export const sortTasks = (tasks, sortBy = "id", order = "asc") => {
    return [...tasks].sort((a, b) => {
        let compareA = a[sortBy];
        let compareB = b[sortBy];

        // Handle dates
        if (sortBy === "createdAt" || sortBy === "updatedAt") {
            compareA = new Date(compareA);
            compareB = new Date(compareB);
        }

        // Handle strings
        if (typeof compareA === "string") {
            compareA = compareA.toLowerCase();
            compareB = compareB.toLowerCase();
        }

        if (order === "asc") {
            return compareA > compareB ? 1 : -1;
        } else {
            return compareA < compareB ? 1 : -1;
        }
    });
};

/**
 * Generates a unique ID for a task
 * @returns {string} Unique ID
 */
export const generateTaskId = () => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formats task data for API submission
 * @param {Object} task - Task object
 * @returns {Object} Formatted task
 */
export const formatTaskForAPI = (task) => {
    return {
        ...task,
        title: task.title?.trim(),
        description: task.description?.trim(),
        column: task.column || "backlog",
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};
