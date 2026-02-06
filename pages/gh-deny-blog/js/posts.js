// ==============================
// POSTS.JS — одиночний пост, редагування, лайки, коментарі
// ==============================

let quill = null;

document.addEventListener("DOMContentLoaded", async () => {
  const postFullEl = document.getElementById("post-full");

  // Якщо ми НЕ на сторінці одиночного посту — просто виходимо
  if (!postFullEl) return;

  const id = new URLSearchParams(location.search).get("id");
  if (id) {
    const post = await loadSinglePost(id);
    await loadEditCategories(post.category_id);
    await setupPostActions(post);
    setupLikes(id);
    setupComments(id);
  }
});


// ==============================
// Одиночний пост
// ==============================

async function loadSinglePost(id) {
  const post = await api.getPost(id);
  const el = document.getElementById("post-full");

  if (!post) {
    el.innerHTML = `<p class="muted">Пост не знайдено.</p>`;
    return null;
  }

  const comments = await api.getComments(id, 0, 9999);
  const commentsCount = comments.length;

  const avatar = post.author_avatar || "/backend/uploads/avatars/default.png";

  el.innerHTML = `
    ${post.cover ? `<img src="/backend/uploads/images/${post.cover}" class="post-full-cover" alt="">` : ""}

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <img src="${avatar}" class="avatar-small" alt="">
      <div>
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span>${post.author_username}</span>
          <span class="badge">${post.category_name || "Без категорії"}</span>
          <span class="tags">${post.tags || ""}</span>
          <span>🗨️ ${commentsCount}</span>
        </div>
      </div>
    </div>

    <div class="date">${post.created_at || ""}</div>

    <div class="content">${post.content}</div>

    <div id="likes-block"></div>
  `;

  return post;
}



// ==============================
// Завантаження категорій у модалку
// ==============================

async function loadEditCategories(selectedId) {
  const select = document.getElementById("edit-category");
  if (!select) return;

  select.innerHTML = "";

  const categories = await api.getCategories();

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    if (cat.id == selectedId) opt.selected = true;
    select.appendChild(opt);
  });
}



// ==============================
// Плаваючі кнопки редагування
// ==============================

async function setupPostActions(post) {
  const actions = document.getElementById("post-actions");
  const editBtn = document.getElementById("edit-post-btn");
  const deleteBtn = document.getElementById("delete-post-btn");

  if (!actions || !editBtn || !deleteBtn) return;

  const user = await api.getCurrentUser();
  if (!user || !user.role) return;

  const isAuthor = user.id === post.author_id;
  const isMod = user.role === "moderator";
  const isAdmin = user.role === "admin";

  if (isAuthor || isMod || isAdmin) {
    actions.classList.remove("hidden");
  }

  if (isMod || isAdmin) {
    deleteBtn.classList.remove("hidden");
  }

  editBtn.onclick = () => openEditModal(post);
  deleteBtn.onclick = () => deletePost(post.id);
}



// ==============================
// Модалка редагування
// ==============================

function openEditModal(post) {
  document.getElementById("edit-id").value = post.id;
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-tags").value = post.tags;
  document.getElementById("edit-category").value = post.category_id;

  document.getElementById("edit-post-modal").classList.add("show");

  if (!quill) {
    quill = new Quill("#edit-editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }],
          ["blockquote", "code-block"],
          ["clean"]
        ]
      }
    });
  }

  quill.root.innerHTML = post.content;
}

document.getElementById("cancel-edit-btn")?.addEventListener("click", () => {
  document.getElementById("edit-post-modal").classList.remove("show");
});



// ==============================
// Збереження змін
// ==============================

document.getElementById("save-edit-btn")?.addEventListener("click", async () => {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value;
  const tags = document.getElementById("edit-tags").value;

  let category = document.getElementById("edit-category").value;
  if (!category) category = null;

  const content = quill.root.innerHTML;

  let cover = null;
  const file = document.getElementById("edit-cover").files[0];
  if (file) {
    const upload = await api.uploadCover(file);
    cover = upload.filename;
  }

  const res = await api.updatePost({
    id,
    title,
    tags,
    category_id: category,
    content,
    ...(cover ? { cover } : {})
  });

  if (res.success) {
    showToast("Збережено");
    document.getElementById("edit-post-modal").classList.remove("show");
    await loadSinglePost(id);
  }
});



// ==============================
// Видалення посту
// ==============================

async function deletePost(id) {
  if (!confirm("Видалити пост?")) return;

  const res = await api.deletePost(id);

  if (res.success) {
    showToast("Пост видалено");
    location.href = "/index.php";
  }
}



