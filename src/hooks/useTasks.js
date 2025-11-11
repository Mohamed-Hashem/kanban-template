import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask, patchTask } from "../api";
import { QUERY_KEYS } from "../constants";

export function useTasks() {
    const queryClient = useQueryClient();

    const {
        data: tasks = [],
        isLoading,
        error,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: [QUERY_KEYS.TASKS],
        queryFn: getTasks,
    });

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
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);

            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);

            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) =>
                    String(task.id) === String(id)
                        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                        : task
                )
            );

            return { previousTasks };
        },
        onSuccess: (serverData, { id }) => {
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).map((task) => (String(task.id) === String(id) ? serverData : task))
            );
        },
        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData([QUERY_KEYS.TASKS], context.previousTasks);
            }
        },
        onSettled: () => {},
    });

    const removeTask = useMutation({
        mutationFn: deleteTask,
        onMutate: async (id) => {
            await queryClient.cancelQueries([QUERY_KEYS.TASKS]);
            const previousTasks = queryClient.getQueryData([QUERY_KEYS.TASKS]);
            queryClient.setQueryData([QUERY_KEYS.TASKS], (old) =>
                (old || []).filter((task) => task.id !== id)
            );
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
