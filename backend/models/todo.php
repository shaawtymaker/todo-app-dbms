
<?php
require_once __DIR__ . '/../config/database.php';

class Todo {
    private $conn;
    
    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
        
        // Create todos table if not exists
        $this->createTable();
    }
    
    private function createTable() {
        try {
            $sql = "CREATE TABLE IF NOT EXISTS todos (
                id VARCHAR(36) PRIMARY KEY,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                list_id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )";
            
            $this->conn->exec($sql);
        } catch (PDOException $e) {
            // If there's an error with the foreign key, try creating the table without it
            error_log("Error creating todos table with foreign key: " . $e->getMessage());
            
            $sql = "CREATE TABLE IF NOT EXISTS todos (
                id VARCHAR(36) PRIMARY KEY,
                text TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                list_id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )";
            
            $this->conn->exec($sql);
        }
    }
    
    public function findById($id) {
        $sql = "SELECT * FROM todos WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function findByUser($user_id) {
        $sql = "SELECT * FROM todos WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function findByUserAndList($user_id, $list_id) {
        $sql = "SELECT * FROM todos WHERE user_id = :user_id AND list_id = :list_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':list_id', $list_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $id = uniqid();
        
        $sql = "INSERT INTO todos (id, text, completed, list_id, user_id) 
                VALUES (:id, :text, :completed, :list_id, :user_id)";
                
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':text', $data['text']);
        $stmt->bindParam(':completed', $data['completed'], PDO::PARAM_BOOL);
        $stmt->bindParam(':list_id', $data['list_id']);
        $stmt->bindParam(':user_id', $data['user_id']);
        
        if ($stmt->execute()) {
            return $id;
        }
        
        return false;
    }
    
    public function update($id, $data) {
        $sql = "UPDATE todos SET ";
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
        $sql = "DELETE FROM todos WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }
}
$Todo = new todo();
