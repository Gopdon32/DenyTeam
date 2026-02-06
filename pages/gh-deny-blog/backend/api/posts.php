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

/*
|--------------------------------------------------------------------------
| PUBLIC GET (доступний всім)
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {

    // Один пост
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                c.name AS category_name,
                c.slug AS category_slug,
                u.username AS author_username,
                u.avatar AS author_avatar
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE p.id = ?
        ");

        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        exit;
    }

    // Список постів
    $stmt = $pdo->query("
        SELECT 
            p.*,
            c.name AS category_name,
            c.slug AS category_slug,
            u.username AS author_username,
            u.avatar AS author_avatar
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}



/*
|--------------------------------------------------------------------------
| ВСЕ НИЖЧЕ — ТІЛЬКИ ДЛЯ АВТОРИЗОВАНИХ
|--------------------------------------------------------------------------
*/
if (empty($_SESSION['user'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$user = $_SESSION['user'];
$userId = $user['id'];
$userRole = $user['role'];



/*
|--------------------------------------------------------------------------
| CREATE POST (admin, editor, moderator)
|--------------------------------------------------------------------------
*/
if ($method === 'POST') {

    if (!in_array($userRole, ['admin', 'editor', 'moderator'])) {
        echo json_encode(["error" => "Access denied"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $pdo->prepare("
        INSERT INTO posts (title, content, category_id, tags, cover, author_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $data['title'] ?? '',
        $data['content'] ?? '',
        $data['category_id'] ?? null,
        $data['tags'] ?? '',
        $data['cover'] ?? null,
        $userId
    ]);

    echo json_encode([
        "success" => true,
        "id" => $pdo->lastInsertId()
    ]);
    exit;
}



/*
|--------------------------------------------------------------------------
| UPDATE POST (admin, moderator, editor(тільки свій))
|--------------------------------------------------------------------------
*/
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        echo json_encode(["error" => "Missing id"]);
        exit;
    }

    $postId = $data['id'];

    // Отримуємо автора посту
    $stmt = $pdo->prepare("SELECT author_id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        echo json_encode(["error" => "Post not found"]);
        exit;
    }

    $isAuthor = ($post['author_id'] == $userId);
    $isMod = ($userRole === 'moderator');
    $isAdmin = ($userRole === 'admin');

    // Правила доступу
    if (!$isAdmin && !$isMod && !$isAuthor) {
        echo json_encode(["error" => "Access denied"]);
        exit;
    }

    // Оновлення
    if (array_key_exists('cover', $data)) {
        $stmt = $pdo->prepare("
            UPDATE posts
            SET title = ?, content = ?, category_id = ?, tags = ?, cover = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['title'] ?? '',
            $data['content'] ?? '',
            $data['category_id'] ?? null,
            $data['tags'] ?? '',
            $data['cover'],
            $postId
        ]);
    } else {
        $stmt = $pdo->prepare("
            UPDATE posts
            SET title = ?, content = ?, category_id = ?, tags = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['title'] ?? '',
            $data['content'] ?? '',
            $data['category_id'] ?? null,
            $data['tags'] ?? '',
            $postId
        ]);
    }

    echo json_encode(["success" => true]);
    exit;
}



/*
|--------------------------------------------------------------------------
| DELETE POST (admin, moderator)
|--------------------------------------------------------------------------
*/
if ($method === 'DELETE') {

    if (!in_array($userRole, ['admin', 'moderator'])) {
        echo json_encode(["error" => "Access denied"]);
        exit;
    }

    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(["error" => "Missing id"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true]);
    exit;
}



echo json_encode(["error" => "Method not allowed"]);
