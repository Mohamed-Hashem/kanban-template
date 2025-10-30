import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { Error as ErrorIcon, Refresh as RefreshIcon } from "@mui/icons-material";

/**
 * ErrorBoundary Component - Catches and handles React errors
 * Provides a user-friendly error UI with retry functionality
 */
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "background.default",
                        p: 3,
                    }}
                >
                    <Container maxWidth="md">
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: "center",
                            }}
                        >
                            <ErrorIcon
                                sx={{
                                    fontSize: 80,
                                    color: "error.main",
                                    mb: 2,
                                }}
                            />

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: "error.main",
                                    mb: 2,
                                }}
                            >
                                Oops! Something went wrong
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                {this.state.error?.message || "An unexpected error occurred"}
                            </Typography>

                            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        textAlign: "left",
                                        backgroundColor: "grey.100",
                                        maxHeight: 200,
                                        overflow: "auto",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        component="pre"
                                        sx={{
                                            fontFamily: "monospace",
                                            fontSize: "0.75rem",
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {this.state.errorInfo.componentStack}
                                    </Typography>
                                </Paper>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<RefreshIcon />}
                                onClick={this.handleRetry}
                                sx={{ mt: 2 }}
                            >
                                Reload Application
                            </Button>
                        </Paper>
                    </Container>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
