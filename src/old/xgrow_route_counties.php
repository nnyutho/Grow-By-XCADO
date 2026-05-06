<?php
// XGROW API — Counties Route | File: api/routes/counties.php | Public endpoint
if ($method === 'GET' && !$id) {
    $region = $_GET['region'] ?? null;
    $q = "SELECT c.id, c.code, c.name, c.capital, c.agri_zone, c.lat, c.lng,
                 c.population, r.name AS region
          FROM   counties c JOIN regions r ON r.id = c.region_id";
    $params = [];
    if ($region) { $q .= " WHERE r.id = ?"; $params[] = (int)$region; }
    $q .= " ORDER BY c.code";
    $stmt = db()->prepare($q);
    $stmt->execute($params);
    json_response($stmt->fetchAll());

} elseif ($method === 'GET' && $id && ($sub === 'sub-counties' || $sub === 'sub_counties')) {
    $stmt = db()->prepare(
        "SELECT sc.id, sc.name FROM sub_counties sc
         JOIN counties c ON c.id = sc.county_id WHERE c.code = ? ORDER BY sc.name"
    );
    $stmt->execute([$id]);
    json_response($stmt->fetchAll());

} elseif ($method === 'GET' && $id) {
    $stmt = db()->prepare(
        "SELECT c.*, r.name AS region FROM counties c JOIN regions r ON r.id = c.region_id WHERE c.code = ?"
    );
    $stmt->execute([$id]);
    $county = $stmt->fetch();
    if (!$county) json_error('County not found', 404);
    json_response($county);

} else {
    json_error('Method not allowed', 405);
}
