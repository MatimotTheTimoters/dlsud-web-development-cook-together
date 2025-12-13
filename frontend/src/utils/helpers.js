/**
 * General helper utility functions
 */

/**
 * Generates a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
    return 'id_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Creates a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Creates a throttled function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Creates a deep clone of an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Deep cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.reduce((arr, item, i) => {
        arr[i] = deepClone(item);
        return arr;
    }, []);
    if (typeof obj === 'object') return Object.keys(obj).reduce((newObj, key) => {
        newObj[key] = deepClone(obj[key]);
        return newObj;
    }, {});
    return obj;
};

/**
 * Checks if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
export const isEmpty = (obj) => {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
};

/**
 * Merges multiple objects
 * @param {...Object} objects - Objects to merge
 * @returns {Object} Merged object
 */
export const mergeObjects = (...objects) => {
    return objects.reduce((result, current) => {
        return { ...result, ...current };
    }, {});
};

/**
 * Removes null and undefined values from object
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
export const cleanObject = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== null && obj[key] !== undefined) {
            cleaned[key] = obj[key];
        }
    });
    return cleaned;
};

/**
 * Gets value from nested object using dot notation path
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path or default value
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
    const travel = (regexp) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
};

/**
 * Formats a number with commas as thousands separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Delays execution for specified time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts string to slug format
 * @param {string} str - String to convert
 * @returns {string} Slugified string
 */
export const slugify = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Groups array of objects by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
};

export default {
    generateId,
    debounce,
    throttle,
    deepClone,
    isEmpty,
    mergeObjects,
    cleanObject,
    getNestedValue,
    formatNumber,
    delay,
    capitalize,
    slugify,
    groupBy
};