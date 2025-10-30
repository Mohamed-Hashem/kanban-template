import { useState, useMemo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, IconButton, Divider, Chip } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Add as AddIcon } from "@mui/icons-material";
import TaskCard from "../TaskCard";
import { PAGINATION } from "../../constants";

/**
 * Column Component - Kanban column with drag-and-drop and infinite scroll
 * Displays tasks in a droppable area with pagination support
 *
 * @param {Object} column - Column configuration
 * @param {Array} tasks - Tasks to display in this column
 * @param {Function} onAddTask - Callback for adding a new task
 */
const Column = ({ column, tasks, onAddTask }) => {
    const [expanded, setExpanded] = useState(true);
    const [displayCount, setDisplayCount] = useState(PAGINATION.ITEMS_PER_PAGE);

    // Paginated tasks
    const displayedTasks = useMemo(() => {
        return tasks.slice(0, displayCount);
    }, [tasks, displayCount]);

    const hasMore = displayCount < tasks.length;

    const loadMore = () => {
        setDisplayCount((prev) => prev + PAGINATION.ITEMS_PER_PAGE);
    };

    const handleToggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    const handleAddTask = () => {
        onAddTask && onAddTask(column.id);
    };
    return (
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: column.color,
                borderRadius: { xs: 2, md: 3 },
                overflow: "hidden",
                border: `2px solid ${column.accentColor}40`,
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                },
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

            {/* Tasks Container */}
            {expanded && (
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                flex: 1,
                                p: { xs: 1.5, sm: 2 },
                                pt: { xs: 1, sm: 1.5 },
                                overflowY: "auto",
                                overflowX: "hidden",
                                minHeight: { xs: 150, sm: 200 },
                                maxHeight: { xs: "calc(100vh - 250px)", sm: "calc(100vh - 280px)" },
                                backgroundColor: snapshot.isDraggingOver
                                    ? `${column.accentColor}20`
                                    : "transparent",
                                transition: "background-color 0.3s ease",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: column.accentColor,
                                    borderRadius: "10px",
                                    "&:hover": {
                                        backgroundColor: `${column.accentColor}DD`,
                                    },
                                },
                            }}
                        >
                            {tasks.length === 0 ? (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: { xs: 3, sm: 4 },
                                        color: "text.secondary",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                                    >
                                        No tasks yet
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                                    >
                                        Drag tasks here or click + to add
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    {displayedTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} />
                                    ))}
                                    {hasMore && (
                                        <Box
                                            sx={{
                                                textAlign: "center",
                                                mt: 2,
                                                mb: 1,
                                            }}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={loadMore}
                                                sx={{
                                                    color: column.accentColor,
                                                    border: `2px dashed ${column.accentColor}60`,
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 0.5,
                                                    "&:hover": {
                                                        backgroundColor: `${column.accentColor}15`,
                                                        borderColor: column.accentColor,
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                                                >
                                                    Load more ({tasks.length - displayCount}{" "}
                                                    remaining)
                                                </Typography>
                                            </IconButton>
                                        </Box>
                                    )}
                                </>
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
