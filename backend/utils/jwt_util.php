
<?php
class JWTUtil {
    private $secret_key;
    
    public function __construct() {
        // In a real application, this should be stored securely, not hardcoded
        $this->secret_key = 'your_jwt_secret_key_here';
    }
    
    public function generateToken($payload, $expiration = 3600) {
        // Set token expiration (default 1 hour)
        $payload['exp'] = time() + $expiration;
        
        // Create JWT
        $header = $this->base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = $this->base64UrlEncode(json_encode($payload));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret_key, true));
        
        return "$header.$payload.$signature";
    }
    
    public function validateToken($token) {
        // Split the token
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }
        
        list($header, $payload, $signature) = $parts;
        
        // Verify signature
        $valid = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret_key, true));
        
        if ($signature !== $valid) {
            throw new Exception('Invalid signature');
        }
        
        // Decode the payload
        $payload = json_decode($this->base64UrlDecode($payload), true);
        
        // Check if the token has expired
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }
        
        return $payload;
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
