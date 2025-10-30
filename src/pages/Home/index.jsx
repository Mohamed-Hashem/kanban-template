import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Fab,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Brightness4, Brightness7, Add as AddIcon } from "@mui/icons-material";
import Board from "../../components/Board";
import SearchBar from "../../components/SearchBar";
import AddTaskDialog from "../../components/AddTaskDialog";
import useTaskStore from "../../store/taskStore";

function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [darkMode, setDarkMode] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState("backlog");

    const handleToggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleAddTask = (columnId) => {
        setSelectedColumn(columnId || "backlog");
        setOpenAddDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenAddDialog(false);
        setSelectedColumn("backlog");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: darkMode ? "grey.900" : "grey.50",
                transition: "background-color 0.3s",
            }}
        >
            {/* App Bar */}
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: darkMode ? "grey.800" : "primary.main",
                    boxShadow: 2,
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            letterSpacing: 1,
                        }}
                    >
                        Kanban Board
                    </Typography>

                    <IconButton color="inherit" onClick={handleToggleDarkMode} sx={{ mr: 1 }}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                {/* Search Bar */}
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "90%",
                                md: "75%",
                                lg: "60%",
                                xl: "50%",
                            },
                            minWidth: { sm: "50%" },
                        }}
                    >
                        <SearchBar />
                    </Box>
                </Box>

                {/* Kanban Board - No props needed, Board uses store directly */}
                <Board onAddTask={handleAddTask} />
            </Box>

            {/* Floating Action Button */}
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

            {/* Add Task Dialog */}
            <AddTaskDialog
                open={openAddDialog}
                onClose={handleCloseDialog}
                defaultColumn={selectedColumn}
            />
        </Box>
    );
}

export default Home;
