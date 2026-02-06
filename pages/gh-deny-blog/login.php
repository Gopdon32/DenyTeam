<?php
session_start();

// Якщо вже авторизований — перенаправляємо за роллю
if (!empty($_SESSION['user'])) {

    if (in_array($_SESSION['user']['role'], ['admin', 'editor', 'moderator'])) {
        header("Location: /admin.php");
        exit;
    }

    header("Location: /profile.php");
    exit;
}

$pageTitle = "Авторизація — DenysBlog";

require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php'; // ← ЦЕ ГОЛОВНЕ
?>

<main class="auth-wrapper">

  <div class="auth-container">

    <!-- ЛОГІН -->
    <section class="auth-block" id="login-block">
      <h2>Вхід</h2>

      <form action="/auth/login-handler.php" method="POST">
        <input name="username" placeholder="Логін" required>
        <input name="password" type="password" placeholder="Пароль" required>
        <button class="btn">Увійти</button>
      </form>

      <p class="switcher">
        <a href="/register.php">Немає акаунта? Зареєструватися</a>
      </p>  

    </section>

  </div>

</main>

<script>

<?php require __DIR__ . '/layout/footer.php'; ?>
