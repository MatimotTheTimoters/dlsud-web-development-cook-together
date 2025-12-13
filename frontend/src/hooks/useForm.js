import { useState, useCallback } from 'react';

/**
 * Custom hook for form state management
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and methods
 */
export const useForm = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /**
     * Handles form field changes
     * @param {Event} event - Input change event
     */
    const handleChange = useCallback((event) => {
        const { name, value, type, checked } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Clear error for this field
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }, []);

    /**
     * Handles form submission
     * @param {Function} callback - Submission callback function
     */
    const handleSubmit = useCallback(async (callback) => {
        // Validate form before submission
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await callback(values);
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }, [values]);

    /**
     * Validates form fields
     * @returns {Object} Validation errors object
     */
    const validateForm = useCallback(() => {
        const validationErrors = {};

        // Basic required field validation
        Object.keys(values).forEach(key => {
            if (!values[key] && values[key] !== false && values[key] !== 0) {
                validationErrors[key] = `${key.replace(/_/g, ' ')} is required`;
            }
        });

        return validationErrors;
    }, [values]);

    /**
     * Resets form to initial values
     */
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        validateForm,
        resetForm,
        setValues
    };
};

export default useForm;