import { useState, useEffect } from "react";
import { DEBOUNCE_DELAYS } from "../constants";

export function useDebounce(value, delay = DEBOUNCE_DELAYS.SEARCH) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
