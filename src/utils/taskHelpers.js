export const validateTask = (task) => {
    const errors = {};
    if (!task.title || task.title.trim() === "") errors.title = "Title is required";
    else if (task.title.length > 100) errors.title = "Title must be less than 100 characters";
    if (!task.column) errors.column = "Column is required";
    if (task.description && task.description.length > 500)
        errors.description = "Description must be less than 500 characters";
    return { isValid: Object.keys(errors).length === 0, errors };
};

export const groupTasksByColumn = (tasks) => {
    return tasks.reduce((acc, task) => {
        const column = task.column || "backlog";
        if (!acc[column]) acc[column] = [];
        acc[column].push(task);
        return acc;
    }, {});
};
