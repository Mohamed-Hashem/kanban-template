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
    const { tasks: fetchedTasks, patchTask } = useTasks();
    const { moveTask: moveTaskInStore, getFilteredTasks, tasks: storeTasks } = useTaskStore();
    const [isDragging, setIsDragging] = useState(false);

    // Use provided tasks, or all tasks from store (not filtered during drag)
    const tasks = propTasks !== undefined ? propTasks : storeTasks;

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
            setIsDragging(false);

            const { destination, source, draggableId } = result;

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

            console.log(`[Drag] Moving task ${taskId} from ${oldColumn} to ${newColumn}`);

            // Optimistic update in store first
            moveTaskInStore(taskId, newColumn, destination.index);

            // Update via API if column changed
            if (newColumn !== oldColumn) {
                patchTask.mutate(
                    {
                        id: taskId,
                        updates: { column: newColumn },
                    },
                    {
                        onError: (error) => {
                            console.error("[Drag] API update failed:", error);
                            // Optionally revert the change here
                        },
                        onSuccess: () => {
                            console.log("[Drag] API update successful");
                        },
                    }
                );
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
                    overflow: "auto",
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
