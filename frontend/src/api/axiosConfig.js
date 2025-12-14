import axios from 'axios';

// Use port 80 (default Apache), not 8080
const API_BASE_URL = 'http://localhost:8080/dlsud-web-development-cook-together/backend/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;