import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { STORAGE_KEYS } from "../constants";

const useTaskStore = create(
    persist(
        immer((set, get) => ({
            tasks: [],
            selectedTask: null,
            searchQuery: "",

            setTasks: (tasks) =>
                set((state) => {
                    state.tasks = tasks;
                }),

            addTask: (task) =>
                set((state) => {
                    state.tasks.push(task);
                }),

            updateTask: (id, updates) =>
                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) state.tasks[index] = { ...state.tasks[index], ...updates };
                }),

            removeTask: (id) =>
                set((state) => {
                    state.tasks = state.tasks.filter((t) => t.id !== id);
                }),

            moveTask: (id, newColumn) =>
                set((state) => {
                    const index = state.tasks.findIndex((t) => String(t.id) === String(id));
                    if (index !== -1) {
                        state.tasks[index].column = newColumn;
                        state.tasks[index].updatedAt = new Date().toISOString();
                    }
                }),

            selectTask: (task) =>
                set((state) => {
                    state.selectedTask = task;
                }),
            clearSelectedTask: () =>
                set((state) => {
                    state.selectedTask = null;
                }),

            setSearchQuery: (query) =>
                set((state) => {
                    state.searchQuery = query;
                }),
            clearSearch: () =>
                set((state) => {
                    state.searchQuery = "";
                }),

            getFilteredTasks: () => {
                const { tasks, searchQuery } = get();
                if (!searchQuery) return tasks;
                const query = searchQuery.toLowerCase();
                return tasks.filter(
                    (t) =>
                        t.title?.toLowerCase().includes(query) ||
                        t.description?.toLowerCase().includes(query)
                );
            },
        })),
        {
            name: STORAGE_KEYS.TASK_STORE,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ tasks: state.tasks, searchQuery: state.searchQuery }),
        }
    )
);

export default useTaskStore;
