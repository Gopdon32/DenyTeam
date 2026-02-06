<?php
session_start();

$pageTitle = 'Пост — DenysBlog';
$pageScripts = ['posts.js'];

require __DIR__ . '/layout/head.php';
require __DIR__ . '/layout/header.php';
?>

<main class="layout">

  <!-- Повний пост -->
  <article id="post-full" class="post-full">
    <!-- JS підставить заголовок, дату, контент, обкладинку -->
  </article>

  <!-- Коментарі -->
  <section id="comments-section" class="comments-section"></section>

</main>

<!-- Плаваючі кнопки редагування -->
<div id="post-actions" class="post-actions-floating hidden">
  <button id="edit-post-btn" class="fab-btn">✏️</button>
  <button id="delete-post-btn" class="fab-btn danger hidden">🗑️</button>
</div>

<!-- Модалка редагування -->
<div id="edit-post-modal" class="modal">
  <div class="modal-content">
    <h2>Редагувати пост</h2>

    <input type="hidden" id="edit-id">

    <label>Заголовок</label>
    <input id="edit-title">

    <label>Категорія</label>
    <select id="edit-category"></select>

    <label>Теги</label>
    <input id="edit-tags">

    <label>Обкладинка</label>
    <input type="file" id="edit-cover">

    <label>Контент</label>
    <div id="edit-editor" style="height:260px;"></div>

    <div class="modal-actions">
      <button class="btn" id="save-edit-btn">Зберегти</button>
      <button class="btn btn-secondary" id="cancel-edit-btn">Скасувати</button>
    </div>
  </div>
</div>

<?php require __DIR__ . '/layout/footer.php'; ?>
