<?php
session_start();
require __DIR__ . '/../backend/db.php';

$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$password2 = $_POST['password2'] ?? '';

if ($password !== $password2) {
    header("Location: /auth.php?error=register_password");
    exit;
}

if (!$username || !$email || !$password) {
    header("Location: /auth.php?error=register_empty");
    exit;
}

$pdo = db();

// Перевірка існуючого email
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    header("Location: /auth.php?error=register_email");
    exit;
}

// Хешування
$hash = password_hash($password, PASSWORD_DEFAULT);

// Додавання
$stmt = $pdo->prepare("
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, 'user')
");
$stmt->execute([$username, $email, $hash]);

// Автоматичний логін
$_SESSION['user'] = [
    'id' => $pdo->lastInsertId(),
    'username' => $username,
    'email' => $email,
    'role' => 'user'
];

// Редірект на головну з toast
header("Location: /index.php?success=register");
exit;
