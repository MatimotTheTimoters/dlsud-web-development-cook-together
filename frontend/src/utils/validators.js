/**
 * Validation functions for form inputs
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!hasSpecialChar) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is strong' };
};

/**
 * Checks if value is not empty
 * @param {*} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
};

/**
 * Validates number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} True if number is within range
 */
export const validateNumber = (value, min = 0, max = 9999) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const validateUrl = (url) => {
    if (!url) return true; // Allow empty URLs

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validates recipe form data
 * @param {Object} recipeData - Recipe data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateRecipeForm = (recipeData) => {
    const errors = {};

    if (!validateRequired(recipeData.title)) {
        errors.title = 'Recipe title is required';
    } else if (recipeData.title.length > 255) {
        errors.title = 'Recipe title must be less than 255 characters';
    }

    if (recipeData.description && recipeData.description.length > 5000) {
        errors.description = 'Description must be less than 5000 characters';
    }

    if (!validateRequired(recipeData.difficulty)) {
        errors.difficulty = 'Difficulty level is required';
    }

    if (recipeData.preparation_time !== undefined && !validateNumber(recipeData.preparation_time, 0, 1440)) {
        errors.preparation_time = 'Preparation time must be between 0 and 1440 minutes';
    }

    if (recipeData.cooking_time !== undefined && !validateNumber(recipeData.cooking_time, 0, 1440)) {
        errors.cooking_time = 'Cooking time must be between 0 and 1440 minutes';
    }

    if (recipeData.serving_size !== undefined && !validateNumber(recipeData.serving_size, 1, 100)) {
        errors.serving_size = 'Serving size must be between 1 and 100';
    }

    // Validate ingredients
    if (!recipeData.ingredients || !Array.isArray(recipeData.ingredients) || recipeData.ingredients.length === 0) {
        errors.ingredients = 'At least one ingredient is required';
    } else {
        recipeData.ingredients.forEach((ingredient, index) => {
            if (!validateRequired(ingredient.name)) {
                errors[`ingredient_${index}`] = `Ingredient #${index + 1} name is required`;
            }
            if (ingredient.amount !== undefined && !validateNumber(ingredient.amount, 0, 10000)) {
                errors[`ingredient_amount_${index}`] = `Ingredient #${index + 1} amount must be between 0 and 10000`;
            }
        });
    }

    // Validate steps
    if (!recipeData.steps || !Array.isArray(recipeData.steps) || recipeData.steps.length === 0) {
        errors.steps = 'At least one cooking step is required';
    } else {
        recipeData.steps.forEach((step, index) => {
            if (!validateRequired(step.description)) {
                errors[`step_${index}`] = `Step #${index + 1} description is required`;
            }
            if (step.timer_duration !== undefined && !validateNumber(step.timer_duration, 0, 1440)) {
                errors[`step_timer_${index}`] = `Step #${index + 1} timer must be between 0 and 1440`;
            }
        });
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

/**
 * Validates user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateRegistration = (userData) => {
    const errors = {};

    if (!validateRequired(userData.full_name)) {
        errors.full_name = 'Full name is required';
    } else if (userData.full_name.length > 255) {
        errors.full_name = 'Full name must be less than 255 characters';
    }

    if (!validateEmail(userData.email)) {
        errors.email = 'Valid email is required';
    }

    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    if (userData.password !== userData.confirm_password) {
        errors.confirm_password = 'Passwords do not match';
    }

    if (userData.age !== undefined && !validateNumber(userData.age, 13, 120)) {
        errors.age = 'Age must be between 13 and 120';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
};

export default {
    validateEmail,
    validatePassword,
    validateRequired,
    validateNumber,
    validateUrl,
    validateRecipeForm,
    validateRegistration
};