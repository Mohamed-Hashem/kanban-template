export const validateTask = (task) => {
    const errors = {};
    if (!task.title || task.title.trim() === "") errors.title = "Title is required";
    else if (task.title.length > 100) errors.title = "Title must be less than 100 characters";
    if (!task.column) errors.column = "Column is required";
    if (task.description && task.description.length > 500)
        errors.description = "Description must be less than 500 characters";
    return { isValid: Object.keys(errors).length === 0, errors };
};

export const filterTasks = (tasks, searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") return tasks;
    const query = searchQuery.toLowerCase().trim();
    return tasks.filter((task) => {
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descriptionMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descriptionMatch;
    });
};

export const groupTasksByColumn = (tasks) => {
    return tasks.reduce((acc, task) => {
        const column = task.column || "backlog";
        if (!acc[column]) acc[column] = [];
        acc[column].push(task);
        return acc;
    }, {});
};

export const sortTasks = (tasks, sortBy = "id", order = "asc") => {
    return [...tasks].sort((a, b) => {
        let compareA = a[sortBy];
        let compareB = b[sortBy];
        if (sortBy === "createdAt" || sortBy === "updatedAt") {
            compareA = new Date(compareA);
            compareB = new Date(compareB);
        }
        if (typeof compareA === "string") {
            compareA = compareA.toLowerCase();
            compareB = compareB.toLowerCase();
        }
        return order === "asc" ? (compareA > compareB ? 1 : -1) : compareA < compareB ? 1 : -1;
    });
};

export const generateTaskId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatTaskForAPI = (task) => ({
    ...task,
    title: task.title?.trim(),
    description: task.description?.trim(),
    column: task.column || "backlog",
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});
