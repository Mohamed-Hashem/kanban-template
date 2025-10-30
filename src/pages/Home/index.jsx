import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Fab,
    Tooltip,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import Board from "../../components/Board";
import SearchBar from "../../components/SearchBar";
import AddTaskDialog from "../../components/AddTaskDialog";
import { useTasks } from "../../hooks";
import useTaskStore from "../../store/taskStore";

/**
 * Home Page - Main Kanban Dashboard
 * Orchestrates all components and manages global state
 */
function Home() {
    const { tasks, isLoading, error, refetch, isRefetching } = useTasks();
    const { getFilteredTasks } = useTaskStore();
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState("backlog");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    // Get filtered tasks from store
    const filteredTasks = getFilteredTasks();

    const handleAddTask = (columnId) => {
        setSelectedColumn(columnId || "backlog");
        setAddDialogOpen(true);
    };

    const handleRefresh = async () => {
        try {
            await refetch();
            setSnackbar({
                open: true,
                message: "Tasks refreshed successfully!",
                severity: "success",
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Failed to refresh tasks",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Loading state
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading your tasks...
                </Typography>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={handleRefresh}>
                            Retry
                        </Button>
                    }
                >
                    <Typography variant="h6" gutterBottom>
                        Failed to load tasks
                    </Typography>
                    <Typography variant="body2">
                        {error.message || "An unexpected error occurred"}
                    </Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 8 }}>
            {/* Header */}
            <Box
                sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    py: 3,
                    boxShadow: 3,
                }}
            >
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Kanban Dashboard
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {filteredTasks.length === tasks.length
                                    ? `${tasks.length} total task${tasks.length !== 1 ? "s" : ""}`
                                    : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                                disabled={isRefetching}
                                sx={{
                                    color: "white",
                                    borderColor: "white",
                                    "&:hover": {
                                        borderColor: "white",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                {isRefetching ? "Refreshing..." : "Refresh"}
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleAddTask("backlog")}
                                sx={{
                                    backgroundColor: "white",
                                    color: "primary.main",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    },
                                }}
                            >
                                New Task
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Search and Filter */}
            <Container maxWidth="xl" sx={{ mt: 3 }}>
                <SearchBar />
            </Container>

            {/* Board */}
            <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
                {filteredTasks.length === 0 && tasks.length > 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No tasks match your filters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search or filter criteria
                        </Typography>
                    </Box>
                ) : tasks.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            Welcome to your Kanban Board!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Get started by creating your first task
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddTask("backlog")}
                        >
                            Create First Task
                        </Button>
                    </Box>
                ) : (
                    <Board onAddTask={handleAddTask} />
                )}
            </Container>

            {/* Floating Action Button */}
            <Tooltip title="Add New Task" placement="left">
                <Fab
                    color="primary"
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        boxShadow: 6,
                    }}
                    onClick={() => handleAddTask("backlog")}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>

            {/* Add Task Dialog */}
            <AddTaskDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                defaultColumn={selectedColumn}
            />

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Home;
