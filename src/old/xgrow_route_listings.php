<?php
// XGROW API — Listings Route | File: api/routes/listings.php
$auth = require_auth();

if ($method === 'GET' && !$id) {
    $status = $_GET['status'] ?? 'Active';
    $stmt = db()->prepare(
        "SELECT l.id, l.product_name, l.category, l.quantity_kg, l.unit,
                l.price_kes, l.price_usd, l.grade, l.certifications,
                l.moq, l.lead_days, l.available_from, l.status,
                o.name AS org_name, c.name AS county
         FROM   listings l
         JOIN   organisations o ON o.id = l.org_id
         LEFT JOIN farmers f ON f.id = l.farmer_id
         LEFT JOIN counties c ON c.id = f.county_id
         WHERE  l.status = ?
         ORDER  BY l.featured DESC, l.created_at DESC"
    );
    $stmt->execute([$status]);
    json_response($stmt->fetchAll());

} elseif ($method === 'GET' && $id) {
    $stmt = db()->prepare("SELECT l.*, o.name AS org_name FROM listings l JOIN organisations o ON o.id=l.org_id WHERE l.id=?");
    $stmt->execute([$id]);
    $listing = $stmt->fetch();
    if (!$listing) json_error('Listing not found', 404);
    json_response($listing);

} elseif ($method === 'POST') {
    foreach (['product_name','quantity_kg','price_usd'] as $r) {
        if (empty($body[$r])) json_error("Missing: $r", 400);
    }
    $stmt = db()->prepare(
        "INSERT INTO listings(org_id,product_name,category,quantity_kg,unit,
                               price_kes,price_usd,grade,certifications,
                               moq,lead_days,available_from,status)
         VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $auth['org_id'], $body['product_name'], $body['category']??null,
        $body['quantity_kg'], $body['unit']??'kg', $body['price_kes']??null,
        $body['price_usd'], $body['grade']??null,
        json_encode($body['certifications']??[]),
        $body['moq']??null, $body['lead_days']??14, $body['available_from']??null, 'Active'
    ]);
    json_response(['listing_id' => (int)db()->lastInsertId()], 201);

} else {
    json_error('Method not allowed', 405);
}
