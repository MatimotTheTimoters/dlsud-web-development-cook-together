/**
 * Application constants and configuration values
 */

// Environment configuration
export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = ENVIRONMENT === 'production';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost/backend/api';
export const API_TIMEOUT = 30000;

// Storage Keys
export const TOKEN_STORAGE_KEY = 'cooktogether_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'cooktogether_refresh_token';
export const USER_DATA_KEY = 'cooktogether_user_data';
export const USER_SETTINGS_KEY = 'cooktogether_user_settings';

// Gamification Constants
export const LEVEL_THRESHOLDS = {
    1: 0,
    2: 100,
    3: 300,
    5: 1000,
    10: 5000,
    15: 15000,
    20: 30000,
    25: 60000,
    30: 100000,
    40: 200000,
    50: 500000
};

export const LEVEL_TITLES = {
    1: 'Novice Cook',
    2: 'Kitchen Helper',
    3: 'Home Chef',
    5: 'Sous Chef',
    10: 'Head Chef',
    15: 'Master Chef',
    20: 'Culinary Artist',
    25: 'Kitchen Wizard',
    30: 'Recipe Sage',
    40: 'Culinary Master',
    50: 'Grandmaster Chef'
};

// Recipe Constants
export const DIFFICULTY_OPTIONS = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
];

export const CUISINE_OPTIONS = [
    'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Thai',
    'French', 'Mediterranean', 'American', 'Middle Eastern', 'Other'
];

export const UNIT_OPTIONS = [
    'grams', 'kilograms', 'milliliters', 'liters', 'cups', 'tablespoons',
    'teaspoons', 'pieces', 'slices', 'pinch', 'dash', 'to taste'
];

// Cooking Session Constants
export const SESSION_STATUS = {
    planned: 'Planned',
    preparing: 'Preparing',
    cooking: 'Cooking',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled',
    abandoned: 'Abandoned'
};

export const SESSION_VISIBILITY = {
    private: 'Private',
    friends_only: 'Friends Only',
    public: 'Public'
};

export const SESSION_MODE = {
    solo: 'Solo',
    multiplayer: 'Multiplayer'
};

export const PARTICIPANT_ROLES = {
    host: 'Host',
    participant: 'Participant',
    spectator: 'Spectator'
};

// Shop Constants
export const SHOP_CATEGORIES = [
    'avatar', 'tool', 'recipe', 'boost', 'currency', 'consumable'
];

export const ITEM_TYPES = {
    boost: 'Boost',
    currency: 'Currency',
    consumable: 'Consumable'
};

// UI Constants
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const RECIPE_PAGE_SIZE = 12;
export const USER_PAGE_SIZE = 24;

// Colors (from themes.css)
export const COLORS = {
    chefRed: '#FF6B6B',
    sizzlingOrange: '#FF9F43',
    creamyWhite: '#F9F9F9',
    warmGray: '#2D3436',
    goldCoin: '#FFD93D',
    rareGem: '#6C5CE7',
    xpPurple: '#A55EEA',
    successGreen: '#2ECC71'
};

// Helper function to get API URL based on environment
export const getApiUrl = () => {
    return API_BASE_URL;
};

// Helper function to get difficulty options for forms
export const getDifficultyOptions = () => DIFFICULTY_OPTIONS;

// Helper function to get cuisine options
export const getCuisineOptions = () => CUISINE_OPTIONS;

// Helper function to get unit options
export const getUnitOptions = () => UNIT_OPTIONS;

// Helper function to get level thresholds
export const getLevelThresholds = () => LEVEL_THRESHOLDS;

// Helper function to get shop categories
export const getShopCategories = () => SHOP_CATEGORIES;

// Helper function to get session status labels
export const getSessionStatusLabels = () => SESSION_STATUS;

export default {
    ENVIRONMENT,
    IS_PRODUCTION,
    API_BASE_URL,
    API_TIMEOUT,
    TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY,
    USER_DATA_KEY,
    USER_SETTINGS_KEY,
    LEVEL_THRESHOLDS,
    LEVEL_TITLES,
    DIFFICULTY_OPTIONS,
    CUISINE_OPTIONS,
    UNIT_OPTIONS,
    SESSION_STATUS,
    SESSION_VISIBILITY,
    SESSION_MODE,
    PARTICIPANT_ROLES,
    SHOP_CATEGORIES,
    ITEM_TYPES,
    MAX_UPLOAD_SIZE,
    ALLOWED_IMAGE_TYPES,
    DEFAULT_PAGE_SIZE,
    RECIPE_PAGE_SIZE,
    USER_PAGE_SIZE,
    COLORS,
    getApiUrl,
    getDifficultyOptions,
    getCuisineOptions,
    getUnitOptions,
    getLevelThresholds,
    getShopCategories,
    getSessionStatusLabels
};