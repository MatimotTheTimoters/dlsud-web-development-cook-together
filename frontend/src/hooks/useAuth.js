import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context with state and methods
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

// Export as default for backward compatibility
export default useAuth;