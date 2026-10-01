import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
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
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Don't auto logout if already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('opspilot_token');
        localStorage.removeItem('opspilot_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
