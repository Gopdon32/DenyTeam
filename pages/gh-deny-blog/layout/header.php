<?php
// ==============================
// HEADER + NAVIGATION
// ==============================
?>

<!-- Прелоадер -->
<div id="preloader"><div class="spinner"></div></div>

<!-- Toast -->
<div id="toast" class="toast"></div>

<!-- HEADER -->
<header class="header">

  <!-- Логотип -->
  <div class="header-left">
    <a href="/index.php" class="logo">DenysBlog</a>
  </div>

  <!-- Десктоп-меню -->
  <nav class="nav-desktop">

    <a href="/index.php">Головна</a>

    <?php if (!empty($_SESSION['user'])): ?>

      <!-- Нікнейм -->
      <a href="/profile.php" class="user-link">
        <?= htmlspecialchars($_SESSION['user']['username']) ?>
      </a>

      <!-- Створити пост -->
      <?php if (in_array($_SESSION['user']['role'], ['admin','editor','moderator'])): ?>
        <button class="btn create-post-btn" type="button" onclick="location.href='/?create=1'">
          Створити пост
        </button>
      <?php endif; ?>
    <!-- 🔥 Кнопка зміни теми (десктоп) -->
    <button id="theme-toggle" class="nav-link" type="button">Тема: ☀ / 🌙</button>
      <a href="/auth/logout.php">Вийти</a>

    <?php else: ?>

      <a href="/login.php">Увійти</a>
      <a href="/register.php">Реєстрація</a>

    <?php endif; ?>

  </nav>

  <!-- Бургер -->
  <button class="burger" id="burger">
    <span></span><span></span><span></span>
  </button>

</header>

<!-- Мобільне меню -->
<div class="mobile-menu" id="mobile-menu">

  <a href="/index.php">Головна</a>

  <?php if (!empty($_SESSION['user'])): ?>

    <a href="/profile.php" class="user-link">
      <?= htmlspecialchars($_SESSION['user']['username']) ?>
    </a>

    <?php if (in_array($_SESSION['user']['role'], ['admin','editor','moderator'])): ?>
      <button class="burger-link" type="button" onclick="location.href='/?create=1'">
        Створити пост
      </button>
    <?php endif; ?>

    <a href="/auth/logout.php">Вийти</a>

  <?php else: ?>

    <a href="/login.php">Увійти</a>
    <a href="/register.php">Реєстрація</a>

  <?php endif; ?>

  <hr>

  <button id="lang-toggle-mobile" class="burger-link" type="button">Мова: UA / EN</button>
  <button id="theme-toggle-mobile" class="burger-link" type="button">Тема: ☀ / 🌙</button>

</div>
