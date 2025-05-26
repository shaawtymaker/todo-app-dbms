
// API base URL - this should be changed according to your backend setup
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API endpoints - make sure these match your backend routes
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  todos: '/todos',
  lists: '/lists',
};

console.log('API configuration loaded:', { 
  API_BASE_URL,
  endpoints: API_ENDPOINTS
});
