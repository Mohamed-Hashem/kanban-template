import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask, patchTask } from "../api";
import { QUERY_KEYS } from "../constants";
import useTaskStore from "../store/taskStore";

/**
 * Enhanced React Query hook for task management
 * Integrates with Zustand store for optimistic updates and caching
 */
export function useTasks() {
    const queryClient = useQueryClient();
    const {
        setTasks,
        addTask: addTaskToStore,
        updateTask: updateTaskInStore,
        removeTask: removeTaskFromStore,
    } = useTaskStore();

    // Fetch all tasks
    const {
        data: tasks = [],
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: [QUERY_KEYS.TASKS],
        queryFn: getTasks,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    });

    // Sync tasks with Zustand store when data changes
    useEffect(() => {
        if (tasks && tasks.length > 0) {
            setTasks(tasks);
        }
    }, [tasks]); // Remove setTasks from dependencies to prevent infinite loop

    // Log errors when they occur
    useEffect(() => {
        if (error) {
            console.error("[useTasks] Error fetching tasks:", error);
        }
    }, [error]);

    // Create task mutation
    const addTask = useMutation({
        mutationFn: createTask,
        onMutate: async (newTask) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            // Optimistically update
            const optimisticTask = {
                ...newTask,
                id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) => [...(old || []), optimisticTask]);
            addTaskToStore(optimisticTask);

            return { previousTasks, optimisticTask };
        },
        onSuccess: (data, variables, context) => {
            // Replace optimistic task with real one
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === context.optimisticTask.id ? data : task))
            );
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
            }
            console.error("[useTasks] Error creating task:", error);
        },
        onSettled: () => {
            // Always refetch after mutation
            queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
        },
    });

    // Update task mutation
    const editTask = useMutation({
        mutationFn: updateTask,
        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            // Optimistic update
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
            updateTaskInStore(updatedTask.id, updatedTask);

            return { previousTasks };
        },
        onError: (error, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
            }
            console.error("[useTasks] Error updating task:", error);
        },
        onSettled: () => {
            queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
        },
    });

    // Patch task mutation (partial update)
    const patchTaskMutation = useMutation({
        mutationFn: ({ id, updates }) => patchTask(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            // Optimistic update
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === id ? { ...task, ...updates } : task))
            );
            updateTaskInStore(id, updates);

            return { previousTasks };
        },
        onSuccess: (data, { id, updates }) => {
            // Update with server response
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === id ? data : task))
            );
            updateTaskInStore(id, data);
        },
        onError: (error, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
            }
            console.error("[useTasks] Error patching task:", error);
        },
        // Don't invalidate queries on drag operations - rely on optimistic updates
    });

    // Delete task mutation
    const removeTask = useMutation({
        mutationFn: deleteTask,
        onMutate: async (id) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            // Optimistic delete
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).filter((task) => task.id !== id)
            );
            removeTaskFromStore(id);

            return { previousTasks };
        },
        onError: (error, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
            }
            console.error("[useTasks] Error deleting task:", error);
        },
        onSettled: () => {
            queryClient.invalidateQueries([QUERY_KEYS.TASKS]);
        },
    });

    return {
        tasks,
        isLoading,
        isRefetching,
        error,
        refetch,
        addTask,
        editTask,
        patchTask: patchTaskMutation,
        removeTask,
        // Computed values
        taskCount: tasks.length,
        isEmpty: tasks.length === 0,
    };
}
