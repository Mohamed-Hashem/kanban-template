import { useCallback, useRef, useOptimistic, useTransition } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box, CircularProgress, Fade } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks } from "../../hooks";
import useTaskStore from "../../store/taskStore";
import { groupTasksByColumn } from "../../utils";

const Board = ({ onAddTask }) => {
    const { patchTask } = useTasks();
    const { moveTask: moveTaskInStore, getFilteredTasks } = useTaskStore();
    const updateTimeoutRef = useRef(null);
    const [isPending, startTransition] = useTransition();

    const tasks = getFilteredTasks();

    // useOptimistic for instant UI updates
    const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
        tasks,
        (currentTasks, { taskId, newColumn }) => {
            return currentTasks.map((task) =>
                String(task.id) === String(taskId)
                    ? { ...task, column: newColumn, updatedAt: new Date().toISOString() }
                    : task
            );
        }
    );

    const tasksByColumn = groupTasksByColumn(optimisticTasks);

    const handleDragEnd = useCallback(
        (result) => {
            const { destination, source, draggableId } = result;

            if (!destination) return;
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
                return;

            const newColumn = destination.droppableId;
            const oldColumn = source.droppableId;

            if (newColumn !== oldColumn) {
                // Instant optimistic update
                updateOptimisticTasks({ taskId: draggableId, newColumn });

                // Wrap state updates in transition
                startTransition(() => {
                    // Update store (non-urgent)
                    moveTaskInStore(draggableId, newColumn);
                });

                // Clear any pending update
                if (updateTimeoutRef.current) {
                    clearTimeout(updateTimeoutRef.current);
                }

                // Debounced API call
                updateTimeoutRef.current = setTimeout(() => {
                    patchTask.mutate({ id: draggableId, updates: { column: newColumn } });
                }, 100);
            }
        },
        [moveTaskInStore, patchTask, updateOptimisticTasks]
    );

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#f5f7fa",
                    overflow: "visible",
                    position: "relative",
                }}
            >
                {/* Loading indicator for pending transitions */}
                <Fade in={isPending}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            zIndex: 1000,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            backgroundColor: "background.paper",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <CircularProgress size={16} />
                        <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Syncing...</Box>
                    </Box>
                </Fade>

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
                                flex: {
                                    xs: "1 1 100%",
                                    sm: "1 1 calc(50% - 8px)",
                                    md: "1 1 calc(33.333% - 13.33px)",
                                    lg: "1 1 calc(25% - 15px)",
                                },
                                minWidth: 0,
                                display: "flex",
                                minHeight: { xs: "400px", sm: "500px", md: "70vh" },
                                opacity: isPending ? 0.7 : 1,
                                transition: "opacity 0.2s ease",
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
