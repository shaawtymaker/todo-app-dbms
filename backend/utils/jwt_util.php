
<?php
class JWTUtil {
    private $secret_key;
    private $token_expiry;
    
    public function __construct() {
        // In a real app, you should use a strong secret key from environment variables
        $this->secret_key = 'your_secret_key_here';
        $this->token_expiry = 86400; // 24 hours
    }
    
    public function generateToken($payload) {
        // Create token header
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        // Add expiry to payload
        $payload['exp'] = time() + $this->token_expiry;
        
        // Create token payload
        $payload = json_encode($payload);
        
        // Encode header and payload
        $base64Header = $this->base64UrlEncode($header);
        $base64Payload = $this->base64UrlEncode($payload);
        
        // Create signature
        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $this->secret_key, true);
        $base64Signature = $this->base64UrlEncode($signature);
        
        // Create JWT
        return "$base64Header.$base64Payload.$base64Signature";
    }
    
    public function validateToken($token) {
        // Split token into parts
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Token format is invalid');
        }
        
        [$base64Header, $base64Payload, $base64Signature] = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $this->secret_key, true);
        $verifySignature = $this->base64UrlEncode($signature);
        
        if ($base64Signature !== $verifySignature) {
            throw new Exception('Token signature is invalid');
        }
        
        // Decode payload
        $payload = json_decode($this->base64UrlDecode($base64Payload), true);
        
        // Check if token is expired
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }
        
        return $payload;
    }
    
    private function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, '+/', '-_');
        return rtrim($base64Url, '=');
    }
    
    private function base64UrlDecode($data) {
        $base64Url = strtr($data, '-_', '+/');
        $base64 = str_pad($base64Url, strlen($data) % 4, '=', STR_PAD_RIGHT);
        return base64_decode($base64);
    }
}
