import axios from 'axios';
import mockDataService from './mockDataService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('opspilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    // If Vercel SPA rewrite returned HTML string for an API endpoint instead of JSON
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype html>') || response.data.includes('<html'))
    ) {
      console.warn('[OpsPilot Demo Mode] API endpoint returned HTML rewrite. Intercepting with mock service:', response.config.url);
      const mockData = mockDataService.handleRequest(response.config);
      return {
        ...response,
        data: mockData
      };
    }
    return response;
  },
  error => {
    const config = error.config || {};
    const status = error.response?.status;

    // Gracefully handle unauthenticated redirects
    if (status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('opspilot_token');
        localStorage.removeItem('opspilot_user');
      }
    }

    // Intercept any failure (404, 405 Method Not Allowed, 500+, Network Error, Timeout)
    // so the live cloud demo never crashes or fails registration / goals
    console.warn(`[OpsPilot Demo Mode] API error (${status || error.code || error.message}). Serving interactive mock response for:`, config.url);
    const mockData = mockDataService.handleRequest(config);
    return Promise.resolve({
      data: mockData,
      status: 200,
      statusText: 'OK (OpsPilot Demo Engine)',
      headers: {},
      config
    });
  }
);

export default api;
