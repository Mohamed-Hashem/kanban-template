import { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Fab, useTheme, useMediaQuery } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Board from "../../components/Board";
import SearchBar from "../../components/SearchBar";
import AddTaskDialog from "../../components/AddTaskDialog";
import LoadingFallback from "../../components/LoadingFallback";
import { useTasks } from "../../hooks";

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState("backlog");
    const { isLoading } = useTasks();

    const handleAddTask = (columnId) => {
        setSelectedColumn(columnId || "backlog");
        setOpenAddDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenAddDialog(false);
        setSelectedColumn("backlog");
    };

    if (isLoading) {
        return <LoadingFallback />;
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
            <AppBar position="sticky" sx={{ bgcolor: "primary.main", boxShadow: 2 }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, textAlign: "center" }}
                    >
                        Kanban Board
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                <Box sx={{ mb: 3, display: "flex", justifyContent: "center", width: "100%" }}>
                    <Box
                        sx={{
                            width: { xs: "100%", sm: "90%", md: "75%", lg: "60%", xl: "50%" },
                            minWidth: { sm: "50%" },
                        }}
                    >
                        <SearchBar />
                    </Box>
                </Box>
                <Board onAddTask={handleAddTask} />
            </Box>

            <Fab
                color="primary"
                aria-label="add task"
                onClick={() => handleAddTask("backlog")}
                sx={{
                    position: "fixed",
                    bottom: isMobile ? 16 : 32,
                    right: isMobile ? 16 : 32,
                    boxShadow: 4,
                }}
            >
                <AddIcon />
            </Fab>

            <AddTaskDialog
                open={openAddDialog}
                onClose={handleCloseDialog}
                defaultColumn={selectedColumn}
            />
        </Box>
    );
}

export default Home;
