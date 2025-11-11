import { useState, useEffect } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useDebounce, useTaskUI } from "../../hooks";

const SearchBar = () => {
    const [localSearch, setLocalSearch] = useState("");
    const debouncedSearch = useDebounce(localSearch, 300);
    const { setSearchQuery } = useTaskUI();

    useEffect(() => {
        setSearchQuery(debouncedSearch);
    }, [debouncedSearch, setSearchQuery]);

    const handleSearchChange = (event) => {
        setLocalSearch(event.target.value);
    };

    const handleClearSearch = () => {
        setLocalSearch("");
        setSearchQuery("");
    };

    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                display: "flex",
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
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
            />
        </Box>
    );
};

export default SearchBar;
