import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
} from "@mui/material";
import { COLUMN_ORDER, PRIORITIES } from "../../constants";
import { useTasks } from "../../hooks";
import { validateTask } from "../../utils";

/**
 * AddTaskDialog Component - Modal for creating new tasks
 * Provides form validation and column selection
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Callback to close dialog
 * @param {string} defaultColumn - Default column for new task
 */
const AddTaskDialog = ({ open, onClose, defaultColumn = "backlog" }) => {
    const { addTask } = useTasks();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        column: defaultColumn,
        priority: "medium",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = () => {
        // Validate task
        const validation = validateTask(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Create task
        addTask.mutate(formData, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => {
                setErrors({ submit: error.message || "Failed to create task" });
            },
        });
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            title: "",
            description: "",
            column: defaultColumn,
            priority: "medium",
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Title */}
                    <TextField
                        fullWidth
                        label="Task Title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                        required
                        autoFocus
                    />

                    {/* Description */}
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        multiline
                        rows={4}
                    />

                    {/* Column Selection */}
                    <TextField
                        fullWidth
                        select
                        label="Column"
                        value={formData.column}
                        onChange={(e) => handleChange("column", e.target.value)}
                    >
                        {COLUMN_ORDER.map((column) => (
                            <MenuItem key={column.id} value={column.id}>
                                {column.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Priority Selection */}
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        value={formData.priority}
                        onChange={(e) => handleChange("priority", e.target.value)}
                    >
                        {Object.values(PRIORITIES).map((priority) => (
                            <MenuItem key={priority.value} value={priority.value}>
                                {priority.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Error Message */}
                    {errors.submit && (
                        <Box sx={{ color: "error.main", fontSize: "0.875rem" }}>
                            {errors.submit}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!formData.title || addTask.isLoading}
                >
                    {addTask.isLoading ? "Creating..." : "Create Task"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTaskDialog;
