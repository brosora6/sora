import axios from 'axios';
import { router } from '@inertiajs/react';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Add a response interceptor to handle 401 responses
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            router.visit('/login');
        }
        return Promise.reject(error);
    }
); 