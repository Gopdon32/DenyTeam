<?php
session_start();

if (empty($_SESSION['user'])) {
    header("Location: /login.php");
    exit;
}

$user = $_SESSION['user'];

$pageTitle = "Профіль — " . htmlspecialchars($user['username']);
$pageScripts = ['profile.js'];

require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php';
?>

<main class="layout profile-page">

  <h1>Профіль</h1>

  <!-- Лівий блок рендериться JS -->
  <section id="profile-info" class="profile-info"></section>

  <!-- Правий блок редагування -->
  <section class="profile-actions">

    <h2>Редагування</h2>

    <label>Ім'я користувача</label>
    <input type="text" id="username-input" value="<?= htmlspecialchars($user['username']) ?>">

    <label>Новий пароль</label>
    <input type="password" id="password-input">

    <label>Аватар</label>

    <!-- Прев’ю ТІЛЬКИ для редагування -->
    <img id="avatar-preview-edit" class="avatar-big" 
         src="<?= $user['avatar'] ?? '/backend/uploads/avatars/default.png' ?>" 
         alt="avatar">

    <input type="file" id="avatar-upload" accept="image/*" hidden>

    <button onclick="document.getElementById('avatar-upload').click()">Обрати файл</button>

    <button id="save-profile">Зберегти</button>

  </section>

</main>

<?php
require __DIR__ . '/layout/footer.php';
