<?php
// XGROW API — Farmers Route | File: api/routes/farmers.php
$auth = require_auth();

if ($method === 'GET' && !$id) {
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $per    = min(50, (int)($_GET['per_page'] ?? 25));
    $county = $_GET['county_code'] ?? null;

    $q = "SELECT f.id, CONCAT(u.first_name,' ',u.last_name) AS full_name, u.phone,
                 c.name AS county, f.total_acres, f.primary_crop, f.credit_score, f.created_at
          FROM   farmers f
          JOIN   users u ON u.id = f.user_id
          JOIN   counties c ON c.id = f.county_id
          WHERE  f.active = 1";
    $params = [];
    if ($county) { $q .= " AND c.code = ?"; $params[] = $county; }
    $q .= " ORDER BY f.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $per;
    $params[] = ($page - 1) * $per;

    $stmt = db()->prepare($q);
    $stmt->execute($params);
    $total = db()->query("SELECT COUNT(*) FROM farmers WHERE active=1")->fetchColumn();
    json_response($stmt->fetchAll(), 200, ['total'=>(int)$total,'page'=>$page,'per_page'=>$per]);

} elseif ($method === 'GET' && $id) {
    $stmt = db()->prepare(
        "SELECT f.*, CONCAT(u.first_name,' ',u.last_name) AS full_name, u.phone, u.email,
                c.name AS county, sc.name AS sub_county
         FROM   farmers f
         JOIN   users u ON u.id = f.user_id
         JOIN   counties c ON c.id = f.county_id
         LEFT JOIN sub_counties sc ON sc.id = f.sub_county_id
         WHERE  f.id = ? AND f.active = 1"
    );
    $stmt->execute([$id]);
    $farmer = $stmt->fetch();
    if (!$farmer) json_error('Farmer not found', 404);
    json_response($farmer);

} elseif ($method === 'POST') {
    foreach (['first_name','last_name','phone','county_id'] as $r) {
        if (empty($body[$r])) json_error("Missing required field: $r", 400);
    }
    db()->beginTransaction();
    try {
        $stmt = db()->prepare(
            "INSERT INTO users(role,first_name,last_name,phone,email,national_id,gender,active)
             VALUES('farmer',?,?,?,?,?,?,1)"
        );
        $stmt->execute([$body['first_name'],$body['last_name'],$body['phone'],
                        $body['email']??null,$body['national_id']??null,$body['gender']??null]);
        $userId = (int)db()->lastInsertId();

        $stmt = db()->prepare(
            "INSERT INTO farmers(user_id,org_id,county_id,sub_county_id,ward,village,
                                  gps_lat,gps_lng,total_acres,primary_crop,mpesa_number)
             VALUES(?,?,?,?,?,?,?,?,?,?,?)"
        );
        $stmt->execute([$userId,$auth['org_id'],$body['county_id'],
                        $body['sub_county_id']??null,$body['ward']??null,$body['village']??null,
                        $body['gps_lat']??null,$body['gps_lng']??null,$body['total_acres']??0,
                        $body['primary_crop']??null,$body['mpesa_number']??null]);
        $farmerId = (int)db()->lastInsertId();
        db()->commit();
        json_response(['farmer_id'=>$farmerId,'user_id'=>$userId], 201);
    } catch (Throwable $e) {
        db()->rollBack();
        json_error('Registration failed: ' . $e->getMessage(), 500);
    }

} else {
    json_error('Method not allowed', 405);
}
