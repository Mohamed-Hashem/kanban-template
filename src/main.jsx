import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.jsx";

/**
 * Configure React Query client
 * Provides caching, background refetching, and error handling
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime in v5)
        },
        mutations: {
            retry: 1,
        },
    },
});

/**
 * Configure Material-UI theme
 * Provides consistent styling across the application
 */
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
        },
        secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
        },
        background: {
            default: "#f5f5f5",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

/**
 * Root application render with all providers
 */
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);
