
// API base URL - change this to point to your PHP backend
export const API_BASE_URL = 'http://localhost/todo-app-dbms/backend/api/index.php';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  todos: '/api/todos',
  lists: '/api/lists',
};
