
<?php
require_once __DIR__ . '/../utils/jwt_util.php';

class AuthMiddleware {
    private $jwt_util;
    
    public function __construct() {
        $this->jwt_util = new JWTUtil();
    }
    
    public function authenticate() {
        // Get authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!$auth_header) {
            // Try to get from getAllHeaders if available
            if (function_exists('getallheaders')) {
                $headers = getallheaders();
                // Convert all headers to uppercase for case-insensitive matching
                $headers = array_change_key_case($headers, CASE_UPPER);
                if (isset($headers['AUTHORIZATION'])) {
                    $auth_header = $headers['AUTHORIZATION'];
                }
            }
            
            if (!$auth_header) {
                http_response_code(401);
                echo json_encode(['message' => 'Unauthorized: No Authorization header']);
                exit;
            }
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
}
