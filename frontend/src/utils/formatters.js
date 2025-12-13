/**
 * Utility functions for formatting data
 */

/**
 * Formats minutes to hours:minutes
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

/**
 * Formats timestamp to readable date
 * @param {string|Date} timestamp - ISO string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Format based on how recent it is
    if (diffDays === 0) {
        // Today
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        // Yesterday
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
        // Within this week
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        // Within this month
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else {
        // Older than a month
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
};

/**
 * Truncates text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Formats currency with commas
 * @param {number} amount - Currency amount
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0';
    return amount.toLocaleString('en-US');
};

/**
 * Capitalizes first letter of each word
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (string) => {
    if (!string) return '';
    return string
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Formats cooking step timer duration
 * @param {number} duration - Timer duration
 * @param {string} unit - Timer unit (seconds, minutes, hours)
 * @returns {string} Formatted timer
 */
export const formatTimer = (duration, unit) => {
    if (!duration) return 'No timer';

    switch (unit) {
        case 'seconds':
            return `${duration} sec`;
        case 'minutes':
            return `${duration} min`;
        case 'hours':
            return `${duration} hour${duration !== 1 ? 's' : ''}`;
        default:
            return `${duration} ${unit}`;
    }
};

/**
 * Formats ingredient amount and unit
 * @param {number} amount - Amount value
 * @param {string} unit - Measurement unit
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount, unit) => {
    if (!amount && amount !== 0) return '';

    let formattedAmount = amount;
    let formattedUnit = unit || '';

    // Handle special cases
    if (unit === 'to taste' || unit === 'pinch' || unit === 'dash') {
        return unit;
    }

    // Format the amount nicely
    if (amount === 0.5) formattedAmount = '½';
    else if (amount === 0.25) formattedAmount = '¼';
    else if (amount === 0.75) formattedAmount = '¾';
    else if (amount === 0.33) formattedAmount = '⅓';
    else if (amount === 0.66) formattedAmount = '⅔';
    else if (Number.isInteger(amount)) {
        formattedAmount = amount.toString();
    } else {
        formattedAmount = amount.toFixed(2).replace(/\.?0+$/, '');
    }

    return `${formattedAmount} ${formattedUnit}`.trim();
};

export default {
    formatTime,
    formatDate,
    truncateText,
    formatCurrency,
    capitalizeFirst,
    formatTimer,
    formatAmount
};