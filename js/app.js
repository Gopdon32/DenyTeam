/*
 * [CONFIG] Application state and supported locales
 */
const LANGS = ["ua", "en", "de"];
const LANGUAGE_CYCLE = { ua: "en", en: "de", de: "ua" };
let currentLang = localStorage.getItem("lang") || "ua";
let dictionary = {};
let users = {};
let activeUser = null;
let userKey = "me";
let activeFilter = "all";
let activeSearch = "";
const PAGE_SIZE = 6;
let currentPage = 1;
let revealObserver = null;

const getText = key =>
  dictionary[currentLang]?.[key] ||
  dictionary.en?.[key] ||
  dictionary.ua?.[key] ||
  "";

const getLocalizedDescription = post =>
  post.desc?.[currentLang] || post.desc?.en || post.desc?.ua || "";

const getUserBio = () =>
  activeUser.bio?.[currentLang] ||
  activeUser.bio?.en ||
  activeUser.bio?.ua ||
  "";

/**
 * [CORE] Application initialization
 */
async function init() {
  try {
    const timestamp = Date.now();

    const [langRes, dbRes] = await Promise.all([
      fetch(`./lang.json?v=${timestamp}`),
      fetch(`./data/projects.json?v=${timestamp}`),
    ]);

    dictionary = await langRes.json();
    users = await dbRes.json();

    const params = new URLSearchParams(window.location.search);
    userKey = params.get("user") || "me";
    activeUser = users[userKey] || users.me;

    applyUserTheme();
    setupEventListeners();
    setLanguage(currentLang);

    hidePreloader();
  } catch (error) {
    console.error("Critical initialization error:", error);
    hidePreloader();
  }
}

/**
 * [LANGUAGE] Update current locale and redraw UI
 */
function setLanguage(lang) {
  if (!LANGS.includes(lang)) lang = "ua";
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  document.documentElement.lang = currentLang;
  const langBtn = document.getElementById("lang-switch");
  if (langBtn) langBtn.textContent = currentLang.toUpperCase();
  currentPage = 1;
  render(activeFilter, false, activeSearch, currentPage);
}

/**
 * [THEME] Apply user-specific theme and active navigation state
 */
function applyUserTheme() {
  const root = document.documentElement;
  root.removeAttribute("style");

  const theme = activeUser.theme || {};
  const colors = {
    "accent-green":
      theme.accent ||
      (userKey === "games"
        ? "#ff79c6"
        : userKey === "blog"
          ? "#ff0033"
          : "#22c55e"),
    "bg-black": theme.bg || "#080808",
    "bg-surface": theme.surface || "#121212",
    "bg-card": theme.card || "#181818",
  };

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  const avatarEl = document.querySelector(".avatar");
  if (avatarEl) {
    if (activeUser.avatar) {
      avatarEl.style.backgroundImage = `url('${activeUser.avatar}')`;
      avatarEl.innerText = "";
    } else {
      avatarEl.style.backgroundImage = "none";
      avatarEl.style.backgroundColor = colors["accent-green"];
      avatarEl.innerText = activeUser.name ? activeUser.name[0] : "D";
    }
  }

  document.body.className =
    activeUser.themeClass ||
    (userKey === "games"
      ? "soft-mode"
      : userKey === "blog"
        ? "audi-mode"
        : "default-mode");
}

/**
 * [RENDER] Main render function for the app
 */
function render(filter = "all", isTag = false, searchTerm = "", page = 1) {
  activeFilter = filter;
  activeSearch = searchTerm.trim();
  currentPage = page;
  const t = dictionary[currentLang] || {};

  if (userKey === "blog" || userKey === "games") {
    document.body.classList.add("hide-profile-section", "hide-filters");
  } else {
    document.body.classList.remove("hide-profile-section", "hide-filters");
  }

  document.getElementById("about-name").textContent = activeUser.name;
  document.getElementById("hero-subtitle").textContent =
    t[activeUser.roleKey] || activeUser.role || "";
  document.getElementById("about-text").textContent = getUserBio();
  document.getElementById("count-projects").textContent =
    activeUser.posts?.length ?? 0;
  document.getElementById("status-text").textContent =
    t[activeUser.statusKey] || "";
  document.getElementById("footer-text").textContent = t["footer_text"] || "";
  document.getElementById("works-title").textContent = t["works_title"] || "";
  document.getElementById("label-projects").textContent =
    t["projects_label"] || "Projects";
  document.getElementById("label-status").textContent =
    t["status_label"] || "Status";
  document.getElementById("project-search").placeholder =
    t["search_placeholder"] || "";
  document.getElementById("filter_all").textContent = t["filter_all"] || "All";
  document.getElementById("filter_layout").textContent =
    t["filter_layout"] || "Layout / Design";
  document.getElementById("filter_js").textContent =
    t["filter_js"] || "JavaScript / Scripts";
  document.getElementById("lang-switch").textContent =
    currentLang.toUpperCase();

  [
    ["nav-me", "nav_portfolio"],
    ["nav-blog", "nav_blog"],
    ["nav-games", "nav_games"],
  ].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[key] || el.textContent;
  });

  if (activeUser.links) {
    document.getElementById("social-container").innerHTML = activeUser.links
      .map(
        link =>
          `<a href="${link.url}" target="_blank" class="social-item"><i class="${link.icon}"></i></a>`,
      )
      .join("");
  }

  if (activeUser.badges) {
    document.getElementById("user-badges").innerHTML = activeUser.badges
      .map(badge => `<span class="premium-badge">${badge}</span>`)
      .join("");
  }

  renderPostGrid(filter, isTag, activeSearch, currentPage);
}

