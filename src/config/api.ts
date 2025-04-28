
// API base URL - change this to point to your PHP backend
export const API_BASE_URL = 'http://localhost/todo-app-dbms/backend';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/index.php/api/auth/login',
    register: '/index.php/api/auth/register',
    logout: '/index.php/api/auth/logout',
    refresh: '/index.php/api/auth/refresh',
  },
  todos: '/index.php/api/todos',
  lists: '/index.php/api/lists',
};
