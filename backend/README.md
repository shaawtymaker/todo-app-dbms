
# PHP Backend for Todo App

This is a simple PHP backend for the Todo App. It provides API endpoints for user authentication, todo management, and list management.

## Setup

1. Make sure you have PHP and MySQL installed on your system.
2. Create a new database called "todo_app".
3. Update the database configuration in `config/database.php` with your database credentials.
4. Place the files in your web server's root directory (e.g., htdocs for XAMPP).
5. The backend should be accessible at http://localhost/backend or http://localhost:8000 depending on your server configuration.

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh authentication token

### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos?list_id=<list_id>` - Get todos by list ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/<id>` - Update todo
- `PUT /api/todos/<id>/toggle` - Toggle todo completion
- `DELETE /api/todos/<id>` - Delete todo

### Lists
- `GET /api/lists` - Get all lists
- `GET /api/lists/<id>` - Get list by ID
- `POST /api/lists` - Create new list
- `PUT /api/lists/<id>` - Update list
- `DELETE /api/lists/<id>` - Delete list
