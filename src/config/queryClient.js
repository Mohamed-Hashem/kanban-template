import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 300000,
            gcTime: 600000,
            refetchOnWindowFocus: false,
        },
        mutations: { retry: 1 },
    },
});
