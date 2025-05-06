
<?php
require_once __DIR__ . '/../utils/jwt_util.php';
require_once __DIR__ . '/../models/list.php';

class ListController {
    private $list_model;
    private $jwt_util;
    
    public function __construct() {
        $this->list_model = new ListModel(); // Using ListModel to avoid conflict with PHP's List keyword
        $this->jwt_util = new JWTUtil();
    }
    
    private function authenticate() {
        // Get authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!$auth_header) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized: No Authorization header']);
            exit;
        }
        
        if (!preg_match('/^Bearer\s+(.*?)$/', $auth_header, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized: Invalid Authorization format']);
            exit;
        }
        
        $token = $matches[1];
        
        try {
            $user = $this->jwt_util->validateToken($token);
            return $user;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized: ' . $e->getMessage()]);
            exit;
        }
    }
    
    public function getAll() {
        $user = $this->authenticate();
        
        // Get lists for user
        $lists = $this->list_model->findByUser($user['id']);
        
        // Add default lists if they don't exist
        $default_lists = [
            ['id' => 'inbox', 'name' => 'Inbox', 'color' => '#3b82f6', 'user_id' => $user['id']],
            ['id' => 'personal', 'name' => 'Personal', 'color' => '#8b5cf6', 'user_id' => $user['id']],
            ['id' => 'work', 'name' => 'Work', 'color' => '#10b981', 'user_id' => $user['id']]
        ];
        
        foreach ($default_lists as $default_list) {
            $exists = false;
            foreach ($lists as $list) {
                if ($list['id'] === $default_list['id']) {
                    $exists = true;
                    break;
                }
            }
            
            if (!$exists) {
                // Create the default list in the database
                $this->list_model->create($default_list);
                $lists[] = $default_list;
            }
        }
        
        echo json_encode($lists);
    }
    
    public function getById($id) {
        $user = $this->authenticate();
        
        // Check for default lists
        $default_lists = [
            'inbox' => ['id' => 'inbox', 'name' => 'Inbox', 'color' => '#3b82f6', 'user_id' => $user['id']],
            'personal' => ['id' => 'personal', 'name' => 'Personal', 'color' => '#8b5cf6', 'user_id' => $user['id']],
            'work' => ['id' => 'work', 'name' => 'Work', 'color' => '#10b981', 'user_id' => $user['id']]
        ];
        
        if (isset($default_lists[$id])) {
            // Check if it exists in the database already
            $list = $this->list_model->findById($id);
            
            // If not, create it
            if (!$list) {
                $this->list_model->create($default_lists[$id]);
            }
            
            echo json_encode($default_lists[$id]);
            return;
        }
        
        // Get list
        $list = $this->list_model->findById($id);
        
        if (!$list || $list['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'List not found']);
            return;
        }
        
        echo json_encode($list);
    }
    
    public function create() {
        $user = $this->authenticate();
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate data
        if (!isset($data['name']) || !isset($data['color'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Name and color are required']);
            return;
        }
        
        // Add user_id to data
        $data['user_id'] = $user['id'];
        
        // Create list
        $list_id = $this->list_model->create($data);
        
        if (!$list_id) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create list']);
            return;
        }
        
        // Get created list
        $list = $this->list_model->findById($list_id);
        
        echo json_encode($list);
    }
    
    public function update($id) {
        $user = $this->authenticate();
        
        // Don't allow updating default lists
        if ($id === 'inbox' || $id === 'personal' || $id === 'work') {
            http_response_code(403);
            echo json_encode(['message' => 'Default lists cannot be updated']);
            return;
        }
        
        // Get list
        $list = $this->list_model->findById($id);
        
        if (!$list || $list['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'List not found']);
            return;
        }
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Update list
        $success = $this->list_model->update($id, $data);
        
        if (!$success) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update list']);
            return;
        }
        
        // Get updated list
        $list = $this->list_model->findById($id);
        
        echo json_encode($list);
    }
    
    public function delete($id) {
        $user = $this->authenticate();
        
        // Don't allow deleting default lists
        if ($id === 'inbox' || $id === 'personal' || $id === 'work') {
            http_response_code(403);
            echo json_encode(['message' => 'Default lists cannot be deleted']);
            return;
        }
        
        // Get list
        $list = $this->list_model->findById($id);
        
        if (!$list || $list['user_id'] != $user['id']) {
            http_response_code(404);
            echo json_encode(['message' => 'List not found']);
            return;
        }
        
        // Delete list
        $success = $this->list_model->delete($id);
        
        if (!$success) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete list']);
            return;
        }
        
        echo json_encode(['message' => 'List deleted successfully']);
    }
}
