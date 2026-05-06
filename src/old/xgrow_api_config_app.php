<?php
// XGROW API — App Config | File: api/config/app.php
// ⚠ EDIT JWT_SECRET before uploading to cPanel
define('APP_NAME',    'XGROW Farm-to-Market SaaS');
define('APP_VERSION', '1.0.0');
define('APP_ENV',     'production');
define('ALLOWED_ORIGINS', [
    'https://xgrow.xcado.africa',
    'https://xcado.africa',
    'http://localhost:5173',
    'http://localhost:3000',
]);
// Generate: openssl rand -base64 64
define('JWT_SECRET', 'REPLACE_WITH_64_CHAR_RANDOM_STRING');
define('JWT_EXPIRY',  86400); // 24 hours

function set_cors_headers(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, ALLOWED_ORIGINS, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Vary: Origin");
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key, Accept');
    header('Access-Control-Max-Age: 86400');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

function json_response(mixed $data, int $status = 200, ?array $meta = null): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    $p = ['status' => $status < 400 ? 'success' : 'error', 'data' => $data, 'version' => APP_VERSION];
    if ($meta) $p['meta'] = $meta;
    echo json_encode($p, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function json_error(string $message, int $status = 400): never {
    json_response(['message' => $message], $status);
}

function get_bearer_token(): ?string {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $h, $m)) return $m[1];
    return $_SERVER['HTTP_X_API_KEY'] ?? null;
}

function require_auth(): array {
    $token = get_bearer_token();
    if (!$token) json_error('Unauthorized — API key required', 401);
    $stmt = db()->prepare(
        "SELECT u.id, u.role, u.org_id FROM api_keys k
         JOIN organisations o ON o.id = k.org_id
         JOIN users u ON u.org_id = o.id
         WHERE k.key_hash = ? AND k.active = 1 LIMIT 1"
    );
    $stmt->execute([hash('sha256', $token)]);
    $user = $stmt->fetch();
    if (!$user) json_error('Invalid or expired API key', 401);
    db()->prepare("UPDATE api_keys SET last_used = NOW() WHERE key_hash = ?")
       ->execute([hash('sha256', $token)]);
    return $user;
}
