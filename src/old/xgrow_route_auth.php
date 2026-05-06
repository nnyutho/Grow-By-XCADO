<?php
// XGROW API — Auth Route | File: api/routes/auth.php
if ($method === 'POST' && $id === 'login') {
    if (empty($body['phone']) && empty($body['email'])) json_error('Phone or email required', 400);
    if (empty($body['password'])) json_error('Password required', 400);

    $field = !empty($body['phone']) ? 'phone' : 'email';
    $stmt = db()->prepare(
        "SELECT id,org_id,role,first_name,last_name,phone,email,password_hash,active
         FROM   users WHERE $field = ? LIMIT 1"
    );
    $stmt->execute([$body[$field] ?? '']);
    $user = $stmt->fetch();

    if (!$user || !password_verify($body['password'], $user['password_hash'])) {
        json_error('Invalid credentials', 401);
    }
    if (!$user['active']) json_error('Account suspended', 403);

    $token = bin2hex(random_bytes(32));
    db()->prepare("UPDATE users SET api_token=?, last_login=NOW() WHERE id=?")
       ->execute([$token, $user['id']]);

    unset($user['password_hash']);
    json_response(array_merge($user, ['token' => $token]));

} elseif ($method === 'POST' && $id === 'logout') {
    $token = get_bearer_token();
    if ($token) db()->prepare("UPDATE users SET api_token=NULL WHERE api_token=?")->execute([$token]);
    json_response(['message' => 'Logged out successfully']);

} else {
    json_error('Auth endpoint not found', 404);
}
