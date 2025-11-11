import { useState, memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import {
    Card,
    CardContent,
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

const TaskCard = ({ task, index }) => {
    const { editTask, removeTask } = useTasks();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(null);
    const [editedTask, setEditedTask] = useState(task);

    return (
        <>
            <Draggable draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                    <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                            mb: 2,
                            cursor: snapshot.isDragging ? "grabbing !important" : "grab",
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            backgroundColor: snapshot.isDragging
                                ? "primary.light"
                                : "background.paper",
                            boxShadow: snapshot.isDragging ? 8 : 2,
                            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                            transition: snapshot.isDragging
                                ? "none"
                                : "box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease",
                            border: snapshot.isDragging ? "2px solid" : "1px solid",
                            borderColor: snapshot.isDragging ? "primary.main" : "divider",
                            userSelect: "none",
                            willChange: snapshot.isDragging ? "transform, opacity" : "auto",
                            contain: "layout style paint",
                            contentVisibility: "auto",
                            "&:hover": {
                                boxShadow: snapshot.isDragging ? 8 : 4,
                                transform: snapshot.isDragging
                                    ? "rotate(2deg)"
                                    : "translateY(-2px)",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            },
                        }}
                    >
                        <CardContent sx={{ p: 2, pb: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <DragIcon
                                        fontSize="small"
                                        sx={{ color: "action.disabled", flexShrink: 0 }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{ fontSize: "1rem", fontWeight: 600 }}
                                    >
                                        {task.title}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAnchorEl(e.currentTarget);
                                    }}
                                    sx={{ flexShrink: 0 }}
                                >
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {task.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1, mt: 1 }}
                                >
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
                    </Card>
                )}
            </Draggable>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem
                    onClick={() => {
                        setOpenDialog("view");
                        setAnchorEl(null);
                    }}
                >
                    <ViewIcon fontSize="small" sx={{ mr: 1 }} /> View Details
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenDialog("edit");
                        setAnchorEl(null);
                    }}
                >
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenDialog("delete");
                        setAnchorEl(null);
                    }}
                    sx={{ color: "error.main" }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>

            <Dialog
                open={openDialog === "view"}
                onClose={() => setOpenDialog(null)}
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
                    <Button onClick={() => setOpenDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialog === "edit"}
                onClose={() => {
                    setOpenDialog(null);
                    setEditedTask(task);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={editedTask.description || ""}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, description: e.target.value })
                        }
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDialog(null);
                            setEditedTask(task);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            editTask.mutate(editedTask);
                            setOpenDialog(null);
                        }}
                        variant="contained"
                        disabled={!editedTask.title}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog === "delete"} onClose={() => setOpenDialog(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete &quot;{task.title}&quot;?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            removeTask.mutate(task.id);
                            setOpenDialog(null);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default memo(TaskCard);
