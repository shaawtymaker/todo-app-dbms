
<?php
class JWTUtil {
    private $secret_key;
    private $token_expiry;
    
    public function __construct() {
        // In a real app, you should use a strong secret key from environment variables
        $this->secret_key = '86543a53d1db8eba8d5491bfb44f5dfcd30c0dc28f3b729748175ff05054794a52c55ad0e61f80a60faf124afcd1e385e2409910eb703b09a95c9398d2687797b5b6ca4826505f5665418c39d8b9b7212d25011d545332c98160ed345e6a525a0769db4dbc87fadd5b037bac98ed12ea686653f86479f822d623372f1a8d116240016298b8cd3aed8dcde0e80ca9fe0a85bd3dbdd0ae82165a51a273373cd46f3c239717f5fcb21fc4a166ed24ad6c8590e304309dbc04ac1d70e6e3200bc3c31ae306fd964de6886d533126dd053ab8f9d02c508ec964a5094c5225fbd6f3bde5a54b961d1923a16c06afbd3b1dc9b80d7fd81e4737494863abd5647ed98016';
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
