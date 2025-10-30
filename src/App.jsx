import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./MainLayout";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

/**
 * App Component - Root application component
 * Sets up routing, error boundaries, and lazy loading
 */
function App() {
    const LoadingFallback = (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            <CircularProgress size={60} />
        </Box>
    );

    return (
        <Router>
            <ErrorBoundary>
                <Suspense fallback={LoadingFallback}>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="about" element={<About />} />
                        </Route>
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
