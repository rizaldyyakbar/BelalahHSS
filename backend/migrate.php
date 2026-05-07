<?php
// Database migration script
$env = parse_ini_file(__DIR__ . '/.env');

try {
    $db = new PDO(
        "pgsql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname=postgres;user={$env['DB_USERNAME']};password={$env['DB_PASSWORD']}"
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to PostgreSQL\n";
    
    // Create database if not exists
    $db->exec("SELECT 1 FROM pg_database WHERE datname = 'belalah'" );
    try {
        $db->exec("CREATE DATABASE belalah");
        echo "✓ Database 'belalah' created\n";
    } catch (Exception $e) {
        echo "✓ Database 'belalah' already exists\n";
    }
    
    // Connect to belalah database
    $db = new PDO(
        "pgsql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']};user={$env['DB_USERNAME']};password={$env['DB_PASSWORD']}"
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create tables
    $tables = [
        'categories' => '
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                icon VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ',
        'destinations' => '
            CREATE TABLE IF NOT EXISTS destinations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category_id INT REFERENCES categories(id),
                image VARCHAR(255),
                rating FLOAT DEFAULT 0,
                price INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ',
        'routes' => '
            CREATE TABLE IF NOT EXISTS routes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                duration INT,
                difficulty VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        '
    ];
    
    foreach ($tables as $table => $sql) {
        $db->exec($sql);
        echo "✓ Table '$table' ready\n";
    }
    
    // Seed sample data
    $db->exec("
        INSERT INTO categories (name, icon) VALUES 
        ('Adventure', 'mountain'),
        ('Beach', 'waves'),
        ('Culture', 'landmark'),
        ('Nature', 'tree')
        ON CONFLICT DO NOTHING
    ");
    echo "✓ Sample categories added\n";
    
    $db->exec("
        INSERT INTO destinations (name, description, category_id, image, rating, price) VALUES 
        ('Haratai Waterfall', 'Beautiful waterfall in the jungle', 1, 'Air-Terjun-Haratai.jpg', 4.8, 50000),
        ('Langara Beach', 'Pristine white sand beach', 2, 'langara.jpg', 4.5, 75000),
        ('Langara Temple', 'Ancient temple with cultural significance', 3, 'langara.png', 4.6, 30000)
        ON CONFLICT DO NOTHING
    ");
    echo "✓ Sample destinations added\n";
    
    echo "\n✅ Database setup complete!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
