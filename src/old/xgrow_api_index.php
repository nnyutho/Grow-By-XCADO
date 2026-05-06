<?php
// XGROW API — Main Router | File: public_html/api/index.php
declare(strict_types=1);
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
set_cors_headers();
$method   = $_SERVER['REQUEST_METHOD'];
$uri      = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = explode('/', $uri);
if (($segments[0] ?? '') === 'v1') array_shift($segments);
$resource = $segments[0] ?? '';
$id       = $segments[1] ?? null;
$sub      = $segments[2] ?? null;
$body = [];
if (in_array($method, ['POST','PUT','PATCH'], true)) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
}
try {
    match($resource) {
        'health'    => json_response(['status'=>'healthy','time'=>date('c'),'version'=>APP_VERSION]),
        'auth'      => require __DIR__ . '/routes/auth.php',
        'farmers'   => require __DIR__ . '/routes/farmers.php',
        'counties'  => require __DIR__ . '/routes/counties.php',
        'regions'   => require __DIR__ . '/routes/regions.php',
        'listings'  => require __DIR__ . '/routes/listings.php',
        'orders'    => require __DIR__ . '/routes/orders.php',
        'shipments' => require __DIR__ . '/routes/shipments.php',
        'trace'     => require __DIR__ . '/routes/trace.php',
        default     => json_error("Endpoint not found: /{$resource}", 404),
    };
} catch (PDOException $e) {
    error_log('[XGROW DB] ' . $e->getMessage());
    json_error('Database error. Please try again.', 500);
} catch (Throwable $e) {
    error_log('[XGROW] ' . $e->getMessage());
    json_error('Internal server error.', 500);
}
