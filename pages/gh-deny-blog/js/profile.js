document.addEventListener("DOMContentLoaded", async () => {
  const user = await api.getCurrentUser();
  if (user.error) {
    location.href = "/login.php";
    return;
  }

  renderProfile(user);
  setupProfileEditor(user);
  setupAvatarUpload();
});

// ------------------------------
// РЕНДЕР ПРОФІЛЮ (лівий блок)
// ------------------------------
function renderProfile(user) {
  document.getElementById("profile-info").innerHTML = `
    <div class="profile-card">
      <img id="avatar-preview-profile" 
           src="${user.avatar || '/backend/uploads/avatars/default.png'}" 
           class="avatar-big">

      <h2>${user.username}</h2>
      <p>Роль: <b style="color:${user.role_color}">${user.role}</b></p>
      <p>Дата реєстрації: ${user.created_at}</p>
      <p>Постів: ${user.posts_count}</p>
      <p>Коментарів: ${user.comments_count}</p>

      ${user.role === 'admin' ? `
        <a href="/admin.php" class="btn" style="margin-top: 12px;">Адмін‑панель</a>
      ` : ''}
    </div>
  `;
}

// ------------------------------
// РЕДАГУВАННЯ ПРОФІЛЮ
// ------------------------------
function setupProfileEditor(user) {
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const avatarInput = document.getElementById("avatar-upload");

  usernameInput.value = user.username;

  document.getElementById("save-profile").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const avatarFile = avatarInput.files[0];

    // ------------------------------
    // ВАЛІДАЦІЯ
    // ------------------------------
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    if (!usernameRegex.test(username)) {
      showToast("Нікнейм може містити тільки букви, цифри, _ та -, без пробілів. Довжина 3–20 символів.");
      usernameInput.style.borderColor = "var(--danger)";
      return;
    } else {
      usernameInput.style.borderColor = "";
    }

    if (password && password.length < 6) {
      showToast("Пароль має містити мінімум 6 символів.");
      passwordInput.style.borderColor = "var(--danger)";
      return;
    } else {
      passwordInput.style.borderColor = "";
    }

    // ------------------------------
    // 1. ОНОВЛЕННЯ username + password через updateUser.php
    // ------------------------------
    const res = await fetch("/backend/api/updateUser.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }).then(r => r.json());

    if (!res.success) {
      showToast(res.error || "Помилка");
      return;
    }

    // Оновлюємо нік у шапці
    const headerName = document.querySelector(".header-username");
    if (headerName) headerName.textContent = username;

    // Оновлюємо нік у лівому блоці профілю
    const profileName = document.querySelector("#profile-info h2");
    if (profileName) profileName.textContent = username;

    // ------------------------------
    // 2. ЯКЩО Є АВАТАР — ЗАВАНТАЖУЄМО через updateUser.php
    // ------------------------------
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const upload = await fetch("/backend/api/updateUser.php", {
        method: "POST",
        credentials: "include",
        body: formData
      }).then(r => r.json());

      if (!upload.success) {
        showToast(upload.error || "Помилка завантаження аватара");
        return;
      }

      const newAvatar = upload.avatar;

      // Прев’ю в правому блоці (редагування)
      const previewEdit = document.getElementById("avatar-preview-edit");
      if (previewEdit) previewEdit.src = newAvatar;

      // Аватар у лівому блоці профілю
      const previewProfile = document.getElementById("avatar-preview-profile");
      if (previewProfile) previewProfile.src = newAvatar;

      // Аватар у шапці
      const headerAvatar = document.querySelector(".header-avatar");
      if (headerAvatar) headerAvatar.src = newAvatar;
    }

    // ------------------------------
    // ГОТОВО
    // ------------------------------
    showToast("Профіль оновлено");
  });
}



// ------------------------------
// АВАТАР — локальний прев’ю (правий блок)
// ------------------------------
function setupAvatarUpload() {
  const input = document.getElementById("avatar-upload");
  const previewEdit = document.getElementById("avatar-preview-edit");

  input.addEventListener("change", () => {
    if (!input.files[0]) return;

    const reader = new FileReader();
    reader.onload = e => {
      previewEdit.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  });
}