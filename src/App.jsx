import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import { TaskUIProvider } from "./context/TaskUIContext.jsx";

const Home = lazy(() => import("./pages/Home"));

function App() {
    return (
        <ErrorBoundary>
            <TaskUIProvider>
                <Suspense fallback={<LoadingFallback />}>
                    <Home />
                </Suspense>
            </TaskUIProvider>
        </ErrorBoundary>
    );
}

export default App;
