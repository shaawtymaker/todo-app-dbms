
<?php
require_once __DIR__ . '/../config/database.php';

class ListModel { // Using ListModel to avoid conflict with PHP's List keyword
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
        
        // Create lists table if not exists
        $this->createTable();
    }
    
    private function createTable() {
        try {
            $sql = "CREATE TABLE IF NOT EXISTS lists (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(50) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )";
            
            $this->conn->exec($sql);
        } catch (PDOException $e) {
            // If there's an error with the foreign key, try creating the table without it
            error_log("Error creating lists table with foreign key: " . $e->getMessage());
            
            $sql = "CREATE TABLE IF NOT EXISTS lists (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(50) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            
            $this->conn->exec($sql);
        }
    }
    
    public function findById($id) {
        $sql = "SELECT * FROM lists WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function findByUser($user_id) {
        $sql = "SELECT * FROM lists WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        // Use provided ID or generate a new one
        $id = isset($data['id']) ? $data['id'] : uniqid();
        
        $sql = "INSERT INTO lists (id, name, color, user_id) 
                VALUES (:id, :name, :color, :user_id)";
                
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':color', $data['color']);
        $stmt->bindParam(':user_id', $data['user_id']);
        
        // Check if list with this ID already exists
        $existingList = $this->findById($id);
        if ($existingList) {
            // List already exists, return the ID
            return $id;
        }
        
        if ($stmt->execute()) {
            return $id;
        }
        
        return false;
    }
    
    public function update($id, $data) {
        $sql = "UPDATE lists SET ";
        $params = [];
        
        foreach ($data as $key => $value) {
            $sql .= "$key = :$key, ";
            $params[":$key"] = $value;
        }
        
        $sql = rtrim($sql, ", ");
        $sql .= " WHERE id = :id";
        $params[':id'] = $id;
        
        $stmt = $this->conn->prepare($sql);
        
        return $stmt->execute($params);
    }
    
    public function delete($id) {
        $sql = "DELETE FROM lists WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
}
$listmodel = new listmodel();
