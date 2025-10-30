import { useState, useEffect } from "react";

/**
 * Custom hook for detecting window resize and providing viewport dimensions
 * Useful for responsive design and conditional rendering
 *
 * @returns {Object} Width and height of the viewport
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}

/**
 * Custom hook for detecting if viewport matches a media query
 *
 * @param {string} query - Media query string
 * @returns {boolean} True if media query matches
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = () => setMatches(media.matches);

        // Modern approach
        if (media.addEventListener) {
            media.addEventListener("change", listener);
            return () => media.removeEventListener("change", listener);
        } else {
            // Fallback for older browsers
            media.addListener(listener);
            return () => media.removeListener(listener);
        }
    }, [matches, query]);

    return matches;
}
