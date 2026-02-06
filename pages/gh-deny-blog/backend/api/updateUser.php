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
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'];

require_once __DIR__ . '/../db.php';
$pdo = db();

// ------------------------------
// ЧИТАЄМО JSON (username, password)
// ------------------------------
$input = json_decode(file_get_contents("php://input"), true);

$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

// ------------------------------
// ОНОВЛЕННЯ USERNAME
// ------------------------------
if ($username) {
    $stmt = $pdo->prepare("UPDATE users SET username = ? WHERE id = ?");
    $stmt->execute([$username, $userId]);
    $_SESSION['user']['username'] = $username;
}

// ------------------------------
// ОНОВЛЕННЯ PASSWORD
// ------------------------------
if ($password) {
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hashed, $userId]);
}

// ------------------------------
// ОНОВЛЕННЯ АВАТАРА (multipart/form-data)
// ------------------------------
if (!empty($_FILES['avatar'])) {

    $uploadDir = __DIR__ . '/../uploads/avatars/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $file = $_FILES['avatar'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid("ava_") . "." . $ext;

    if (move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {

        $path = "/backend/uploads/avatars/" . $filename;

        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$path, $userId]);

        $_SESSION['user']['avatar'] = $path;

        echo json_encode([
            "success" => true,
            "avatar" => $path
        ]);
        exit;
    } else {
        echo json_encode(["error" => "Avatar upload failed"]);
        exit;
    }
}

// ------------------------------
// ФІНАЛЬНА ВІДПОВІДЬ
// ------------------------------
echo json_encode(["success" => true]);
