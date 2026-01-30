document.addEventListener("DOMContentLoaded", () => {
  rerenderApp();
});

/* RERENDER */

function rerenderApp() {
  const app = document.getElementById("app");
  const lang = localStorage.getItem("lang") || "ua";
  const theme = localStorage.getItem("theme") || "dark";
  const car = window.cars[0];

  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");

  app.innerHTML = `
    ${renderNav(lang)}

    <main class="page fade-in">

      ${renderHero(car, lang)}
      ${renderFeatures(car, lang)}
      ${renderSpecs(car, lang)}
      ${renderModels(car, lang)}
      ${renderCondition(car, lang)}
      ${renderImportant(car, lang)}
      ${renderTrailer(car, lang)}
      ${renderGallery(car, lang)}
      ${renderWarranty(car, lang)}
      ${renderContact(car, lang)}
      ${renderFooter(lang)}

    </main>

    ${renderOffcanvas()}
    ${renderLightbox()}
  `;

  initLanguage();
  initTheme();
  initForm();
  initOffcanvas();
  initGalleryLightbox();

}

/* RENDER FUNCTIONS */

function renderNav(lang) {
  const t = window.langData[lang].nav;

  return `
    <header class="nav">
      <div class="nav-inner">
        <div class="nav-logo">
          <img class="nav-logo-mark" src="src/images/logo.webp" alt="Kunze Auto Logo" />
          <div class="nav-logo-text">
            <div class="nav-logo-title">Kunze Auto</div>
            <div class="nav-logo-sub">GAC Toyota BZ3X</div>
          </div>
        </div>

        <nav class="nav-links">
          <a class="nav-link" href="#hero">${t.home}</a>
          <a class="nav-link" href="#features">${t.features}</a>
          <a class="nav-link" href="#specs">${t.specs}</a>
          <a class="nav-link" href="#models">Моделі</a>
          <a class="nav-link" href="#gallery">${t.gallery}</a>
          <a class="nav-link" href="#warranty">${t.warranty}</a>
          <a class="nav-link" href="#contact">${t.contact}</a>
        </nav>

        <div class="nav-controls">
          <button class="lang-toggle" id="langToggle">
            <span class="lang-flag"></span>
            <span id="langLabel">${lang === "ua" ? "UA" : "EN"}</span>
          </button>
          <button class="theme-toggle" id="themeToggle">
            <span class="theme-dot"></span>
          </button>
        </div>

        <button class="nav-burger" id="navBurger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;
}

function renderOffcanvas() {
  return `
    <div class="offcanvas" id="offcanvas">
      <div class="offcanvas-backdrop" id="offcanvasBackdrop"></div>
      <div class="offcanvas-panel">
        <button class="offcanvas-close" id="offcanvasClose">&times;</button>

        <nav class="offcanvas-links">
          <a href="#hero">Головна</a>
          <a href="#features">Переваги</a>
          <a href="#specs">Характеристики</a>
          <a href="#models">Моделі</a>
          <a href="#gallery">Галерея</a>
          <a href="#warranty">Гарантія</a>
          <a href="#contact">Контакти</a>
        </nav>

        <div class="offcanvas-contacts">
          <div class="offcanvas-title">Контакти</div>
          <a href="tel:+380732999777">+38 073 299 97 77</a>
          <a href="tel:+380756853150">+38 075 685 31 50</a>
        </div>

        <div class="offcanvas-social">
          <a href="https://t.me/kunzeauto" target="_blank">
            <img src="src/images/telegram.svg" alt="Telegram" />
          </a>
          <a href="https://wa.me/380756853150" target="_blank">
            <img src="src/images/whatsapp.svg" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderLightbox() {
  return `
    <div class="lightbox" id="lightbox" aria-hidden="true">
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-inner">
        <button class="lightbox-close" data-lightbox-close>&times;</button>
        <button class="lightbox-nav lightbox-prev" data-lightbox-prev>&larr;</button>
        <img class="lightbox-image" id="lightboxImage" alt="" />
        <button class="lightbox-nav lightbox-next" data-lightbox-next>&rarr;</button>
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    </div>
  `;
}

function renderHero(car, lang) {
  const t = window.langData[lang].hero;

  return `
    <section class="hero" id="hero">
      <div>
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          <span>${t.badge}</span>
        </div>
        <h1 class="hero-title">${t.title}</h1>
        <p class="hero-subtitle">${t.subtitle}</p>

        <div class="hero-actions">
          <button class="btn-primary" data-scroll="#contact">${t.primaryCta}</button>
          <button class="btn-secondary" data-scroll="#specs">${t.secondaryCta}</button>
        </div>

        <div class="hero-meta">
          <div class="hero-meta-item">
            <div class="hero-meta-label">${t.rangeLabel}</div>
            <div class="hero-meta-value">${car.range}</div>
          </div>
          <div class="hero-meta-item">
            <div class="hero-meta-label">${t.batteryLabel}</div>
            <div class="hero-meta-value">${car.battery}</div>
          </div>
          <div class="hero-meta-item">
            <div class="hero-meta-label">${t.powerLabel}</div>
            <div class="hero-meta-value">${car.power}</div>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card">
          <div class="hero-car">
            <img src="src/images/bz3x-hero.jpg" alt="BZ3X" class="hero-car-img" />
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFeatures(car, lang) {
  const t = window.langData[lang].features;

  return `
    <section class="section" id="features">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="features-grid">
        ${t.items
          .map(
            (item) => `
          <article class="feature-card">
            <div class="feature-label">${item.label}</div>
            <div class="feature-title">${item.title}</div>
            <div class="feature-text">${item.text}</div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderSpecs(car, lang) {
  const t = window.langData[lang].specs;

  return `
    <section class="section" id="specs">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="specs-grid">
        ${t.items
          .map(
            (item) => `
          <article class="spec-card">
            <div class="spec-label">${item.label}</div>
            <div class="spec-value">${item.value}</div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderModels(car, lang) {
  const t = window.langData[lang].models;

  return `
    <section class="section" id="models">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="models-grid">
        ${t.items
          .map(
            (m) => `
          <article class="model-card">
            <div class="model-name">${m.name}</div>
            <div class="model-price">${m.priceGross}</div>

            <ul class="model-list">
              <li><strong>Тип:</strong> ${m.type}</li>
              <li><strong>Кольори:</strong> ${m.colors}</li>
              <li><strong>Запас ходу:</strong> ${m.range}</li>
              <li><strong>Батарея:</strong> ${m.battery}</li>
              ${m.power ? `<li><strong>Потужність:</strong> ${m.power}</li>` : ""}
            </ul>

            <button class="model-cta" data-scroll="#contact">
              Отримати консультацію
            </button>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}


function renderCondition(car, lang) {
  const t = window.langData[lang].condition;

  return `
    <section class="section" id="condition">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <article class="warranty-card">
        <ul class="warranty-list">
          ${t.points.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </article>
    </section>
  `;
}

function renderImportant(car, lang) {
  const t = window.langData[lang].important;

  return `
    <section class="section" id="important">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
      </div>

      <div class="features-grid">
        ${t.items
          .map(
            (i) => `
          <article class="feature-card" style="border-color: rgba(250,204,21,0.6);">
            <div class="feature-title">${i}</div>
          </article>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTrailer(car, lang) {
  const t = window.langData[lang].trailer;

  return `
    <section class="section" id="trailer">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="hero-card" style="padding:0; overflow:hidden;">
        <video 
          src="src/videos/bozhi-3x-trailer.mp4"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          style="width:100%; height:auto; border-radius:18px; display:block;"
        ></video>
      </div>
    </section>
  `;
}


function renderGallery(car, lang) {
  const t = window.langData[lang].gallery;

  return `
    <section class="section" id="gallery">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="gallery-grid">
        ${t.items
          .map(
            (item, index) => `
          <button class="gallery-item" data-gallery-index="${index}" type="button">
            <img src="${item.img}" alt="${item.label}" class="gallery-img" />
            <div class="gallery-caption">
              <div class="gallery-label">${item.label}</div>
              <div class="gallery-text">${item.text}</div>
            </div>
          </button>
        `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderWarranty(car, lang) {
  const t = window.langData[lang].warranty;

  return `
    <section class="section" id="warranty">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <article class="warranty-card">
        <ul class="warranty-list">
          ${t.points.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </article>
    </section>
  `;
}

function renderContact(car, lang) {
  const t = window.langData[lang].contact;

  return `
    <section class="section" id="contact">
      <div class="section-header">
        <h2 class="section-title">${t.title}</h2>
        <p class="section-subtitle">${t.subtitle}</p>
      </div>

      <div class="form-grid">
        <form class="contact-form">
          <div class="form-row">
            <label class="form-label">${t.nameLabel}</label>
            <input class="form-input" type="text" name="name" required />
          </div>

          <div class="form-row">
            <label class="form-label">${t.phoneLabel}</label>
            <input class="form-input" type="tel" name="phone" required />
          </div>

          <div class="form-row">
            <label class="form-label">${t.commentLabel}</label>
            <textarea class="form-textarea" name="comment"></textarea>
          </div>

          <div class="form-submit">
            <button type="submit" class="btn-primary">${t.submit}</button>
          </div>
        </form>

        <aside class="contact-panel">
          <div class="feature-label" style="margin-bottom:6px;">${t.panelTitle}</div>
          <div class="contact-line">${t.partnerLine}</div>
          <div class="contact-line">${t.phoneLine}</div>
          <div class="contact-line">${t.addressLine}</div>
          <div class="contact-line" style="margin-top:8px;">${t.noteLine}</div>
          <div class="contact-social">
            <a href="https://t.me/kunzeauto" target="_blank" class="contact-social-link">
              <img src="src/images/telegram.svg" alt="Telegram" />
            </a>
            <a href="https://wa.me/380756853150" target="_blank" class="contact-social-link">
              <img src="src/images/whatsapp.svg" alt="WhatsApp" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderFooter(lang) {
  const t = window.langData[lang].footer;

  return `
    <footer class="footer">
      <div>${t.left}</div>
      <div>${t.right}</div>
    </footer>
  `;
}

/* INTERACTION */

function initLanguage() {
  const btn = document.getElementById("langToggle");
  if (!btn) return;

  let lang = localStorage.getItem("lang") || "ua";

  function updateLabel() {
    const label = document.getElementById("langLabel");
    if (label) label.textContent = lang === "ua" ? "UA" : "EN";
  }

  function updateFlag() {
  const flag = document.querySelector(".lang-flag");
  if (!flag) return;

  flag.classList.remove("ua", "en");
  flag.classList.add(lang === "ua" ? "ua" : "en");
}


  function toggleLang() {
    lang = lang === "ua" ? "en" : "ua";
    localStorage.setItem("lang", lang);
    rerenderApp();
  }

  btn.addEventListener("click", toggleLang);
  updateLabel();
  updateFlag();

  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (ev) => {
      const target = el.getAttribute("data-scroll");
      if (!target) return;
      ev.preventDefault();
      const node = document.querySelector(target);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initTheme() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  let theme = localStorage.getItem("theme") || "dark";

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", theme);
    rerenderApp();
  }

  btn.addEventListener("click", toggleTheme);
}

function initForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const lang = localStorage.getItem("lang") || "ua";
  const t = window.langData[lang].contact;

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const btn = form.querySelector("button[type=submit]");
    btn.textContent = t.submitted;
    btn.disabled = true;

    const formData = new FormData(form);

    try {
      const res = await fetch("send.php", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          btn.textContent = t.reset;
          btn.disabled = false;
          form.reset();
        }, 2500);
      } else {
        btn.textContent = "Помилка";
        btn.disabled = false;
      }
    } catch (e) {
      btn.textContent = "Помилка";
      btn.disabled = false;
    }
  });
}


function initOffcanvas() {
  const burger = document.getElementById("navBurger");
  const offcanvas = document.getElementById("offcanvas");
  const closeBtn = document.getElementById("offcanvasClose");
  const backdrop = document.getElementById("offcanvasBackdrop");

  if (!burger || !offcanvas) return;

  burger.addEventListener("click", () => {
    offcanvas.classList.add("is-open");
  });

  closeBtn?.addEventListener("click", () => {
    offcanvas.classList.remove("is-open");
  });

  backdrop?.addEventListener("click", () => {
    offcanvas.classList.remove("is-open");
  });

  document.querySelectorAll(".offcanvas-links a").forEach((link) => {
    link.addEventListener("click", () => {
      offcanvas.classList.remove("is-open");
    });
  });
}

function initGalleryLightbox() {
  const lang = localStorage.getItem("lang") || "ua";
  const t = window.langData[lang].gallery;
  const items = t.items;

  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImage");
  const captionEl = document.getElementById("lightboxCaption");
  const closeEls = document.querySelectorAll("[data-lightbox-close]");
  const prevBtn = document.querySelector("[data-lightbox-prev]");
  const nextBtn = document.querySelector("[data-lightbox-next]");

  if (!lightbox || !imgEl || !captionEl) return;

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = items[currentIndex];
    imgEl.src = item.img;
    imgEl.alt = item.label;
    captionEl.textContent = item.text
      ? item.label + " — " + item.text
      : item.label;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  document.querySelectorAll(".gallery-item").forEach((el) => {
    el.addEventListener("click", () => {
      const index = Number(el.getAttribute("data-gallery-index")) || 0;
      openLightbox(index);
    });
  });

  closeEls.forEach((el) => el.addEventListener("click", closeLightbox));

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showPrev();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/* PRELOADER HIDE */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 300); // небольшая задержка для плавности
});
