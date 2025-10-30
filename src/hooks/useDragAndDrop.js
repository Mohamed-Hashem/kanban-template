import { useState, useCallback } from "react";

/**
 * Custom hook for managing drag and drop state
 * Provides utilities for tracking drag operations
 *
 * @returns {Object} Drag state and handlers
 */
export function useDragAndDrop() {
    const [isDragging, setIsDragging] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    const handleDragStart = useCallback((item) => {
        setIsDragging(true);
        setDraggedItem(item);
    }, []);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        setDraggedItem(null);
        setDragOverColumn(null);
    }, []);

    const handleDragOver = useCallback((column) => {
        setDragOverColumn(column);
    }, []);

    const reset = useCallback(() => {
        setIsDragging(false);
        setDraggedItem(null);
        setDragOverColumn(null);
    }, []);

    return {
        isDragging,
        draggedItem,
        dragOverColumn,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        reset,
    };
}
