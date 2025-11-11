import { useContext } from "react";
import { TaskUIContext } from "../context/TaskUIContext";

export function useTaskUI() {
    const context = useContext(TaskUIContext);
    if (!context) {
        throw new Error("useTaskUI must be used within TaskUIProvider");
    }
    return context;
}
