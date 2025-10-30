import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Chip,
    Box,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tooltip,
} from "@mui/material";
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { formatDate, getRelativeTime, truncateText } from "../../utils";
import { useTasks } from "../../hooks";

/**
 * TaskCard Component - Interactive draggable task card with actions
 * Supports drag and drop, edit, delete, and view operations
 *
 * @param {Object} task - Task object
 * @param {number} index - Index of task in column
 */
const TaskCard = ({ task, index }) => {
    const { editTask, removeTask } = useTasks();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(null); // 'edit', 'delete', 'view'
    const [editedTask, setEditedTask] = useState(task);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = (dialogType) => {
        setOpenDialog(dialogType);
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setOpenDialog(null);
        setEditedTask(task);
    };

    const handleEdit = () => {
        editTask.mutate(editedTask);
        handleDialogClose();
    };

    const handleDelete = () => {
        removeTask.mutate(task.id);
        handleDialogClose();
    };

    const handleInputChange = (field, value) => {
        setEditedTask((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <Draggable draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                    <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                            mb: 2,
                            cursor: "grab",
                            backgroundColor: snapshot.isDragging
                                ? "action.hover"
                                : "background.paper",
                            boxShadow: snapshot.isDragging ? 6 : 1,
                            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                boxShadow: 3,
                                transform: "translateY(-2px)",
                            },
                            position: "relative",
                            overflow: "visible",
                        }}
                    >
                        {/* Drag Handle */}
                        <Box
                            {...provided.dragHandleProps}
                            sx={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                cursor: "grab",
                                color: "action.disabled",
                                "&:hover": { color: "action.active" },
                            }}
                        >
                            <DragIcon fontSize="small" />
                        </Box>

                        <CardContent sx={{ pl: 5, pr: 1, pt: 1, pb: 1 }}>
                            {/* Title */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    mb: 1,
                                    pr: 4,
                                }}
                            >
                                {task.title}
                            </Typography>

                            {/* Description */}
                            {task.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {truncateText(task.description, 80)}
                                </Typography>
                            )}

                            {/* Metadata */}
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                                {task.priority && (
                                    <Chip
                                        label={task.priority}
                                        size="small"
                                        color={
                                            task.priority === "high"
                                                ? "error"
                                                : task.priority === "medium"
                                                  ? "warning"
                                                  : "success"
                                        }
                                        sx={{ height: 20, fontSize: "0.7rem" }}
                                    />
                                )}

                                {task.createdAt && (
                                    <Tooltip title={formatDate(task.createdAt)}>
                                        <Chip
                                            label={getRelativeTime(task.createdAt)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: "0.7rem" }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                        </CardContent>

                        {/* Actions */}
                        <CardActions sx={{ justifyContent: "flex-end", pt: 0, pb: 1 }}>
                            <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: "auto" }}>
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </CardActions>
                    </Card>
                )}
            </Draggable>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={() => handleDialogOpen("view")}>
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={() => handleDialogOpen("edit")}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleDialogOpen("delete")} sx={{ color: "error.main" }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* View Dialog */}
            <Dialog
                open={openDialog === "view"}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Task Details</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {task.description || "No description provided"}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            <strong>Status:</strong> {task.column}
                        </Typography>
                        {task.priority && (
                            <Typography variant="caption" display="block" gutterBottom>
                                <strong>Priority:</strong> {task.priority}
                            </Typography>
                        )}
                        <Typography variant="caption" display="block" gutterBottom>
                            <strong>Created:</strong> {formatDate(task.createdAt)}
                        </Typography>
                        {task.updatedAt && (
                            <Typography variant="caption" display="block">
                                <strong>Updated:</strong> {formatDate(task.updatedAt)}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
                open={openDialog === "edit"}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={editedTask.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={editedTask.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleEdit} variant="contained" disabled={!editedTask.title}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog === "delete"} onClose={handleDialogClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the task "{task.title}"? This action cannot
                        be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskCard;
