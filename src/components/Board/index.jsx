import { useCallback, useOptimistic, useTransition, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box, CircularProgress, Typography } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks, useTaskUI } from "../../hooks";
import { groupTasksByColumn } from "../../utils";

const Board = ({ onAddTask }) => {
    const { tasks: allTasks, patchTask } = useTasks();
    const { searchQuery } = useTaskUI();
    const [, startTransition] = useTransition();

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
        (currentTasks, { taskId, newColumn, newOrder }) => {
            return currentTasks.map((task) =>
                String(task.id) === String(taskId)
                    ? {
                          ...task,
                          column: newColumn,
                          order: newOrder !== undefined ? newOrder : task.order,
                          updatedAt: new Date().toISOString(),
                      }
                    : task
            );
        }
    );

    const tasksByColumn = groupTasksByColumn(optimisticTasks);

    const handleDragEnd = useCallback(
        (result) => {
            if (patchTask.isPending) return;

            const { destination, source, draggableId } = result;

            if (!destination) return;
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            )
                return;

            const sourceColumn = source.droppableId;
            const destColumn = destination.droppableId;
            const newIndex = destination.index;

            const sourceTasks = (tasksByColumn[sourceColumn] || []).sort(
                (a, b) => (a.order || 0) - (b.order || 0)
            );
            const destTasks = (tasksByColumn[destColumn] || []).sort(
                (a, b) => (a.order || 0) - (b.order || 0)
            );

            const draggedTask = sourceTasks.find((t) => String(t.id) === String(draggableId));
            if (!draggedTask) return;

            const tasksToConsider =
                sourceColumn === destColumn
                    ? destTasks.filter((t) => String(t.id) !== String(draggableId))
                    : destTasks;

            let newOrder;
            if (tasksToConsider.length === 0) {
                newOrder = 1000;
            } else if (newIndex === 0) {
                newOrder = tasksToConsider[0].order - 1000;
            } else if (newIndex >= tasksToConsider.length) {
                newOrder = tasksToConsider[tasksToConsider.length - 1].order + 1000;
            } else {
                const prevOrder = tasksToConsider[newIndex - 1].order || 0;
                const nextOrder = tasksToConsider[newIndex].order || 2000;
                newOrder = Math.floor((prevOrder + nextOrder) / 2);
            }

            startTransition(() => {
                updateOptimisticTasks({ taskId: draggableId, newColumn: destColumn, newOrder });
            });

            startTransition(() => {
                patchTask.mutate({
                    id: draggableId,
                    updates: { column: destColumn, order: newOrder },
                });
            });
        },
        [patchTask, updateOptimisticTasks, tasksByColumn]
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
                {patchTask.isPending && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9998,
                            backgroundColor: "rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(2px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "fadeIn 0.1s ease-out",
                            "@keyframes fadeIn": {
                                from: { opacity: 0 },
                                to: { opacity: 1 },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                                backgroundColor: "white",
                                px: 4,
                                py: 3,
                                borderRadius: 3,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                minWidth: 240,
                                animation: "scaleIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                "@keyframes scaleIn": {
                                    from: {
                                        opacity: 0,
                                        transform: "scale(0.9)",
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: "scale(1)",
                                    },
                                },
                            }}
                        >
                            <CircularProgress size={40} thickness={4} />
                            <Typography
                                sx={{
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    color: "text.primary",
                                }}
                            >
                                Syncing...
                            </Typography>
                        </Box>
                    </Box>
                )}

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
                                transition: "opacity 0.2s ease",
                                opacity: patchTask.isPending ? 0.8 : 1,
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
