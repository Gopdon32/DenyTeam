<?php
session_start();
$pageTitle = 'Реєстрація — DenysBlog';
require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php';
?>

<main class="layout">
  <div class="auth-card">
    <h1>Реєстрація</h1>

    <form action="/auth/register-handler.php" method="POST" class="auth-form">

      <label>Імʼя користувача</label>
      <input type="text" name="username" required>

      <label>Email</label>
      <input type="email" name="email" required>

      <label>Пароль</label>
      <input type="password" name="password" required>

      <label>Повторіть пароль</label>
      <input type="password" name="password2" required>

      <button class="btn" type="submit">Створити акаунт</button>

      <p class="auth-note">
        Вже маєте акаунт? <a href="/login.php">Увійти</a>
      </p>
    </form>
  </div>
</main>

<?php require __DIR__ . '/layout/footer.php'; ?>
