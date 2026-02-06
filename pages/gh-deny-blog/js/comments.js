// ==============================
// COMMENTS: рендер + відправка
// ==============================

async function initComments(postId) {
  await loadComments(postId);

  const btn = document.getElementById("comment-submit");
  const textarea = document.getElementById("comment-content");

  if (btn && textarea) {
    btn.addEventListener("click", async () => {
      const text = textarea.value.trim();
      if (!text) return;

      await api.addComment(postId, text);
      textarea.value = "";
      await loadComments(postId);
    });
  }
}

async function loadComments(postId) {
  const comments = await api.getComments(postId);
  const list = document.getElementById("comments-list");

  if (!comments.length) {
    list.innerHTML = `<p class="muted">Коментарів поки немає.</p>`;
    return;
  }

  list.innerHTML = comments
    .map(
      (c) => `
    <div class="comment">
      <div class="comment-header">
        <div>
          ${c.avatar ? `<img src="/backend/uploads/avatars/${c.avatar}" class="avatar-small" alt="">` : ""}
          <span class="comment-user" style="color:${c.role_color || '#888'}">
            ${c.username || 'Гість'}${c.role ? ` (${c.role})` : ""}
          </span>
        </div>
        <span class="comment-date">${c.created_at || ""}</span>
      </div>
      <div class="comment-body">
        ${c.content}
      </div>
    </div>
  `
    )
    .join("");
}
