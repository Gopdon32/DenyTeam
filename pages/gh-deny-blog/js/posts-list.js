// ==============================
// POSTS-LIST.JS — список постів, фільтри, пагінація
// ==============================

let currentPage = 1;
const limit = 6;

document.addEventListener("DOMContentLoaded", () => {
  const postsList = document.getElementById("posts-list");
  if (!postsList) return; // Ми не на index.php

  loadCategories();
  loadPosts();
  setupFilters();
});


// ==============================
// Завантаження постів
// ==============================

async function loadPosts() {
  const category = document.getElementById("category-filter").value;
  const tagFilter = document.getElementById("tag-filter").value.trim().toLowerCase();

  const posts = await api.getPosts(currentPage, limit, category);

  renderPosts(posts, tagFilter);
  updatePagination();
}


// ==============================
// Рендер постів
// ==============================

function renderPosts(posts, tagFilter) {
  const container = document.getElementById("posts-list");
  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML = `<p class="muted">Постів поки немає.</p>`;
    return;
  }

  posts.forEach((post) => {
    // Фільтр по тегах
    if (tagFilter) {
      const tags = (post.tags || "").toLowerCase();
      if (!tags.includes(tagFilter)) return;
    }

    const avatar = post.author_avatar || "/backend/uploads/avatars/default.png";

    container.innerHTML += `
      <article class="post-card">
        ${post.cover ? `<img src="/backend/uploads/images/${post.cover}" class="post-cover" alt="">` : ""}

        <h2><a href="/post.php?id=${post.id}">${post.title}</a></h2>

        <div class="post-meta">
          <img src="${avatar}" class="avatar-small" alt="">
          <span>${post.author_username}</span>
          <span class="badge">${post.category_name || "Без категорії"}</span>
        </div>

        <p class="excerpt">${stripHTML(post.content).slice(0, 160)}...</p>

        <div class="post-footer">
          <span>${post.created_at}</span>
          <a href="/post.php?id=${post.id}" class="btn-small">Читати</a>
        </div>
      </article>
    `;
  });
}


// ==============================
// Завантаження категорій
// ==============================

async function loadCategories() {
  const select = document.getElementById("category-filter");
  const categories = await api.getCategories();

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}


// ==============================
// Пагінація
// ==============================

function updatePagination() {
  document.getElementById("page-info").textContent = `Сторінка ${currentPage}`;

  document.getElementById("prev-page").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      loadPosts();
    }
  };

  document.getElementById("next-page").onclick = () => {
    currentPage++;
    loadPosts();
  };
}


// ==============================
// Фільтри
// ==============================

function setupFilters() {
  document.getElementById("category-filter").addEventListener("change", () => {
    currentPage = 1;
    loadPosts();
  });

  document.getElementById("tag-filter").addEventListener("input", () => {
    loadPosts();
  });
}


// ==============================
// Хелпер: видалення HTML
// ==============================

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}
