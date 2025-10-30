import { useState, useEffect } from "react";
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

const AddTaskDialog = ({ open, onClose, defaultColumn = "backlog" }) => {
    const { addTask } = useTasks();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        column: defaultColumn,
        priority: "medium",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && defaultColumn) setFormData((prev) => ({ ...prev, column: defaultColumn }));
    }, [open, defaultColumn]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleSubmit = () => {
        const validation = validateTask(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        addTask.mutate(formData, {
            onSuccess: () => handleClose(),
            onError: (error) => setErrors({ submit: error.message || "Failed to create task" }),
        });
    };

    const handleClose = () => {
        setFormData({ title: "", description: "", column: defaultColumn, priority: "medium" });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
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
