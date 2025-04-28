
<?php
require_once __DIR__ . '/../utils/jwt_util.php';
require_once __DIR__ . '/../models/user.php';

class AuthController {
    private $user_model;
    private $jwt_util;
    
    public function __construct() {
        $this->user_model = new User();
        $this->jwt_util = new JWTUtil();
    }
    
    public function login() {
        // Only allow POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            return;
        }
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate data
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Email and password are required']);
            return;
        }
        
        // Attempt to authenticate user
        $user = $this->user_model->findByEmail($data['email']);
        
        if (!$user || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid credentials']);
            return;
        }
        
        // Generate JWT token
        $token = $this->jwt_util->generateToken([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]);
        
        // Remove password from response
        unset($user['password']);
        
        // Return user and token
        echo json_encode([
            'user' => $user,
            'token' => $token
        ]);
    }
    
    public function register() {
        // Only allow POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            return;
        }
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate data
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Name, email and password are required']);
            return;
        }
        
        // Check if user already exists
        if ($this->user_model->findByEmail($data['email'])) {
            http_response_code(409);
            echo json_encode(['message' => 'Email already in use']);
            return;
        }
        
        // Create user
        $user_id = $this->user_model->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ]);
        
        if (!$user_id) {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create user']);
            return;
        }
        
        // Get created user
        $user = $this->user_model->findById($user_id);
        
        // Generate JWT token
        $token = $this->jwt_util->generateToken([
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]);
        
        // Remove password from response
        unset($user['password']);
        
        // Return user and token
        echo json_encode([
            'user' => $user,
            'token' => $token
        ]);
    }
    
    public function logout() {
        // In a stateless API with JWT, we don't need to do anything server-side for logout
        // The frontend will remove the token from localStorage
        
        echo json_encode(['message' => 'Successfully logged out']);
    }
    
    public function refresh() {
        // Get authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!$auth_header || !preg_match('/^Bearer\s+(.*?)$/', $auth_header, $matches)) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }
        
        $token = $matches[1];
        
        try {
            $payload = $this->jwt_util->validateToken($token);
            
            // Get user from database
            $user = $this->user_model->findById($payload['id']);
            
            if (!$user) {
                throw new Exception('User not found');
            }
            
            // Generate new token
            $new_token = $this->jwt_util->generateToken([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]);
            
            // Remove password from response
            unset($user['password']);
            
            // Return user and token
            echo json_encode([
                'user' => $user,
                'token' => $new_token
            ]);
            
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Token is invalid or expired']);
        }
    }
}
