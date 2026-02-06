<?php
session_start();

require __DIR__ . '/auth/check.php';
requireRole(['admin','editor','moderator']);

$pageTitle = 'Адмін-панель — DenysBlog';
$pageScripts = ['admin.js'];

require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php';

if (empty($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    header("Location: /index.php");
    exit;
}

?>

<main class="layout layout-admin">

  <section id="admin-posts-panel" class="panel">
    <h2>Усі пости</h2>
    <div id="admin-posts" class="admin-posts"></div>
  </section>

  <section id="roles-panel" class="panel">
    <h2>Кольори ролей</h2>
    <div id="roles-list"></div>
  </section>

  <section id="users-panel" class="panel">
    <h2>Користувачі</h2>
    <div id="users-list"></div>
  </section>

</main>

<div id="edit-modal" class="modal">
  <div class="modal-content">
    <h2>Редагувати пост</h2>

    <input type="file" id="edit-cover">
    <input id="edit-id" type="hidden">

    <input id="edit-title" placeholder="Заголовок">
    <select id="edit-category"></select>
    <input id="edit-tags" placeholder="Теги (css, ui)">
    <textarea id="edit-content" placeholder="Текст"></textarea>

    <div class="modal-actions">
      <button class="btn" onclick="adminSave()">Зберегти</button>
      <button class="btn btn-secondary" onclick="closeEditModal()">Скасувати</button>
    </div>
  </div>
</div>

<?php require __DIR__ . '/layout/footer.php'; ?>
