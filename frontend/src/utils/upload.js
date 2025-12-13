/**
 * Utility functions for handling file uploads
 */

/**
 * Prepares FormData for multipart file upload
 * @param {File} file - File to upload
 * @param {string} fieldName - Field name for the file
 * @param {Object} additionalData - Additional form data
 * @returns {FormData} FormData object ready for upload
 */
export const prepareFormData = (file, fieldName = 'file', additionalData = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    return formData;
};

/**
 * Validates an image file
 * @param {File} file - Image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result with isValid and message
 */
export const validateImageFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024,
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options;

    if (!file) {
        return { isValid: false, message: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
        };
    }

    return { isValid: true, message: 'File is valid' };
};

/**
 * Creates a data URL for image preview
 * @param {File} file - Image file
 * @returns {Promise<string>} Data URL for the image
 */
export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default {
    prepareFormData,
    validateImageFile,
    createImagePreview
};