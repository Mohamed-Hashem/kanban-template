import { Box, CircularProgress } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

/**
 * App Component - Root application component
 * Simple single-page application without routing
 */
function App() {
    return (
        <ErrorBoundary>
            <Home />
        </ErrorBoundary>
    );
}

export default App;
