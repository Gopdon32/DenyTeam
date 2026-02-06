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

require_once __DIR__ . '/../db.php';
$pdo = db();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, username, role, role_color FROM users");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'PUT') {
    if (empty($_SESSION['user'])) {
        echo json_encode(["error" => "Not logged in"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username'] ?? '');
    $password = trim($data['password_hash'] ?? '');
    $avatar = trim($data['avatar'] ?? '');

    $id = $_SESSION['user']['id'];

    if ($username !== '') {
        $stmt = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
        $stmt->execute([$username, $id]);
        $_SESSION['user']['username'] = $username;
    }

    if ($password !== '') {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$hash, $id]);
    }

    if ($avatar !== '') {
        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$avatar, $id]);
        $_SESSION['user']['avatar'] = $avatar;
    }

    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "Method not allowed"]);
