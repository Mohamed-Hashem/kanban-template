import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { STORAGE_KEYS } from "../constants";

/**
 * Advanced Zustand store with persistence, immer for immutable updates,
 * and comprehensive task management actions
 */

const useTaskStore = create(
    persist(
        immer((set, get) => ({
            // State
            tasks: [],
            selectedTask: null,
            searchQuery: "",
            filterColumn: null,
            isLoading: false,
            error: null,

            // Actions - Task Management
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
                    const taskIndex = state.tasks.findIndex((t) => t.id === id);
                    if (taskIndex !== -1) {
                        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
                    }
                }),

            removeTask: (id) =>
                set((state) => {
                    state.tasks = state.tasks.filter((t) => t.id !== id);
                }),

            moveTask: (id, newColumn, newIndex) =>
                set((state) => {
                    // Convert to string for comparison since IDs can be strings or numbers
                    const taskIndex = state.tasks.findIndex((t) => String(t.id) === String(id));
                    if (taskIndex !== -1) {
                        // Mutate directly for immer
                        state.tasks[taskIndex].column = newColumn;
                        state.tasks[taskIndex].updatedAt = new Date().toISOString();
                        console.log(
                            `[Store] Moved task ${id} to ${newColumn}`,
                            state.tasks[taskIndex]
                        );
                    } else {
                        console.error(`[Store] Task ${id} not found in tasks array`);
                    }
                }),

            // Actions - Task Selection
            selectTask: (task) =>
                set((state) => {
                    state.selectedTask = task;
                }),

            clearSelectedTask: () =>
                set((state) => {
                    state.selectedTask = null;
                }),

            // Actions - Search and Filter
            setSearchQuery: (query) =>
                set((state) => {
                    state.searchQuery = query;
                }),

            setFilterColumn: (column) =>
                set((state) => {
                    state.filterColumn = column;
                }),

            clearFilters: () =>
                set((state) => {
                    state.searchQuery = "";
                    state.filterColumn = null;
                }),

            // Actions - UI State
            setLoading: (isLoading) =>
                set((state) => {
                    state.isLoading = isLoading;
                }),

            setError: (error) =>
                set((state) => {
                    state.error = error;
                }),

            clearError: () =>
                set((state) => {
                    state.error = null;
                }),

            // Computed getters (called as methods)
            getTasksByColumn: (column) => {
                const state = get();
                return state.tasks.filter((task) => task.column === column);
            },

            getFilteredTasks: () => {
                const state = get();
                let filtered = state.tasks;

                // Apply column filter
                if (state.filterColumn) {
                    filtered = filtered.filter((task) => task.column === state.filterColumn);
                }

                // Apply search query
                if (state.searchQuery) {
                    const query = state.searchQuery.toLowerCase();
                    filtered = filtered.filter(
                        (task) =>
                            task.title?.toLowerCase().includes(query) ||
                            task.description?.toLowerCase().includes(query)
                    );
                }

                return filtered;
            },

            getTaskCount: () => {
                const state = get();
                return state.tasks.length;
            },

            getTaskCountByColumn: (column) => {
                const state = get();
                return state.tasks.filter((task) => task.column === column).length;
            },
        })),
        {
            name: STORAGE_KEYS.TASK_STORE,
            storage: createJSONStorage(() => localStorage),
            // Only persist certain fields
            partialize: (state) => ({
                tasks: state.tasks,
                searchQuery: state.searchQuery,
                filterColumn: state.filterColumn,
            }),
        }
    )
);

export default useTaskStore;
