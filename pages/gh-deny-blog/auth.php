<?php
session_start();

// Якщо вже авторизований — на головну
if (!empty($_SESSION['user'])) {
    header("Location: /index.php");
    exit;
}

$pageTitle = "Авторизація — DenysBlog";
require __DIR__ . '/layout/head.php';
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

      <?php if (!empty($_GET['error']) && $_GET['error'] === 'login'): ?>
        <p class="error">Невірний логін або пароль</p>
      <?php endif; ?>

      <p class="switcher" onclick="switchAuth('register')">Немає акаунта? Зареєструватися</p>
    </section>

    <!-- РЕЄСТРАЦІЯ -->
    <section class="auth-block hidden" id="register-block">
      <h2>Реєстрація</h2>

      <form action="/auth/register-handler.php" method="POST">
        <input name="username" placeholder="Логін" required>
        <input name="password" type="password" placeholder="Пароль" required>
        <input name="password2" type="password" placeholder="Повторіть пароль" required>
        <button class="btn">Зареєструватися</button>
      </form>

      <?php if (!empty($_GET['error']) && $_GET['error'] === 'register'): ?>
        <p class="error">Помилка реєстрації</p>
      <?php endif; ?>

      <p class="switcher" onclick="switchAuth('login')">Вже є акаунт? Увійти</p>
    </section>

  </div>

</main>

<script>
function switchAuth(mode) {
  const login = document.getElementById("login-block");
  const register = document.getElementById("register-block");

  if (mode === "register") {
    login.classList.add("hidden");
    register.classList.remove("hidden");
  } else {
    register.classList.add("hidden");
    login.classList.remove("hidden");
  }
}
</script>

<?php require __DIR__ . '/layout/footer.php'; ?>
