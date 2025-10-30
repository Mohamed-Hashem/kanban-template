import { useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Grid, Box } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks } from "../../hooks";
import useTaskStore from "../../store/taskStore";
import { groupTasksByColumn } from "../../utils";

/**
 * Board Component - Main Kanban board with drag-and-drop functionality
 * Manages task movement between columns and coordinates updates
 *
 * @param {Function} onAddTask - Callback for adding a new task
 */
const Board = ({ onAddTask }) => {
    const { tasks, patchTask } = useTasks();
    const { moveTask: moveTaskInStore } = useTaskStore();

    // Group tasks by column
    const tasksByColumn = groupTasksByColumn(tasks);

    /**
     * Handles drag end event
     * Updates task column when dragged to a new column
     */
    const handleDragEnd = useCallback(
        (result) => {
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

            const taskId = parseInt(draggableId, 10) || draggableId;
            const newColumn = destination.droppableId;
            const oldColumn = source.droppableId;

            // Optimistic update in store
            moveTaskInStore(taskId, newColumn, destination.index);

            // Update via API if column changed
            if (newColumn !== oldColumn) {
                patchTask.mutate({
                    id: taskId,
                    updates: { column: newColumn },
                });
            }
        },
        [moveTaskInStore, patchTask]
    );

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {COLUMN_ORDER.map((column) => (
                        <Grid item xs={12} sm={6} md={3} key={column.id}>
                            <Box sx={{ height: "100%" }}>
                                <Column
                                    column={column}
                                    tasks={tasksByColumn[column.id] || []}
                                    onAddTask={onAddTask}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </DragDropContext>
    );
};

export default Board;
