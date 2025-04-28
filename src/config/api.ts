
// API base URL - change this to point to your PHP backend
export const API_BASE_URL = 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: 'http://localhost/todo-app-dbms/backend/index.php/api/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  todos: '/todos',
  lists: '/lists',
};
