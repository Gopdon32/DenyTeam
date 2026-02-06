<?php
session_start();

require __DIR__ . '/../backend/db.php';

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$pdo = db();
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    header("Location: /login.php?error=1");
    exit;
}

if (!password_verify($password, $user['password_hash'])) {
    header("Location: /login.php?error=1");
    exit;
}

// Зберігаємо сесію
$_SESSION['user'] = [
    'id' => $user['id'],
    'username' => $user['username'],
    'role' => $user['role'],
];

// Розподіл за ролями
if (in_array($user['role'], ['admin', 'editor', 'moderator'])) {
    header("Location: /index.php?success=login"); 
    exit;
}

// Звичайний користувач → профіль
header("Location: /profile.php");
exit;
