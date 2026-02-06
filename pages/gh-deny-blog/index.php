<?php
session_start();

$pageTitle = 'Мій блог — DenysBlog';
$pageScripts = ['posts-list.js'];

require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php';
?>

<main class="layout">
  <section class="filters">
    <select id="category-filter">
      <option value="">Усі категорії</option>
    </select>
    <input type="text" id="tag-filter" placeholder="Фільтр за тегами (css, ui)">
  </section>

  <section id="posts-list" class="posts-list"></section>

  <div class="pagination">
    <button id="prev-page" class="btn">Назад</button>
    <span id="page-info"></span>
    <button id="next-page" class="btn">Далі</button>
  </div>
</main>

<?php if (!empty($_GET['success'])): ?>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    const type = "<?= $_GET['success'] ?>";

    if (type === "login") showToast("Вхід виконано успішно!", "success");
    if (type === "register") showToast("Реєстрація успішна! Вітаємо 🎉", "success");
    if (type === "post_created") showToast("Пост створено успішно!", "success-neon");

    history.replaceState({}, document.title, window.location.pathname);
  });
</script>
<?php endif; ?>

<?php if (!empty($_GET['create'])): ?>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("create-post-modal");
    if (modal) modal.classList.add("show");

    history.replaceState({}, document.title, "/");
  });
</script>
<?php endif; ?>

<?php
require __DIR__ . '/layout/footer.php';
