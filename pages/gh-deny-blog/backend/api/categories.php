<?php
require_once __DIR__ . '/../db.php';
$pdo = db();

header("Content-Type: application/json; charset=utf-8");

$stmt = $pdo->query("SELECT id, name, slug FROM categories ORDER BY name ASC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
