import api from './api'; // Assuming you have a base api utility

/**
 * Upload utility functions for handling file uploads
 */

/**
 * Uploads an image file
 * @param {File} file - The image file to upload
 * @param {string} type - Type of image ('profile', 'recipe', 'step')
 * @param {string} userId - User ID for authorization
 * @returns {Promise} Promise with upload result
 */
export const uploadImage = async (file, type, userId) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    formData.append('userId', userId);

    try {
        const response = await api.post('/upload/image.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

/**
 * Prepares FormData for multipart file upload
 * @param {File} file - The file to upload
 * @param {string} fieldName - Field name for the file
 * @param {Object} additionalData - Additional form data
 * @returns {FormData} Prepared FormData object
 */
export const prepareFormData = (file, fieldName = 'image', additionalData = {}) => {
    const formData = new FormData();
    formData.append(fieldName, file);

    Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return formData;
};

/**
 * Validates image file
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result { isValid: boolean, message: string }
 */
export const validateImageFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
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
            message: `File too large. Max size: ${Math.round(maxSize / (1024 * 1024))}MB`
        };
    }

    return { isValid: true, message: 'File is valid' };
};

/**
 * Creates a data URL for image preview
 * @param {File} file - The image file
 * @returns {Promise<string>} Data URL for preview
 */
export const createImagePreview = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default {
    uploadImage,
    prepareFormData,
    validateImageFile,
    createImagePreview,
};