<?php
// ==============================
// API: LOGIN
// ==============================

// Безпечні параметри cookie (secure = false для локалки)
session_set_cookie_params([
    'path' => '/',
    'secure' => false, // ← ВАЖЛИВО: ставимо false для localhost
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE & ~E_DEPRECATED);

require_once __DIR__ . '/../db.php';
$pdo = db();

// Дозволяємо тільки POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Отримуємо JSON
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// Перевірка на порожні поля
if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(["error" => "Empty fields"]);
    exit;
}

// Пошук користувача
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Перевірка пароля
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

// Успішний логін → створюємо сесію
$_SESSION['user'] = [
    "id" => $user['id'],
    "username" => $user['username'],
    "role" => $user['role'],
    "role_color" => $user['role_color']
];

// Відповідь API
echo json_encode([
    "success" => true,
    "user" => $_SESSION['user']
]);
