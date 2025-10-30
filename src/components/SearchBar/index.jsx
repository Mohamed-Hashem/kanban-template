import { useState } from "react";
import { Box, TextField, InputAdornment, IconButton, Chip, Tooltip, Paper } from "@mui/material";
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    FilterList as FilterIcon,
} from "@mui/icons-material";
import { useDebounce } from "../../hooks";
import useTaskStore from "../../store/taskStore";
import { COLUMN_ORDER } from "../../constants";

/**
 * SearchBar Component - Global search and filter for tasks
 * Provides real-time search with debouncing and column filtering
 */
const SearchBar = () => {
    const [localSearch, setLocalSearch] = useState("");
    const debouncedSearch = useDebounce(localSearch, 300);

    const { searchQuery, filterColumn, setSearchQuery, setFilterColumn, clearFilters } =
        useTaskStore();

    // Update store with debounced value
    useState(() => {
        if (debouncedSearch !== searchQuery) {
            setSearchQuery(debouncedSearch);
        }
    }, [debouncedSearch]);

    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value);
    };

    const handleClearSearch = () => {
        setLocalSearch("");
        setSearchQuery("");
    };

    const handleFilterClick = (columnId) => {
        if (filterColumn === columnId) {
            setFilterColumn(null);
        } else {
            setFilterColumn(columnId);
        }
    };

    const handleClearFilters = () => {
        handleClearSearch();
        clearFilters();
    };

    const hasActiveFilters = localSearch || filterColumn;

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {/* Search Input */}
            <TextField
                fullWidth
                placeholder="Search tasks by title or description..."
                value={localSearch}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: localSearch && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "background.paper",
                    },
                }}
            />

            {/* Filter Chips */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                <Tooltip title="Filter by column">
                    <FilterIcon sx={{ color: "action.active", mr: 1 }} fontSize="small" />
                </Tooltip>

                {COLUMN_ORDER.map((column) => (
                    <Chip
                        key={column.id}
                        label={column.title}
                        onClick={() => handleFilterClick(column.id)}
                        variant={filterColumn === column.id ? "filled" : "outlined"}
                        sx={{
                            backgroundColor:
                                filterColumn === column.id ? column.accentColor : "transparent",
                            color: filterColumn === column.id ? "white" : "text.primary",
                            borderColor: column.accentColor,
                            "&:hover": {
                                backgroundColor:
                                    filterColumn === column.id
                                        ? column.accentColor
                                        : `${column.accentColor}20`,
                            },
                        }}
                    />
                ))}

                {hasActiveFilters && (
                    <Chip
                        label="Clear All"
                        onClick={handleClearFilters}
                        color="error"
                        variant="outlined"
                        deleteIcon={<ClearIcon />}
                        onDelete={handleClearFilters}
                        sx={{ ml: "auto" }}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default SearchBar;
