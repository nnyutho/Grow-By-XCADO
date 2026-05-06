<?php
// XGROW API — Database Config | File: api/config/database.php
// ⚠ EDIT DB_NAME, DB_USER, DB_PASS with your cPanel credentials
// cPanel always prefixes: if your account is xcadoke, DB becomes xcadoke_xgrow
define('DB_HOST',    'localhost');
define('DB_NAME',    'xcadoke_xgrow');  // EDIT: cPanel_username_xgrow
define('DB_USER',    'xcadoke_xgrow');  // EDIT: same as DB_NAME
define('DB_PASS',    'REPLACE_WITH_STRONG_PASSWORD');
define('DB_CHARSET', 'utf8mb4');

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
