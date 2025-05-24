import axios from 'axios';

// First, get the CSRF token from the meta tag
const getCSRFToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Get XSRF token from cookie
const getXSRFToken = () => {
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    return xsrfCookie ? decodeURIComponent(xsrfCookie.split('=')[1]) : null;
};

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor to add CSRF token
api.interceptors.request.use(async (config) => {
    // Get CSRF token
    const token = getCSRFToken();
    const xsrfToken = getXSRFToken();

    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }

    // If no CSRF token, try to get a new one
    if (!token || !xsrfToken) {
        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            const newToken = getCSRFToken();
            const newXsrfToken = getXSRFToken();
            if (newToken) config.headers['X-CSRF-TOKEN'] = newToken;
            if (newXsrfToken) config.headers['X-XSRF-TOKEN'] = newXsrfToken;
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
        }
    }

    return config;
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419) {
            // CSRF token mismatch - try to refresh the token
            try {
                await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
                // Retry the original request
                return api.request(error.config);
            } catch (e) {
                console.error('Failed to refresh CSRF token:', e);
                window.location.href = '/customer/login';
                return Promise.reject(e);
            }
        } else if (error.response?.status === 401 || error.response?.status === 403) {
            // Unauthorized or Forbidden - redirect to customer login
            window.location.href = '/customer/login';
        }
        return Promise.reject(error);
    }
);

export default api; 