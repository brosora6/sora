import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import axios from 'axios';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from 'sonner';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Get CSRF token from meta tag and configure axios
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
}

// Add response interceptor to handle 419 errors
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // Refresh the page to get a new CSRF token
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// Initialize Inertia
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Add CSRF token to Inertia shared props
        props.initialPage.props.csrf_token = csrfToken;

        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
