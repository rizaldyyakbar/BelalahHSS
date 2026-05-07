<?php
// Simple API Router without Laravel
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load environment variables
$env = parse_ini_file(__DIR__ . '/../.env');

// Database connection
try {
    $db = new PDO(
        "pgsql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']}",
        $env['DB_USERNAME'],
        $env['DB_PASSWORD']
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);

// Simple routing
if ($path === '/' && $method === 'GET') {
    echo json_encode([
        'message' => 'Belalah HSS API',
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/health' => 'Health check',
            'GET /api/destinations' => 'Get all destinations',
            'GET /api/destinations/:id' => 'Get destination by ID',
            'GET /api/categories' => 'Get all categories'
        ]
    ]);
}
elseif ($path === '/health' && $method === 'GET') {
    echo json_encode([
        'status' => 'OK',
        'database' => 'connected',
        'timestamp' => date('c')
    ]);
}
elseif ($path === '/destinations' && $method === 'GET') {
    try {
        $stmt = $db->query("SELECT id, name, description, image FROM destinations LIMIT 10");
        $destinations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($destinations);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
elseif ($path === '/categories' && $method === 'GET') {
    try {
        $stmt = $db->query("SELECT id, name, icon FROM categories LIMIT 10");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($categories);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
