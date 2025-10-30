import { useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import Column from "../Column";
import { COLUMN_ORDER } from "../../constants";
import { useTasks } from "../../hooks";
import useTaskStore from "../../store/taskStore";
import { groupTasksByColumn } from "../../utils";

const Board = ({ onAddTask }) => {
    const { patchTask } = useTasks();
    const { moveTask: moveTaskInStore, getFilteredTasks } = useTaskStore();

    const tasks = getFilteredTasks();
    const tasksByColumn = groupTasksByColumn(tasks);

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
                moveTaskInStore(draggableId, newColumn);
                patchTask.mutate({ id: draggableId, updates: { column: newColumn } });
            }
        },
        [moveTaskInStore, patchTask]
    );

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Box sx={{ width: "100%", backgroundColor: "#f5f7fa", overflow: "visible" }}>
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
