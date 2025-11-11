export const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return d.toLocaleDateString("en-US", options);
};

export const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;

    if (diffMs < 0) return formatDate(date);

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const nowYear = now.getFullYear();
    const thenYear = then.getFullYear();
    const nowMonth = now.getMonth();
    const thenMonth = then.getMonth();
    const diffMonths = (nowYear - thenYear) * 12 + (nowMonth - thenMonth);
    const diffYears = nowYear - thenYear;

    if (diffSecs < 10) return "just now";
    if (diffSecs < 60) return `${diffSecs} second${diffSecs === 1 ? "" : "s"} ago`;
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    if (diffMonths < 12) {
        if (diffMonths === 0) return "this month";
        return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    }

    if (diffYears === 1) return "1 year ago";
    if (diffYears < 5) return `${diffYears} years ago`;

    return formatDate(date);
};
