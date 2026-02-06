<?php
session_set_cookie_params([
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . '/../db.php';
$pdo = db();

if (empty($_SESSION['user'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'];

// Основна інформація
$stmt = $pdo->prepare("
    SELECT 
        id,
        username,
        avatar,
        role,
        role_color,
        created_at
    FROM users
    WHERE id = ?
");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

// Кількість постів
$stmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE author_id = ?");
$stmt->execute([$userId]);
$user['posts_count'] = $stmt->fetchColumn();

// Кількість коментарів
$stmt = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE user_id = ?");
$stmt->execute([$userId]);
$user['comments_count'] = $stmt->fetchColumn();

echo json_encode($user);
