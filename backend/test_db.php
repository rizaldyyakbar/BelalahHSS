<?php
try {
    $db = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=postgres;user=postgres;password=admin123');
    echo "✓ PHP and PDO PostgreSQL connection: OK\n";
    
    // Check if belalah database exists
    $result = $db->query("SELECT datname FROM pg_database WHERE datname = 'belalah';");
    if ($result && $result->fetch()) {
        echo "✓ Database 'belalah' exists\n";
    } else {
        echo "✗ Database 'belalah' does not exist - will be created by migrations\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>
