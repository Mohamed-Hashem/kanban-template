import { useState, useMemo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, Badge, IconButton, Collapse, Divider } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Add as AddIcon } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
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
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: column.color,
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            {/* Column Header */}
            <Box
                sx={{
                    p: 2,
                    pb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={handleToggleExpand}
                        sx={{
                            transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                            transition: "transform 0.2s",
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: column.accentColor,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {column.title}
                    </Typography>

                    <Badge
                        badgeContent={tasks.length}
                        color="primary"
                        sx={{
                            "& .MuiBadge-badge": {
                                backgroundColor: column.accentColor,
                                color: "white",
                                fontWeight: 600,
                            },
                        }}
                    />
                </Box>

                <IconButton
                    size="small"
                    onClick={handleAddTask}
                    sx={{
                        color: column.accentColor,
                        "&:hover": {
                            backgroundColor: `${column.accentColor}20`,
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Column Description */}
            {expanded && column.description && (
                <Typography
                    variant="caption"
                    sx={{
                        px: 2,
                        py: 1,
                        color: "text.secondary",
                        fontStyle: "italic",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                    }}
                >
                    {column.description}
                </Typography>
            )}

            {/* Tasks Container */}
            <Collapse in={expanded} timeout="auto">
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            id={`scrollable-${column.id}`}
                            sx={{
                                flex: 1,
                                p: 2,
                                pt: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                minHeight: 200,
                                maxHeight: "calc(100vh - 250px)",
                                backgroundColor: snapshot.isDraggingOver
                                    ? `${column.accentColor}15`
                                    : "transparent",
                                transition: "background-color 0.2s ease",
                                "&::-webkit-scrollbar": {
                                    width: "8px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: column.accentColor,
                                    borderRadius: "10px",
                                    "&:hover": {
                                        backgroundColor: `${column.accentColor}CC`,
                                    },
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
                                <InfiniteScroll
                                    dataLength={displayedTasks.length}
                                    next={loadMore}
                                    hasMore={hasMore}
                                    loader={
                                        <Typography
                                            variant="caption"
                                            sx={{ textAlign: "center", display: "block", mt: 2 }}
                                        >
                                            Loading more...
                                        </Typography>
                                    }
                                    scrollableTarget={`scrollable-${column.id}`}
                                    endMessage={
                                        tasks.length > PAGINATION.ITEMS_PER_PAGE && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    textAlign: "center",
                                                    display: "block",
                                                    mt: 2,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                All tasks loaded
                                            </Typography>
                                        )
                                    }
                                >
                                    {displayedTasks.map((task, index) => (
                                        <TaskCard key={task.id} task={task} index={index} />
                                    ))}
                                </InfiniteScroll>
                            )}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </Collapse>
        </Paper>
    );
};

export default Column;
