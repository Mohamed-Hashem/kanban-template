import { createContext, useState, useMemo } from "react";

export const TaskUIContext = createContext(null);

export function TaskUIProvider({ children }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const value = useMemo(
        () => ({
            selectedTask,
            setSelectedTask,
            searchQuery,
            setSearchQuery,
            clearSearch: () => setSearchQuery(""),
        }),
        [selectedTask, searchQuery]
    );

    return <TaskUIContext.Provider value={value}>{children}</TaskUIContext.Provider>;
}
