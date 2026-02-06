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

require_once __DIR__ . '/../../auth/requireRole.php';
requireRole('admin');

$uploadDir = __DIR__ . '/../uploads/images/';

if (!isset($_FILES['file'])) {
    echo json_encode(["error" => "No file"]);
    exit;
}

$file = $_FILES['file'];
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid() . "." . $ext;

if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
    echo json_encode(["error" => "Upload failed"]);
    exit;
}

echo json_encode(["success" => true, "filename" => $filename]);