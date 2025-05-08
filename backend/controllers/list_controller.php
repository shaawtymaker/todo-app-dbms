
<?php
require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../models/list.php';

class ListController {
    private $list_model;
    private $auth_middleware;
    private $default_lists;
    
    public function __construct() {
        $this->list_model = new ListModel(); // Using ListModel to avoid conflict with PHP's List keyword
        $this->auth_middleware = new AuthMiddleware();
        
        // Define default lists
        $this->default_lists = [
            'inbox' => ['id' => 'inbox', 'name' => 'Inbox', 'color' => '#3b82f6'],
            'personal' => ['id' => 'personal', 'name' => 'Personal', 'color' => '#8b5cf6'],
            'work' => ['id' => 'work', 'name' => 'Work', 'color' => '#10b981'],
        ];
    }
    
    /**
     * Get all lists for the authenticated user
     */
    public function getAll() {
        // Authenticate the user
        $user = $this->auth_middleware->authenticate();
        
        // Get lists for user
        $lists = $this->list_model->findByUser($user['id']);
        
        // Add default lists if they don't exist
        foreach ($this->default_lists as $default_list) {
            $exists = false;
            foreach ($lists as $list) {
                if ($list['id'] === $default_list['id']) {
                    $exists = true;
                    break;
                }
            }
            
            if (!$exists) {
                // Add user_id to default list
                $default_list['user_id'] = $user['id'];
                
                // Create the default list in the database
                $this->list_model->create($default_list);
                $lists[] = $default_list;
            }
        }
        
        echo json_encode($lists);
    }
    
    /**
     * Get a list by its ID
     */
    public function getById($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Check if it's a default list
        if (isset($this->default_lists[$id])) {
            $default_list = $this->default_lists[$id];
            $default_list['user_id'] = $user['id'];
            
            // Check if it exists in the database already
            $list = $this->list_model->findById($id);
            
            // If not, create it
            if (!$list) {
                $this->list_model->create($default_list);
            }
            
            echo json_encode($default_list);
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
    
    /**
     * Create a new list
     */
    public function create() {
        $user = $this->auth_middleware->authenticate();
        
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
    
    /**
     * Update a list
     */
    public function update($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Check if it's a default list
        if ($this->isDefaultList($id)) {
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
    
    /**
     * Delete a list
     */
    public function delete($id) {
        $user = $this->auth_middleware->authenticate();
        
        // Check if it's a default list
        if ($this->isDefaultList($id)) {
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
    
    /**
     * Check if a list is one of the default lists
     */
    private function isDefaultList($id) {
        return isset($this->default_lists[$id]);
    }
}
