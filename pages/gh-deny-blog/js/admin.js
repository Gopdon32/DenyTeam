// ==============================
// ADMIN: керування постами + користувачами + ролями
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const adminPostsPanel = document.getElementById("admin-posts-panel");
  if (adminPostsPanel) {
    loadAdminPosts();
  }

  const rolesPanel = document.getElementById("roles-panel");
  const usersPanel = document.getElementById("users-panel");
  if (rolesPanel || usersPanel) {
    loadUsersForAdmin();
  }

  loadCategories(); // для new-category
});

// -------- ПОСТИ --------
async function adminCreate() {
  const fileInput = document.getElementById("new-cover");
  const title = document.getElementById("new-title").value.trim();
  const category_id = document.getElementById("new-category").value;
  const tags = document.getElementById("new-tags").value.trim();
  const content = document.getElementById("new-content").value.trim();

  let cover = null;
  if (fileInput.files[0]) {
    const upload = await api.uploadCover(fileInput.files[0]);
    cover = upload.filename;
  }

  await api.createPost({ title, category_id, tags, content, cover });
  await loadAdminPosts();
}

async function loadAdminPosts() {
  const posts = await api.getPosts();
  const container = document.getElementById("admin-posts");
  if (!container) return;

  if (!posts.length) {
    container.innerHTML = `<p class="muted">Постів поки немає.</p>`;
    return;
  }

  container.innerHTML = posts
    .map(
      (p) => `
    <div class="admin-post">
      <div>
        <strong>${p.title}</strong><br>
        <span class="muted">${p.category_name || ""}</span>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn-secondary" onclick="openEditModal(${p.id})">Редагувати</button>
        <button class="btn-secondary" onclick="adminDelete(${p.id})">Видалити</button>
      </div>
    </div>
  `
    )
    .join("");
}

async function adminDelete(id) {
  if (!confirm("Видалити пост?")) return;
  await api.deletePost(id);
  await loadAdminPosts();
}

async function openEditModal(id) {
  const post = await api.getPost(id);
  if (!post) return;

  document.getElementById("edit-id").value = post.id;
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-tags").value = post.tags || "";
  document.getElementById("edit-content").value = post.content || "";

  await loadEditCategories(post.category_id);

  document.getElementById("edit-modal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}

async function adminSave() {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value.trim();
  const category_id = document.getElementById("edit-category").value;
  const tags = document.getElementById("edit-tags").value.trim();
  const content = document.getElementById("edit-content").value.trim();

  const fileInput = document.getElementById("edit-cover");
  let data = { id, title, category_id, tags, content };

  if (fileInput.files[0]) {
    const upload = await api.uploadCover(fileInput.files[0]);
    data.cover = upload.filename;
  }

  await api.updatePost(data);
  closeEditModal();
  await loadAdminPosts();
}

// -------- КОРИСТУВАЧІ + РОЛІ --------
async function loadUsersForAdmin() {
  const users = await api.getUsers();
  const usersList = document.getElementById("users-list");
  const rolesList = document.getElementById("roles-list");

  if (usersList) {
    usersList.innerHTML = users
      .map(
        (u) => `
      <div class="admin-post">
        <div>
          <strong>${u.username}</strong>
          <span style="color:${u.role_color}">(${u.role})</span>
        </div>
        <div style="display:flex; gap:8px;">
          <select onchange="updateUserRole(${u.id}, this.value)">
            <option value="user" ${u.role === "user" ? "selected" : ""}>User</option>
            <option value="editor" ${u.role === "editor" ? "selected" : ""}>Editor</option>
            <option value="moderator" ${u.role === "moderator" ? "selected" : ""}>Moderator</option>
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
          </select>
          <input type="color" value="${u.role_color}" onchange="updateUserColor(${u.id}, this.value)">
          <button class="btn-secondary" onclick="deleteUser(${u.id})">🗑</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  if (rolesList) {
    rolesList.innerHTML = users
      .map(
        (u) => `
      <div class="admin-post">
        <div>
          <strong>${u.username}</strong>
        </div>
        <div>
          <input type="color" value="${u.role_color}" onchange="updateUserColor(${u.id}, this.value)">
        </div>
      </div>
    `
      )
      .join("");
  }
}

async function updateUserRole(id, role) {
  await api.updateUser({ id, role });
  await loadUsersForAdmin();
}

async function updateUserColor(id, role_color) {
  await api.updateUser({ id, role_color });
  await loadUsersForAdmin();
}

async function deleteUser(id) {
  if (!confirm("Видалити користувача?")) return;
  await api.deleteUser(id);
  await loadUsersForAdmin();
}

// -------- КАТЕГОРІЇ --------
async function loadCategories() {
  const cats = await api.getCategories();
  const select = document.getElementById("new-category");

  if (!select) return;

  select.innerHTML = cats
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join("");
}

async function loadEditCategories(selectedId) {
  const cats = await api.getCategories();
  const select = document.getElementById("edit-category");

  if (!select) return;

  select.innerHTML = cats
    .map(c => `<option value="${c.id}" ${c.id == selectedId ? "selected" : ""}>${c.name}</option>`)
    .join("");
}
