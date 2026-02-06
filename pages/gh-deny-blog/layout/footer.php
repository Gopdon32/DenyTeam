<?php
// ==============================
// LAYOUT: FOOTER + SCRIPTS
// ==============================
?>

  <!-- POPUP: Створити пост -->
  <div id="create-post-modal" class="modal">
    <div class="modal-content">

      <h2>Створити новий пост</h2>

      <label>Обкладинка</label>
      <input type="file" id="cp-cover">

      <label>Заголовок</label>
      <input type="text" id="cp-title" placeholder="Заголовок">

      <label>Категорія</label>
      <select id="cp-category"></select>

      <label>Теги (css, ui, design)</label>
      <input type="text" id="cp-tags">

      <label>Текст</label>
      <div id="cp-editor" style="height: 220px;"></div>

      <div class="modal-actions">
        <button class="btn" id="cp-create-btn" type="button">Створити</button>
        <button class="btn btn-secondary" type="button" onclick="closeCreatePostModal()">Скасувати</button>
      </div>

    </div>
  </div>

  <footer class="site-footer">
    <span>© DenyTeam</span>
  </footer>

  <!-- Глобальні скрипти -->
  <script src="/js/loader.js"></script>
  <script src="/js/data.js"></script>
  <script src="/js/api.js"></script>
  <script src="/js/auth.js"></script>
  <script src="/js/ui.js"></script>
  <script src="/js/app.js"></script>

  <!-- Quill JS -->
  <script src="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"></script>

  <!-- Страничні скрипти -->
  <?php if (!empty($pageScripts)): ?>
    <?php foreach ($pageScripts as $script): ?>
      <script src="/js/<?= htmlspecialchars($script) ?>"></script>
    <?php endforeach; ?>
  <?php endif; ?>

</body>
</html>
