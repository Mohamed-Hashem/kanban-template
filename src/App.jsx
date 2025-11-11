import ErrorBoundary from "./components/ErrorBoundary";
import { TaskUIProvider } from "./context/TaskUIContext.jsx";
import Home from "./pages/Home";

function App() {
    return (
        <ErrorBoundary>
            <TaskUIProvider>
                <Home />
            </TaskUIProvider>
        </ErrorBoundary>
    );
}

export default App;
