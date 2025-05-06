
<?php
class JWTUtil {
    private $secret_key;
    
    public function __construct() {
        // In a real application, this should be stored securely, not hardcoded
        $this->secret_key = '9efabaf07d1dea5a8d569a130414fb2601c0f6dc187a3f93ea6ed09ef7b5b5a13170469857019d131918b53bf9658ed6957e6a9c74493338c44bee47434f999624c92bd42d9cdf9d532a225a9e3a2ab5c2a5bd5f01c6bfe52c5ffb9b32ce58cae17a2d8ae7f99061cb97fc404a4b1b744bfed4cbcd05eba1e5e77d86315e810636fa86d230a22af7f55ac31af720ae228fb3b44acc70f99f41b111426a7271de6b040c00eeb53b1e7ab2e730732980f0d714f24b7799743959aa2a543aae1307c567637852e0d218c02c40cd9c61ae5e19ecba7678278ed97c9dd05f1ecce4010b6e8ed21fc8b9d1dab6ef89ab4b35a4d9091545e4fd5f69b0a28a373e6368b9';
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
