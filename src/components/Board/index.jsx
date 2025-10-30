import { useCallback, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks } from "../../hooks";
import useTaskStore from "../../store/taskStore";
import { groupTasksByColumn } from "../../utils";

/**
 * Board Component - Main Kanban board with drag-and-drop functionality
 * Manages task movement between columns and coordinates updates
 *
 * @param {Array} tasks - Array of tasks to display (can be filtered)
 * @param {Function} onAddTask - Callback for adding a new task
 */
const Board = ({ tasks: propTasks, onAddTask }) => {
    const { patchTask } = useTasks();
    const { moveTask: moveTaskInStore, tasks: storeTasks } = useTaskStore();
    const [isDragging, setIsDragging] = useState(false);

    // Always use store tasks directly (ignore filtered tasks during drag)
    const tasks = storeTasks || [];

    // Group tasks by column
    const tasksByColumn = groupTasksByColumn(tasks);

    /**
     * Handles drag start event
     */
    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    /**
     * Handles drag end event
     * Updates task column when dragged to a new column
     */
    const handleDragEnd = useCallback(
        (result) => {
            const { destination, source, draggableId } = result;

            // Reset dragging state immediately
            setIsDragging(false);

            // Dropped outside a valid droppable
            if (!destination) {
                return;
            }

            // Dropped in the same position
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }

            const taskId = draggableId; // Keep as string
            const newColumn = destination.droppableId;
            const oldColumn = source.droppableId;

            // Only update if column changed
            if (newColumn !== oldColumn) {
                console.log(`[Board] Moving task ${taskId} from ${oldColumn} to ${newColumn}`);
                
                // Optimistic update in store IMMEDIATELY
                moveTaskInStore(taskId, newColumn, destination.index);

                // Update via API (React Query cache will be updated in onSuccess)
                patchTask.mutate({
                    id: taskId,
                    updates: { column: newColumn },
                });
            }
        },
        [moveTaskInStore, patchTask]
    );

    return (
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#f5f7fa",
                    overflow: "visible", // CRITICAL: No nested scroll
                }}
            >
                <Box
                    sx={{
                        p: { xs: 1.5, sm: 2, md: 3 },
                        display: "flex",
                        flexWrap: "wrap",
                        gap: { xs: 1.5, sm: 2, md: 2.5 },
                        width: "100%",
                    }}
                >
                    {COLUMN_ORDER.map((column) => (
                        <Box
                            key={column.id}
                            sx={{
                                // Responsive column widths with equal sizing in each row
                                flex: {
                                    xs: "1 1 100%", // 1 column per row on extra small screens
                                    sm: "1 1 calc(50% - 8px)", // 2 columns per row on small screens
                                    md: "1 1 calc(33.333% - 13.33px)", // 3 columns per row on medium screens
                                    lg: "1 1 calc(25% - 15px)", // 4 columns per row on large screens
                                },
                                minWidth: 0,
                                display: "flex",
                                minHeight: { xs: "400px", sm: "500px", md: "70vh" },
                            }}
                        >
                            <Column
                                column={column}
                                tasks={tasksByColumn[column.id] || []}
                                onAddTask={onAddTask}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </DragDropContext>
    );
};

export default Board;
