<?php
session_start();
session_destroy(); // Destroy the session

// Return a JSON response
echo json_encode(['success' => true]);
?>