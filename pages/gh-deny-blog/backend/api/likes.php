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

require_once __DIR__ . '/../db.php';
$pdo = db();

$method = $_SERVER['REQUEST_METHOD'];
$postId = $_GET['post_id'] ?? null;

if (!$postId) {
    echo json_encode(["error" => "post_id required"]);
    exit;
}

// GET: кількість лайків + чи лайкнув поточний юзер
if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT COUNT(*) AS likes FROM likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $likes = (int)$stmt->fetchColumn();

    $liked = false;
    if (!empty($_SESSION['user'])) {
        $stmt = $pdo->prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?");
        $stmt->execute([$postId, $_SESSION['user']['id']]);
        $liked = (bool)$stmt->fetchColumn();
    }

    echo json_encode(["likes" => $likes, "liked" => $liked]);
    exit;
}

// POST: toggle like (потрібен логін)
if ($method === 'POST') {
    if (empty($_SESSION['user'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    $userId = $_SESSION['user']['id'];

    // чи вже є лайк
    $stmt = $pdo->prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?");
    $stmt->execute([$postId, $userId]);
    $exists = (bool)$stmt->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?");
        $stmt->execute([$postId, $userId]);
        $liked = false;
    } else {
        $stmt = $pdo->prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?)");
        $stmt->execute([$postId, $userId]);
        $liked = true;
    }

    // нова кількість
    $stmt = $pdo->prepare("SELECT COUNT(*) AS likes FROM likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $likes = (int)$stmt->fetchColumn();

    echo json_encode(["success" => true, "liked" => $liked, "likes" => $likes]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
