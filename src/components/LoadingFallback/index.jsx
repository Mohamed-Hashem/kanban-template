import { Box, CircularProgress } from "@mui/material";

const LoadingFallback = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#f5f7fa",
            flexDirection: "column",
            gap: 2,
        }}
    >
        <CircularProgress size={60} thickness={4} />
        <Box sx={{ fontSize: "1.1rem", color: "text.secondary", fontWeight: 500 }}>
            Loading your Kanban board...
        </Box>
    </Box>
);

export default LoadingFallback;
