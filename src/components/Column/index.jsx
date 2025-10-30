import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, IconButton, Chip } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Add as AddIcon } from "@mui/icons-material";
import TaskCard from "../TaskCard";

/**
 * Column Component - Kanban column with drag-and-drop
 * Displays all tasks in a droppable area
 *
 * @param {Object} column - Column configuration
 * @param {Array} tasks - Tasks to display in this column
 * @param {Function} onAddTask - Callback for adding a new task
 */
const Column = ({ column, tasks, onAddTask }) => {
    const [expanded, setExpanded] = useState(true);

    const handleToggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    const handleAddTask = () => {
        onAddTask && onAddTask(column.id);
    };
    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: column.color,
                borderRadius: 2,
                overflow: "visible", // CRITICAL: Allow dragged items to be visible
                border: `2px solid ${column.accentColor}40`,
            }}
        >
            {/* Column Header */}
            <Box
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    pb: { xs: 1, sm: 1.5 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderBottom: `3px solid ${column.accentColor}`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
                    <IconButton
                        size="small"
                        onClick={handleToggleExpand}
                        sx={{
                            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                            transition: "transform 0.3s ease",
                            color: column.accentColor,
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            color: column.accentColor,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {column.title}
                    </Typography>

                    <Chip
                        label={`${tasks.length}`}
                        size="small"
                        sx={{
                            backgroundColor: column.accentColor,
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            height: { xs: "20px", sm: "24px" },
                            minWidth: { xs: "20px", sm: "24px" },
                            "& .MuiChip-label": {
                                px: { xs: 0.5, sm: 1 },
                            },
                        }}
                    />
                </Box>

                <IconButton
                    size="small"
                    onClick={handleAddTask}
                    sx={{
                        color: column.accentColor,
                        backgroundColor: `${column.accentColor}15`,
                        "&:hover": {
                            backgroundColor: `${column.accentColor}30`,
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                    }}
                    title="Add task"
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Column Description */}
            {expanded && column.description && (
                <Typography
                    variant="caption"
                    sx={{
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.75, sm: 1 },
                        color: "text.secondary",
                        fontStyle: "italic",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        display: "block",
                        borderBottom: `1px solid ${column.accentColor}20`,
                    }}
                >
                    {column.description}
                </Typography>
            )}

            {/* Tasks Container - THE ONLY SCROLL CONTAINER */}
            {expanded && (
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                flex: 1,
                                p: 2,
                                overflowY: "auto", // Only scroll container
                                overflowX: "visible",
                                minHeight: 200,
                                maxHeight: "calc(100vh - 300px)",
                                backgroundColor: snapshot.isDraggingOver
                                    ? `${column.accentColor}15`
                                    : "transparent",
                                transition: "background-color 0.2s ease",
                                // Custom scrollbar
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    borderRadius: "4px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: column.accentColor,
                                    borderRadius: "4px",
                                },
                            }}
                        >
                            {tasks.length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 4,
                                        color: "text.secondary",
                                    }}
                                >
                                    <Typography variant="body2">No tasks yet</Typography>
                                    <Typography variant="caption">
                                        Drag tasks here or click + to add
                                    </Typography>
                                </Box>
                            ) : (
                                tasks.map((task, index) => (
                                    <TaskCard key={task.id} task={task} index={index} />
                                ))
                            )}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            )}
        </Paper>
    );
};

export default Column;
