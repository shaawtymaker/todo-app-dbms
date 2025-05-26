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
        
        try {
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
            
            // Generate JWT token with longer expiration
            $token = $this->jwt_util->generateToken([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ], 30 * 24 * 60 * 60); // 30 days expiration
            
            // Remove password from response
            unset($user['password']);
            
            // Return user and token
            echo json_encode([
                'user' => $user,
                'token' => $token
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
        }
    }
    
    public function register() {
        // Only allow POST requests
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            return;
        }
        
        try {
            // Get request data
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid JSON data']);
                return;
            }
            
            // Validate data
            if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['message' => 'Name, email and password are required']);
                return;
            }
            
            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid email format']);
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
                'name' => trim($data['name']),
                'email' => trim($data['email']),
                'password' => $data['password'] // Let the model handle hashing
            ]);
            
            if (!$user_id) {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to create user']);
                return;
            }
            
            // Get created user
            $user = $this->user_model->findById($user_id);
            
            if (!$user) {
                http_response_code(500);
                echo json_encode(['message' => 'User created but could not retrieve user data']);
                return;
            }
            
            // Generate JWT token with longer expiration
            $token = $this->jwt_util->generateToken([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ], 30 * 24 * 60 * 60); // 30 days expiration
            
            // Remove password from response
            unset($user['password']);
            
            // Return user and token
            http_response_code(201);
            echo json_encode([
                'user' => $user,
                'token' => $token
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Internal server error: ' . $e->getMessage()]);
        }
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
            
            // Generate new token with longer expiration
            $new_token = $this->jwt_util->generateToken([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ], 30 * 24 * 60 * 60); // 30 days expiration
            
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
