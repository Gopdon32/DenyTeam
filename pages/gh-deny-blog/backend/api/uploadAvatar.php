<?php
session_set_cookie_params([
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE & ~E_DEPRECATED);

if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'];

$uploadDir = __DIR__ . '/../uploads/avatars/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES['avatar'])) {
    echo json_encode(["error" => "No file"]);
    exit;
}

$file = $_FILES['avatar'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$filename = uniqid("ava_") . "." . $ext;

$fullPath = $uploadDir . $filename;
$publicPath = "/backend/uploads/avatars/" . $filename;

if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
    echo json_encode(["error" => "Upload failed"]);
    exit;
}

// Оновлюємо БД
require_once __DIR__ . '/../db.php';
$pdo = db();

$stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
$stmt->execute([$publicPath, $userId]);

// Оновлюємо сесію
$_SESSION['user']['avatar'] = $publicPath;

echo json_encode([
    "success" => true,
    "avatar" => $publicPath
]);
