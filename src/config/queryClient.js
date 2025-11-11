import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 300000,
            gcTime: 600000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
            onError: (error) => {
                console.error("Mutation error:", error);
            },
        },
    },
});
