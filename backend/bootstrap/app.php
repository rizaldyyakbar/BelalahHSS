<?php
// Minimal Laravel-compatible bootstrap
require_once __DIR__ . '/../.env.php';

// Simple service container
class Container {
    protected $bindings = [];
    protected $instances = [];
    
    public function bind($name, $callback) {
        $this->bindings[$name] = $callback;
    }
    
    public function make($name) {
        if (isset($this->instances[$name])) {
            return $this->instances[$name];
        }
        
        if (isset($this->bindings[$name])) {
            $this->instances[$name] = call_user_func($this->bindings[$name], $this);
            return $this->instances[$name];
        }
        
        throw new Exception("No binding found for $name");
    }
}

$app = new Container();

// Database binding
$app->bind('db', function() {
    $env = getenv();
    return new PDO(
        "pgsql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']}",
        $env['DB_USERNAME'],
        $env['DB_PASSWORD']
    );
});

return $app;
?>