// ==============================
// Лайки
// ==============================

function setupLikes(postId) {
  const block = document.getElementById("likes-block");
  if (!block) return;

  block.innerHTML = `
    <button id="like-btn" class="like-btn">❤️</button>
    <span id="like-count">0</span>
  `;

  const btn = document.getElementById("like-btn");
  const countEl = document.getElementById("like-count");

  api.getLikes(postId).then((res) => {
    countEl.textContent = res.likes;
    if (res.liked) btn.classList.add("liked");
  });

  btn.addEventListener("click", async () => {
    const res = await api.toggleLike(postId);

    if (res.error === "Not logged in") {
      showToast("Увійдіть, щоб поставити лайк");
      return;
    }

    countEl.textContent = res.likes;
    btn.classList.toggle("liked", res.liked);
  });
}



// ==============================
// Коментарі (преміум-версія з видаленням)
// ==============================

async function setupComments(postId) {
  const section = document.getElementById("comments-section");
  if (!section) return;

  const user = await api.getCurrentUser();
  const canDelete = user && (user.role === "admin" || user.role === "moderator");

  section.innerHTML = `
    <h2>Коментарі</h2>

    <div class="comment-form">
      <textarea id="comment-text" placeholder="Ваш коментар..."></textarea>
      <button id="comment-send" class="btn">Надіслати</button>
    </div>

    <div class="comments-list" id="comments-list"></div>

    <button id="load-more-comments" class="btn-secondary" style="margin:12px 0;">Завантажити ще</button>
  `;

  const listEl = document.getElementById("comments-list");
  const loadMoreBtn = document.getElementById("load-more-comments");
  const sendBtn = document.getElementById("comment-send");
  const textEl = document.getElementById("comment-text");

  let offset = 0;
  const limit = 10;

  async function loadCommentsChunk() {
    const comments = await api.getComments(postId, offset, limit);

    if (!comments.length && offset === 0) {
      listEl.innerHTML = `<p class="muted">Коментарів поки немає.</p>`;
      loadMoreBtn.style.display = "none";
      return;
    }

    if (comments.length < limit) {
      loadMoreBtn.style.display = "none";
    }

    comments.forEach((c) => {
      const deleteBtn = canDelete
        ? `<button class="comment-delete-btn" data-id="${c.id}" title="Видалити коментар">🗑️</button>`
        : "";

      listEl.innerHTML += `
        <div class="comment" data-id="${c.id}" style="opacity:1; transition:opacity .3s;">
          <div class="comment-header" style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${c.avatar}" class="avatar-small" alt="">
              <span class="comment-user">${c.username}</span>
            </div>

            <div style="display:flex;align-items:center;gap:10px;">
              <span class="comment-date">${c.created_at}</span>
              ${deleteBtn}
            </div>
          </div>

          <div class="comment-body">${c.text}</div>
        </div>
      `;
    });

    offset += comments.length;

    // Підключаємо обробники видалення
    initDeleteHandlers();
  }

  loadCommentsChunk();
  loadMoreBtn.addEventListener("click", loadCommentsChunk);

  sendBtn.addEventListener("click", async () => {
    const text = textEl.value.trim();
    if (!text) return;

    const res = await api.addComment(postId, text);

    if (res.error === "Not logged in") {
      showToast("Увійдіть, щоб залишити коментар");
      return;
    }

    const deleteBtn = canDelete
      ? `<button class="comment-delete-btn" data-id="new" title="Видалити коментар">🗑️</button>`
      : "";

    listEl.innerHTML =
      `
      <div class="comment" data-id="temp" style="opacity:1; transition:opacity .3s;">
        <div class="comment-header" style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <img src="${res.avatar}" class="avatar-small" alt="">
            <span class="comment-user">${res.username}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="comment-date">Щойно</span>
            ${deleteBtn}
          </div>
        </div>
        <div class="comment-body">${text}</div>
      </div>
      ` + listEl.innerHTML;

    textEl.value = "";

    initDeleteHandlers();
  });

  // ==============================
  // Видалення коментарів
  // ==============================
  function initDeleteHandlers() {
    document.querySelectorAll(".comment-delete-btn").forEach(btn => {
      if (btn.dataset.bound) return; // захист від дублювання
      btn.dataset.bound = "1";

      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Видалити коментар?")) return;

        btn.disabled = true;

        const res = await api.deleteComment(id);

        if (res.success) {
          const el = document.querySelector(`.comment[data-id="${id}"]`);
          if (el) {
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 300);
          }
          showToast("Коментар видалено");
        } else {
          showToast("Помилка видалення");
        }
      });
    });
  }
}

