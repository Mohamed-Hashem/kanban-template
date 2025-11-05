import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getTasks, createTask, updateTask, deleteTask, patchTask } from "../api";
import { QUERY_KEYS } from "../constants";
import useTaskStore from "../store/taskStore";

export function useTasks() {
    const queryClient = useQueryClient();
    const {
        setTasks,
        addTask: addTaskToStore,
        updateTask: updateTaskInStore,
        removeTask: removeTaskFromStore,
    } = useTaskStore();
    const hasInitialized = useRef(false);

    const {
        data: tasks = [],
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: [QUERY_KEYS.TASKS],
        queryFn: getTasks,
        staleTime: 300000,
        gcTime: 600000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (tasks?.length > 0 && !hasInitialized.current) {
            setTasks(tasks);
            hasInitialized.current = true;
        }
    }, [tasks, setTasks]);

    const addTask = useMutation({
        mutationFn: createTask,
        onMutate: async (newTask) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);
            const optimisticTask = {
                ...newTask,
                id: `temp-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) => [...(old || []), optimisticTask]);
            addTaskToStore(optimisticTask);
            return { previousTasks, optimisticTask };
        },
        onSuccess: (data, _, context) => {
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === context.optimisticTask.id ? data : task))
            );
        },
        onError: (err, _, context) => {
            if (context?.previousTasks)
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
        },
        onSettled: () => queryClient.invalidateQueries([QUERY_KEYS.TASKS]),
    });

    const editTask = useMutation({
        mutationFn: updateTask,
        onMutate: async (updatedTask) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
            updateTaskInStore(updatedTask.id, updatedTask);
            return { previousTasks };
        },
        onError: (err, _, context) => {
            if (context?.previousTasks)
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
        },
        onSettled: () => queryClient.invalidateQueries([QUERY_KEYS.TASKS]),
    });

    const patchTaskMutation = useMutation({
        mutationFn: ({ id, updates }) => patchTask(id, updates),
        onMutate: async ({ id, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            // Optimistically update to new value
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) =>
                    String(task.id) === String(id)
                        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                        : task
                )
            );

            // Update store immediately
            const taskToUpdate = previousTasks?.find((t) => String(t.id) === String(id));
            if (taskToUpdate) {
                updateTaskInStore(id, { ...taskToUpdate, ...updates });
            }

            return { previousTasks };
        },
        onSuccess: (serverData, { id }) => {
            // Update with server response
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (String(task.id) === String(id) ? serverData : task))
            );
            updateTaskInStore(id, serverData);
        },
        onError: (err, { id }, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
                const originalTask = context.previousTasks.find((t) => String(t.id) === String(id));
                if (originalTask) {
                    updateTaskInStore(id, originalTask);
                }
            }
        },
        onSettled: () => {
            // Don't refetch immediately to avoid flickering
            // The optimistic update is already applied
        },
    });

    const removeTask = useMutation({
        mutationFn: deleteTask,
        onMutate: async (id) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).filter((task) => task.id !== id)
            );
            removeTaskFromStore(id);
            return { previousTasks };
        },
        onError: (err, _, context) => {
            if (context?.previousTasks)
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
        },
        onSettled: () => queryClient.invalidateQueries([QUERY_KEYS.TASKS]),
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
    };
}
