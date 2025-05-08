
<?php
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../models/todo.php';

class TodoController {
    private $todo_model;
    private $auth_middleware;
    
    public function __construct() {
        $this->todo_model = new Todo();
        $this->auth_middleware = new AuthMiddleware();
    }
    
    public function getAll() {
        // Authenticate the user
        $user = $this->auth_middleware->authenticate();
        
        // Get query parameters
        $list_id = $_GET['list_id'] ?? null;
        
        // Get todos for user
        if ($list_id) {
            $todos = $this->todo_model->findByUserAndList($user['id'], $list_id);
        } else {
            $todos = $this->todo_model->findByUser($user['id']);
        }
        
        echo json_encode($todos);
    }
    
    public function getById($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Get todo
        $todo = $this->todo_model->findById($id);
        
        if (!$todo || $todo['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'Todo not found']);
            return;
        }
        
        echo json_encode($todo);
    }
    
    public function create() {
        $user = $this->auth_middleware->authenticate();
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate data
        if (!isset($data['text']) || !isset($data['list_id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Text and list_id are required']);
            return;
        }
        
        // Add user_id to data
        $data['user_id'] = $user['id'];
        $data['completed'] = false; // Set default value
        
        // Create todo
        $todo_id = $this->todo_model->create($data);
        
        if (!$todo_id) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create todo']);
            return;
        }
        
        // Get created todo
        $todo = $this->todo_model->findById($todo_id);
        
        echo json_encode($todo);
    }
    
    public function update($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Get todo
        $todo = $this->todo_model->findById($id);
        
        if (!$todo || $todo['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'Todo not found']);
            return;
        }
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Update todo
        $success = $this->todo_model->update($id, $data);
        
        if (!$success) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update todo']);
            return;
        }
        
        // Get updated todo
        $todo = $this->todo_model->findById($id);
        
        echo json_encode($todo);
    }
    
    public function toggle($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Get todo
        $todo = $this->todo_model->findById($id);
        
        if (!$todo || $todo['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'Todo not found']);
            return;
        }
        
        // Toggle completed status
        $success = $this->todo_model->update($id, [
            'completed' => !$todo['completed']
        ]);
        
        if (!$success) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to toggle todo']);
            return;
        }
        
        // Get updated todo
        $todo = $this->todo_model->findById($id);
        
        echo json_encode($todo);
    }
    
    public function delete($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Get todo
        $todo = $this->todo_model->findById($id);
        
        if (!$todo || $todo['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'Todo not found']);
            return;
        }
        
        // Delete todo
        $success = $this->todo_model->delete($id);
        
        if (!$success) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete todo']);
            return;
        }
        
        echo json_encode(['message' => 'Todo deleted successfully']);
    }
}
