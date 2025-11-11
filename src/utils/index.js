export * from "./taskHelpers";
export * from "./dateHelpers";

export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};
