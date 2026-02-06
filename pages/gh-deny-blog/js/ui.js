// ==============================
// UI: мова, базові UI-ефекти
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("lang-toggle");

  // Мова (поки що просто заглушка)
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      alert("Перемикач мови поки що не реалізований :)");
    });
  }
});

// ==============================
// BURGER MENU
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burger-btn");
  const burgerMenu = document.getElementById("burger-menu");

  if (!burgerBtn || !burgerMenu) return;

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    burgerMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  // Закриття при кліку поза меню
  document.addEventListener("click", (e) => {
    if (!burgerMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
      burgerBtn.classList.remove("active");
      burgerMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });
});

// ==============================
// CREATE POST MODAL + QUILL
// ==============================

let cpQuill = null;

function openCreatePostModal() {
  const modal = document.getElementById("create-post-modal");
  if (!modal) return;
  modal.classList.add("show");
}

function closeCreatePostModal() {
  const modal = document.getElementById("create-post-modal");
  if (!modal) return;
  modal.classList.remove("show");
}

// Ініціалізація після повного завантаження (щоб Quill вже був підключений)
window.addEventListener("load", async () => {
  const editorEl = document.getElementById("cp-editor");
  const categorySelect = document.getElementById("cp-category");
  const createBtn = document.getElementById("cp-create-btn");

  if (!editorEl || !categorySelect || !createBtn || typeof Quill === "undefined") {
    return;
  }

  // Quill
  cpQuill = new Quill("#cp-editor", {
    theme: "snow",
    placeholder: "Текст поста...",
  });

  // Категорії
  try {
    const categories = await api.getCategories();
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }

  // Обробник створення
  createBtn.addEventListener("click", createPostHandler);
});

async function createPostHandler() {
  const titleEl = document.getElementById("cp-title");
  const categoryEl = document.getElementById("cp-category");
  const tagsEl = document.getElementById("cp-tags");
  const coverEl = document.getElementById("cp-cover");

  if (!titleEl || !categoryEl || !tagsEl || !coverEl || !cpQuill) return;

  const title = titleEl.value.trim();
  const category = categoryEl.value;
  const tags = tagsEl.value.trim();
  const content = cpQuill.root.innerHTML;
  const coverFile = coverEl.files[0];

  if (!title || !content) {
    if (typeof showToast === "function") {
      showToast("Заповніть заголовок і текст");
    } else {
      alert("Заповніть заголовок і текст");
    }
    return;
  }

  let coverPath = null;

  try {
    if (coverFile && api.uploadCover) {
      const upload = await api.uploadCover(coverFile);
      if (upload.error) {
        throw new Error("Помилка завантаження обкладинки");
      }
      coverPath = upload.path;
    }

    if (!api.createPost) {
      throw new Error("api.createPost не реалізовано");
    }

    const res = await api.createPost({
      title,
      category,
      tags,
      content,
      cover: coverPath
    });

    if (res.error) {
      throw new Error("Помилка створення поста");
    }

    if (typeof showToast === "function") {
      showToast("Пост створено!");
    }
    closeCreatePostModal();
    location.reload();
  } catch (e) {
    console.error(e);
    if (typeof showToast === "function") {
      showToast(e.message || "Помилка створення поста");
    } else {
      alert(e.message || "Помилка створення поста");
    }
  }
}