function renderPostGrid(
  filter = "all",
  isTag = false,
  searchTerm = "",
  page = 1,
) {
  const posts = activeUser.posts || [];
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  let data = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filter !== "all") {
    data = isTag
      ? data.filter(project => project.tags.includes(filter))
      : data.filter(project => project.category === filter);
  }

  if (searchTerm) {
    const query = searchTerm.toLowerCase();
    data = data.filter(project => {
      const searchable = [
        project.title,
        getLocalizedDescription(project),
        project.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }

  const totalPages = Math.max(Math.ceil(data.length / PAGE_SIZE), 1);
  page = Math.min(Math.max(page, 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageData = data.slice(start, start + PAGE_SIZE);

  renderPagination(totalPages, page);

  const stats = document.getElementById("filter-stats");
  if (stats) {
    stats.textContent = data.length
      ? `${getText("page_label") || "Page"} ${page} / ${totalPages}`
      : "";
  }

  if (!pageData.length) {
    grid.innerHTML = `<div class="no-results">${getText("empty_results") || "No results found"}</div>`;
    return;
  }

  grid.innerHTML = pageData
    .map((project, index) => {
      const desc = getLocalizedDescription(project);
      const dateValue = project.date ? String(project.date).split("T")[0] : "";
      return `
        <div class="card post-card" style="animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.05}s">
            ${project.featured ? '<div class="featured-badge">NEW</div>' : ""}
            <div class="card-img" style="background-image: url('${project.image}')"></div>
            <div class="card-content">
                <span class="post-date">${dateValue}</span>
                <div class="tags">${project.tags
                  .map(tag => `<span class="tag clickable-tag">#${tag}</span>`)
                  .join("")}</div>
                <h3>${project.title}</h3>
                <p>${desc}</p>
                <div class="btn-open">${getText("btn_details") || "Read more"}</div>
            </div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll(".card").forEach((card, index) => {
    card.onclick = e => {
      if (!e.target.classList.contains("clickable-tag"))
        showModal(pageData[index]);
    };
  });

  grid.querySelectorAll(".clickable-tag").forEach(tag => {
    tag.onclick = e => {
      e.stopPropagation();
      render(tag.innerText.replace("#", ""), true, activeSearch, 1);
      document
        .getElementById("works-title")
        ?.scrollIntoView({ behavior: "smooth" });
    };
  });

  applyScrollReveal();
}

/**
 * [UI HELPERS] Modal and toast helpers
 */
function showModal(post) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-data");
  if (!modal || !content) return;

  const desc = getLocalizedDescription(post);
  const actionText = getText("btn_demo") || "Open";
  const closeText = getText("btn_close") || "Close";

  const modalDate = post.date ? String(post.date).split("T")[0] : "";
  content.innerHTML = `
      <div class="modal-card">
        <div class="modal-header-img" style="background-image: url('${post.image}')"></div>
        <div class="modal-body">
          <div class="modal-meta-bar">
            <span><i class="fa-regular fa-calendar"></i> ${modalDate}</span>
            <div class="tags">${post.tags
              .map(tag => `<span class="tag">#${tag}</span>`)
              .join("")}</div>
          </div>
          <h2>${post.title}</h2>
          <div class="description-section">
            <p>${desc}</p>
          </div>
          <div class="modal-main-content post-content markdown-content" aria-live="polite">
            <p>Завантаження...</p>
          </div>
          <div class="modal-footer-actions">
            ${post.link && post.link !== "#" ? `<a href="${post.link}" target="_blank" class="btn-open primary-action">${actionText}</a>` : ""}
            <button class="btn-secondary" onclick="closeModal()">${closeText}</button>
          </div>
        </div>
      </div>
    `;

  // ✅ Завантажуємо Markdown контент для ВСІХ постів, де є content_path або slug
  if (post.content_path || post.slug) {
    loadPostContent(post);
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";
  document.body.style.overflow = "auto";
}

window.closeModal = closeModal;

function renderPagination(totalPages, page) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return `
      <button class="page-btn${pageNumber === page ? " active" : ""}" data-page="${pageNumber}">${pageNumber}</button>
    `;
  }).join("");

  pagination.querySelectorAll(".page-btn").forEach(btn => {
    btn.onclick = () => {
      const selected = Number(btn.dataset.page);
      if (selected && selected !== currentPage) {
        currentPage = selected;
        render(activeFilter, false, activeSearch, currentPage);
        document
          .getElementById("works-title")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    };
  });
}

function applyScrollReveal() {
  if (typeof IntersectionObserver === "undefined") return;

  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
    },
  );

  document.querySelectorAll(".post-card").forEach(card => {
    card.classList.remove("revealed");
    revealObserver.observe(card);
  });
}

function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
  }
  document.body.classList.remove("loading");
}

async function loadPostContent(post) {
  const container = document.querySelector(".modal-main-content");
  if (!container) return;

  // 1. Формуємо та очищаємо шлях до файлу
  let rawPath = post.content_path;
  if (!rawPath) {
    const fileName = `${post.slug || post.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    // Перевіряємо категорію або дефолтимо на portfolio
    rawPath =
      post.category === "blog"
        ? `content/blog/${fileName}`
        : `content/portfolio/${fileName}`;
  }

  if (rawPath.startsWith("/")) {
    rawPath = rawPath.slice(1);
  }

  try {
    // 2. Перша спроба: відносний fetch з крапкою попереду
    let res = await fetch("./" + rawPath);

    // 3. Друга спроба (резервна): якщо файлу немає за відносним шляхом — стукаємо на GitHub Raw
    if (!res.ok) {
      const rawUrl = `https://raw.githubusercontent.com/Gopdon32/DenyTeam/main/${rawPath}`;
      res = await fetch(rawUrl);
    }

    if (!res.ok) throw new Error("Not found");

    let text = await res.text();

    // Прибираємо Frontmatter (блок усередині --- ... ---)
    text = text.replace(/^---\n[\s\S]*?\n---\n/, "");

    // Видаляємо дублюючий заголовок H1/H2, якщо він збігається з назвою
    const headingMatch = text.match(/^\s*(#{1,2})\s*(.+?)\s*\n+/);
    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      const normalize = str =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9а-яєіїґ]+/gi, " ")
          .trim();
      if (normalize(headingText) === normalize(post.title)) {
        text = text.slice(headingMatch[0].length);
      }
    }

    // Рендеримо Markdown у HTML
    const html = typeof marked !== "undefined" ? marked.parse(text) : text;
    container.innerHTML = html;

    // Підсвітка коду Prism, якщо є
    if (window.Prism && typeof window.Prism.highlightAll === "function") {
      window.Prism.highlightAll();
    }
  } catch (err) {
    console.error("Failed to load post content", err);
    container.innerHTML = "<p>Не вдалося завантажити повний текст статті.</p>";
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast visible";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * [EVENTS] Event wiring for UI actions
 */
function setupEventListeners() {
  const langBtn = document.getElementById("lang-switch");
  if (langBtn) {
    langBtn.onclick = () => setLanguage(LANGUAGE_CYCLE[currentLang]);
  }

  const burgerBtn = document.getElementById("burger-btn");
  const mobileNav = document.querySelector(".user-switcher");
  if (burgerBtn && mobileNav) {
    burgerBtn.onclick = event => {
      event.stopPropagation();
      burgerBtn.classList.toggle("active");
      mobileNav.classList.toggle("open");
    };

    document.addEventListener("click", event => {
      if (
        mobileNav.classList.contains("open") &&
        !mobileNav.contains(event.target) &&
        !burgerBtn.contains(event.target)
      ) {
        mobileNav.classList.remove("open");
        burgerBtn.classList.remove("active");
      }
    });
  }

  const searchInput = document.getElementById("project-search");
  if (searchInput) {
    searchInput.addEventListener("input", event => {
      currentPage = 1;
      render(activeFilter, false, event.target.value, 1);
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!btn.dataset.cat) return;
      document.querySelectorAll(".filter-btn.active").forEach(activeBtn => {
        activeBtn.classList.remove("active");
      });
      btn.classList.add("active");
      currentPage = 1;
      render(btn.dataset.cat, false, activeSearch, 1);
    });
  });

  window.onscroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progress = document.getElementById("progress-bar");
    if (progress) progress.style.width = `${scrolled}%`;

    const scrollBtn = document.getElementById("scroll-top");
    if (scrollBtn) scrollBtn.classList.toggle("visible", window.scrollY > 500);
  };

  const topBtn = document.getElementById("scroll-top");
  if (topBtn) {
    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.onclick = event => {
    if (event.target.id === "modal") {
      closeModal();
    }
  };
}

init();
