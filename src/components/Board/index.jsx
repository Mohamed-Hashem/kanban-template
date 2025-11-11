import { useCallback, useRef, useOptimistic, useTransition, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box, CircularProgress, Fade } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks, useTaskUI } from "../../hooks";
import { groupTasksByColumn } from "../../utils";

const Board = ({ onAddTask }) => {
    const { tasks: allTasks, patchTask } = useTasks();
    const { searchQuery } = useTaskUI();
    const updateTimeoutRef = useRef(null);
    const [isPending, startTransition] = useTransition();

    const tasks = useMemo(() => {
        if (!searchQuery) return allTasks;
        const query = searchQuery.toLowerCase();
        return allTasks.filter(
            (t) =>
                t.title?.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query)
        );
    }, [allTasks, searchQuery]);

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
                updateOptimisticTasks({ taskId: draggableId, newColumn });

                if (updateTimeoutRef.current) {
                    clearTimeout(updateTimeoutRef.current);
                }

                updateTimeoutRef.current = setTimeout(() => {
                    startTransition(() => {
                        patchTask.mutate({ id: draggableId, updates: { column: newColumn } });
                    });
                }, 100);
            }
        },
        [patchTask, updateOptimisticTasks]
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
                                    md: "1 1 calc(50% - 10px)",
                                    lg: "1 1 calc(25% - 15px)",
                                },
                                minWidth: 0,
                                display: "flex",
                                minHeight: { xs: "60vh", sm: "60vh", md: "60vh" },
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
