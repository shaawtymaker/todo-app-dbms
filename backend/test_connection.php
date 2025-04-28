<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'config/database.php'; // Adjust the path if necessary

// Create a new instance of the Database class
$database = new Database();
$conn = $database->getConnection(); // Attempt to get the database connection

// Check if the connection was successful
if ($conn) {
    echo "Database connection successful!";
} else {
    echo "Database connection failed.";
}
?>