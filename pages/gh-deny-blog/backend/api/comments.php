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
$action = $_GET['action'] ?? null;

$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$limit  = isset($_GET['limit'])  ? (int)$_GET['limit']  : 10;

/* ============================================================
   ВАЖЛИВО: post_id потрібен для всіх запитів, крім delete
   ============================================================ */
if (!$postId && !($method === 'POST' && $action === 'delete')) {
    echo json_encode(["error" => "post_id required"]);
    exit;
}

/* ============================================================
   GET — ПОЛУЧЕНИЕ КОММЕНТАРИЕВ
   ============================================================ */
if ($method === 'GET') {

    $stmt = $pdo->prepare("
        SELECT 
            c.id,
            c.content AS text,
            c.created_at,
            u.username,
            u.avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY created_at DESC
        LIMIT ?, ?
    ");

    $stmt->bindValue(1, $postId, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->bindValue(3, $limit, PDO::PARAM_INT);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as &$row) {
        if (empty($row['avatar'])) {
            $row['avatar'] = '/backend/uploads/avatars/default.png';
        }
    }

    echo json_encode($rows);
    exit;
}

/* ============================================================
   POST — ДОБАВЛЕНИЕ КОММЕНТАРИЯ
   ============================================================ */
if ($method === 'POST' && $action !== 'delete') {

    if (empty($_SESSION['user'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $text = trim($data['text'] ?? '');

    if ($text === '') {
        echo json_encode(["error" => "Empty text"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO comments (post_id, user_id, content, created_at)
        VALUES (?, ?, ?, NOW())
    ");
    $stmt->execute([
        $postId,
        $_SESSION['user']['id'],
        $text
    ]);

    echo json_encode([
        "success"  => true,
        "username" => $_SESSION['user']['username'],
        "avatar"   => $_SESSION['user']['avatar'] ?? '/backend/uploads/avatars/default.png',
        "text"     => $text
    ]);
    exit;
}

/* ============================================================
   POST?action=delete — УДАЛЕНИЕ КОММЕНТАРИЯ
   ============================================================ */
if ($method === 'POST' && $action === 'delete') {

    if (empty($_SESSION['user'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    $role = $_SESSION['user']['role'] ?? 'user';
    if (!in_array($role, ['admin', 'moderator'])) {
        echo json_encode(["error" => "Access denied"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $commentId = (int)($data['id'] ?? 0);

    if (!$commentId) {
        echo json_encode(["error" => "id required"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([$commentId]);

    echo json_encode(["success" => true]);
    exit;
}

/* ============================================================
   НЕПІДТРИМУВАНИЙ МЕТОД
   ============================================================ */
echo json_encode(["error" => "Method not allowed"]);
