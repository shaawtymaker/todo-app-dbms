
<?php
class Database {
    private $host = "127.0.0.1";
    private $db_name = "todo_app";
    private $username = "root";
    private $password = "";
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("SET NAMES utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch(PDOException $e) {
            // Try to create the database if it doesn't exist
            try {
                $tempConn = new PDO("mysql:host=" . $this->host, $this->username, $this->password);
                $tempConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                // Create database
                $tempConn->exec("CREATE DATABASE IF NOT EXISTS `" . $this->db_name . "` 
                    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                
                // Connect to the newly created database
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
                
            } catch(PDOException $e2) {
                // If we still can't connect, throw the error
                error_log("Connection error: " . $e2->getMessage());
                throw $e2;
            }
        }
        
        return $this->conn;
    }
}
