
<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow cross-origin requests from any origin for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    // Parse request URL
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Remove base path if present
    $basePath = '/todo-app-dbms/backend/api';
    if (strpos($uri, $basePath) === 0) {
        $uri = substr($uri, strlen($basePath));
    }
    
    // Also handle if accessed directly via /api/
    $apiPos = strpos($uri, '/api/');
    if ($apiPos !== false) {
        $uri = substr($uri, $apiPos + strlen('/api/'));
    }

    $uri_parts = explode('/', trim($uri, '/'));
    
    // Debug output
    error_log("Request URI: " . $_SERVER['REQUEST_URI']);
    error_log("Parsed URI: " . $uri);
    error_log("URI parts: " . print_r($uri_parts, true));

    $controller = isset($uri_parts[0]) && $uri_parts[0] !== '' ? $uri_parts[0] : '';
    $action = isset($uri_parts[1]) ? $uri_parts[1] : '';
    $id = isset($uri_parts[2]) ? $uri_parts[2] : null;

    // Get Authorization header via getallheaders() if available
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            // Convert all headers to uppercase for case-insensitive matching
            $headers = array_change_key_case($headers, CASE_UPPER);
            
            if (isset($headers['AUTHORIZATION'])) {
                $_SERVER['HTTP_AUTHORIZATION'] = $headers['AUTHORIZATION'];
            }
        }
    }

    // Include the appropriate controller based on the request
    switch ($controller) {
        case 'auth':
            require __DIR__ . '/../controllers/auth_controller.php';
            $auth_controller = new AuthController();
            
            switch ($action) {
                case 'login':
                    $auth_controller->login();
                    break;
                case 'register':
                    $auth_controller->register();
                    break;
                case 'logout':
                    $auth_controller->logout();
                    break;
                case 'refresh':
                    $auth_controller->refresh();
                    break;
                default:
                    http_response_code(404);
                    echo json_encode(['message' => 'Auth endpoint not found: ' . $action]);
                    break;
            }
            break;
            
        case 'todos':
            require __DIR__ . '/../controllers/todo_controller.php';
            $todo_controller = new TodoController();
            
            if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$id) {
                $todo_controller->getAll();
            } else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $id) {
                $todo_controller->getById($id);
            } else if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$id) {
                $todo_controller->create();
            } else if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $action === 'toggle') {
                $todo_controller->toggle($id);
            } else if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $id) {
                $todo_controller->update($id);
            } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
                $todo_controller->delete($id);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Todo endpoint not found']);
            }
            break;
            
        case 'lists':
            require __DIR__ . '/../controllers/list_controller.php';
            $list_controller = new ListController();
            
            if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$id) {
                $list_controller->getAll();
            } else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $id) {
                $list_controller->getById($id);
            } else if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$id) {
                $list_controller->create();
            } else if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $id) {
                $list_controller->update($id);
            } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
                $list_controller->delete($id);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'List endpoint not found']);
            }
            break;
            
        case '':
            // Handle root API request
            echo json_encode(['message' => 'Todo App API', 'status' => 'running']);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['message' => 'API Endpoint Not Found: ' . $controller]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Fatal error: ' . $e->getMessage()]);
}
