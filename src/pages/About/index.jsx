import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    CheckCircle as CheckIcon,
    Code as CodeIcon,
    Speed as SpeedIcon,
    Security as SecurityIcon,
} from "@mui/icons-material";

/**
 * About Page - Project information and features
 */
function About() {
    const features = [
        {
            title: "Drag & Drop",
            description: "Smooth drag-and-drop functionality using @hello-pangea/dnd",
            icon: <CheckIcon color="primary" />,
        },
        {
            title: "Real-time Search",
            description: "Debounced search across all tasks with instant filtering",
            icon: <SpeedIcon color="primary" />,
        },
        {
            title: "State Management",
            description: "Advanced Zustand store with persistence and middleware",
            icon: <SecurityIcon color="primary" />,
        },
        {
            title: "React Query",
            description: "Efficient data fetching with caching and optimistic updates",
            icon: <CodeIcon color="primary" />,
        },
    ];

    const techStack = [
        "React 19",
        "Vite",
        "Material-UI",
        "Zustand",
        "React Query",
        "@hello-pangea/dnd",
        "Axios",
        "React Router",
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                    About Kanban Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
                    A modern, feature-rich task management application built with cutting-edge
                    technologies
                </Typography>
            </Box>

            {/* Features */}
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    Key Features
                </Typography>
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Box sx={{ mt: 0.5 }}>{feature.icon}</Box>
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Tech Stack */}
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    Tech Stack
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {techStack.map((tech) => (
                        <Chip key={tech} label={tech} color="primary" variant="outlined" />
                    ))}
                </Box>
            </Paper>

            {/* Implementation Details */}
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                    Implementation Highlights
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Advanced State Management"
                            secondary="Zustand with persistence, immer middleware, and optimistic updates"
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="API Integration"
                            secondary="Axios with interceptors, retry logic, and comprehensive error handling"
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Custom Hooks"
                            secondary="Reusable hooks for debouncing, local storage, drag & drop, and more"
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Component Architecture"
                            secondary="Feature-based organization with constants, utils, and proper separation of concerns"
                        />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Infinite Scroll"
                            secondary="Pagination support in columns for handling large task lists"
                        />
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );
}

export default About;
