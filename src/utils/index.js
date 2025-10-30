export * from "./taskHelpers";
export * from "./dateHelpers";

export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
