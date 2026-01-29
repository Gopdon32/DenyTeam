// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const car = cars[0];

  // Рендер приложения (вся разметка генерируется функциями ниже)
  app.innerHTML = `
    ${renderNav(car)}
    ${renderHero(car)}
    ${renderNewCarsBlock(car)}
    ${renderStatus(car)}
    ${renderWarranty(car)}
    ${renderTrims(car)}
    ${renderGallery(car)}
    ${renderAdvantages(car)}
    ${renderForm(car)}
    ${renderContacts(car)}
  `;

  initAnimations();
  initCarousel();

  // Защита формы — предотвращаем реальную отправку (пример)
  const form = app.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      // минимальная обратная связь — можно заменить на AJAX вызов
      const btn = form.querySelector("button[type=submit]");
      btn.textContent = "Дякуємо — заявка прийнята";
      btn.disabled = true;
      setTimeout(() => { btn.textContent = "Надіслати заявку"; btn.disabled = false; }, 2500);
    });
  }
});

window.addEventListener("load", () => {
  // скрываем прелоадер и показываем приложение
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("app");
  if (preloader) preloader.style.display = "none";
  if (app) app.style.opacity = "1";
});

function renderNav() {
  return `
    <div class="nav">
      <div class="nav-inner">

        <div class="logo">
          <a href="#">
            <img src="src/images/logo.png" alt="Logo Kunze">
            <p>Kunze Auto</p>
          </a>
        </div>

        <div class="nav-right">
          <a href="tel:+380756853150" class="nav-phone">+380 75 685 3150</a>

          <a href="https://t.me/kunze_auto" class="nav-icon" target="_blank">
            <img src="src/images/telegram.svg" alt="Telegram">
          </a>

          <a href="https://wa.me/380756853150" class="nav-icon" target="_blank">
            <img src="src/images/whatsapp.svg" alt="WhatsApp">
          </a>
        </div>

      </div>
    </div>
  `;
}

function renderHero(car) {
  return `
    <section class="hero section fade-in">
      <div class="section-inner hero-inner">
        <div class="hero-content">
          <div class="hero-ua-badge">
            <span class="hero-ua-flag">${car.ua.symbol}</span>
            <span class="hero-ua-text">${car.ua.note}</span>
          </div>
          <h1>${car.brand} ${car.model} ${car.year}</h1>
          <p class="hero-tagline">${car.heroTagline}</p>
          <p class="hero-desc">${car.descriptionShort}</p>
          <div class="hero-trims">
            <span>Доступні комплектації:</span>
            <ul>
              ${car.trims
                .map(
                  (t) => `
                <li>
                  <strong>${t.name}</strong> — ${t.rangeKm} км, ${t.batteryKwh} кВт·год
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          <div class="hero-buttons">
            <a href="#trims" class="btn primary">Переглянути характеристики</a>
            <a href="#contact-form" class="btn secondary">Отримати консультацію</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="${car.heroImage}" alt="${car.brand} ${car.model}" />
        </div>
      </div>
    </section>
    <hr class="ukraine">
  `;
}

function renderNewCarsBlock() {
  const first = cars[0];

  return `
    <section class="cars-section section">
      <div class="cars-noise"></div>

      <div class="cars-container">

        <h2 class="cars-title">Нові автомобілі</h2>

        <div class="cars-switcher">
          ${cars
            .map(
              (c, i) => `
            <button class="car-pill ${i === 0 ? "active" : ""}" onclick="selectNewCar('${c.id}')">
              ${c.model}
            </button>
          `
            )
            .join("")}
        </div>

        <div class="cars-display">

          <div class="cars-image">
            <img id="carMainImage" class="fade-swap" src="${first.heroImage}" alt="${first.model}">
          </div>

          <div class="cars-info">
            <h3 id="carName">${first.model}</h3>
            <p class="car-price">від <span id="carPrice">${first.trims[0].price}</span> $</p>

            <ul class="car-specs" id="carSpecs">
              <li>Запас ходу: ${first.trims[0].rangeKm} км</li>
              <li>Батарея: ${first.trims[0].batteryKwh} кВт·год</li>
              <li>Потужність: ${first.trims[0].powerHp} к.с.</li>
              <li>Привід: ${first.trims[0].drive}</li>
            </ul>

            <button class="car-btn" onclick="openGalleryPopup()">Переглянути</button>
          </div>

        </div>

      </div>
    </section>
  `;
}

function renderStatus(car) {
  return `
    <section class="section status fade-in">
      <div class="section-inner">
        <h2>Стан автомобіля</h2>
        <p class="status-label">Стан — <strong>абсолютно новий, заводська комплектація</strong></p>
        <ul class="status-list">
          ${car.status.notes.map((n) => `<li>${n}</li>`).join("")}
        </ul>
        <div class="status-meta">
          <div><strong>${car.status.pointsCheck}</strong><span>точок контролю якості</span></div>
          <div><strong>${car.status.stagesCheck}</strong><span>етапи заводської перевірки</span></div>
          <div><strong>${car.status.mileage} км</strong><span>пробіг</span></div>
        </div>
      </div>
    </section>
    <hr class="ukraine">
  `;
}

function renderWarranty(car) {
  return `
    <section class="warranty section fade-in">
      <div class="section-inner">

        <h2 class="warranty-title">Гарантія, що дарує впевненість</h2>

        <p class="warranty-text">
          GAC Toyota забезпечує повний захист високовольтної батареї та ключових систем авто.<br>
          У разі будь-якого заводського дефекту ви отримуєте
          <strong>повну заміну автомобіля</strong>, а не ремонт чи часткову компенсацію.
        </p>

        <p class="warranty-sub">
          Ми відповідаємо за кожен кілометр вашої безпеки.
        </p>

      </div>
    </section>
  `;
}

function renderTrims(car) {
  return `
    <section class="section trims fade-in" id="trims">
      <div class="section-inner">
        <h2>Технічні характеристики та комплектації</h2>
        <div class="trims-grid">
          ${car.trims.map(renderTrimCard).join("")}
        </div>
      </div>
    </section>
    <hr class="ukraine">
  `;
}

function renderTrimCard(trim) {
  return `
    <article class="trim-card">
      <h3>${trim.name}</h3>
      <ul class="trim-specs">
        <li><strong>Тип:</strong> ${trim.type}</li>
        <li><strong>Запас ходу:</strong> ${trim.rangeKm} км</li>
        <li><strong>Батарея:</strong> ${trim.batteryKwh} кВт·год</li>
        <li><strong>Потужність:</strong> ${trim.powerHp} к.с.</li>
        <li><strong>Привід:</strong> ${trim.drive}</li>
        <li><strong>Кольори:</strong> ${trim.colors.join(", ")}</li>
        <li><strong>Ціна:</strong> від ${trim.price.toLocaleString("uk-UA")} $</li>
      </ul>
      <a href="#contact-form" class="btn primary">Обрати цю комплектацію</a>
    </article>
  `;
}

function renderGallery(car) {
  return `
    <section class="section gallery fade-in">
      <div class="section-inner">
        <h2>Фотоогляд</h2>

        <div class="carousel" id="gallery-carousel">
          <div class="carousel-track">
            ${car.gallery
              .map(
                (img) => `
              <div class="carousel-slide">
                <img src="${img.src}" alt="${img.alt}" />
              </div>
            `,
              )
              .join("")}
          </div>

          <button class="carousel-btn prev">‹</button>
          <button class="carousel-btn next">›</button>

          <div class="carousel-dots">
            ${car.gallery
              .map((_, i) => `<span class="dot" data-index="${i}"></span>`)
              .join("")}
          </div>

          <div class="carousel-counter">
            <span id="carousel-current">1</span> / ${car.gallery.length}
          </div>
        </div>

      </div>
    </section>
    <hr class="ukraine">
  `;
}

function renderAdvantages(car) {
  return `
    <section class="section advantages fade-in">
      <div class="section-inner">
        <h2>Чому ${car.brand} ${car.model} — правильний вибір</h2>
        <ul class="advantages-list">
          ${car.advantages.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </div>
    </section>
    <hr class="ukraine">
  `;
}

function renderForm(car) {
  return `
    <section class="section contact fade-in" id="contact-form">
      <div class="section-inner">
        <h2>Отримати консультацію</h2>
        <form class="contact-form">
          <div class="form-row">
            <label>Ім’я</label>
            <input type="text" name="name" placeholder="Ваше ім’я" required />
          </div>
          <div class="form-row">
            <label>Телефон</label>
            <input type="tel" name="phone" placeholder="+38 ..." required />
          </div>
          <div class="form-row">
            <label>Комплектація</label>
            <select name="trim">
              ${car.trims.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-row">
            <label>Коментар</label>
            <textarea name="comment" rows="3" placeholder="Питання, побажання..."></textarea>
          </div>
          <button type="submit" class="btn primary">Надіслати заявку</button>
        </form>
      </div>
    </section>
    <hr class="ukraine">

  `;
}

function renderContacts(car) {
  const c = car.contacts;

  return `
    <footer class="section footer fade-in">

      <div class="footer-carousel">
        <img src="src/images/f1.jpg" alt="Bozhi 3X" />
        <img src="src/images/f2.jpg" alt="Bozhi 3X" />
        <img src="src/images/f3.jpg" alt="Bozhi 3X" />
      </div>

      <div class="section-inner footer-inner">

        <div class="footer-info">
          <p>${c.partner}</p>

          <p>
            Телефон:
            <a href="tel:${c.phone}">${c.phone}</a>
          </p>

          <p>
            Telegram:
            <a href="https://t.me/${c.telegram.replace("@", "")}" target="_blank">
              ${c.telegram}
            </a>
          </p>

          <div class="footer-socials">
            <a href="https://t.me/${c.telegram.replace("@", "")}" class="footer-icon" target="_blank">
              <img src="src/images/telegram.svg" alt="Telegram">
            </a>

            <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, "")}" class="footer-icon" target="_blank">
              <img src="src/images/whatsapp.svg" alt="WhatsApp">
            </a>
          </div>
        </div>

      </div>
    </footer>
  `;
}

/* -------------------------
   Управление выбором машины
   ------------------------- */
let currentCarId = cars[0].id;

function selectNewCar(id) {
  currentCarId = id;
  const car = cars.find((c) => c.id === id);
  if (!car) return;

  const img = document.getElementById("carMainImage");
  const name = document.getElementById("carName");
  const price = document.getElementById("carPrice");
  const specs = document.getElementById("carSpecs");

  // анимация замены контента
  [img, name, price, specs].forEach((el) => el && el.classList.add("fade-out"));

  setTimeout(() => {
    if (img) img.src = car.heroImage;
    if (name) name.textContent = car.model;
    if (price) price.textContent = car.trims[0].price;
    if (specs)
      specs.innerHTML = `
        <li>Запас ходу: ${car.trims[0].rangeKm} км</li>
        <li>Батарея: ${car.trims[0].batteryKwh} кВт·год</li>
        <li>Потужність: ${car.trims[0].powerHp} к.с.</li>
        <li>Привід: ${car.trims[0].drive}</li>
      `;

    [img, name, price, specs].forEach((el) => el && el.classList.remove("fade-out"));
  }, 250);

  document.querySelectorAll(".car-pill").forEach((el) => el.classList.remove("active"));
  const selector = `.car-pill[onclick="selectNewCar('${id}')"]`;
  const activeEl = document.querySelector(selector);
  if (activeEl) activeEl.classList.add("active");
}

/* -------------------------
   Popup gallery
   ------------------------- */
function openGalleryPopup() {
  const car = cars.find((c) => c.id === currentCarId);
  if (!car || !car.gallery) return;

  const popup = document.getElementById("galleryPopup");
  const content = document.getElementById("popupGalleryContent");
  content.innerHTML = car.gallery.map(item => `<div class="popup-image-item"><img src="${item.src}" alt="${item.alt}"></div>`).join("");
  popup.classList.add("open");
  popup.setAttribute("aria-hidden", "false");
}
function closeGalleryPopup() {
  const popup = document.getElementById("galleryPopup");
  popup.classList.remove("open");
  popup.setAttribute("aria-hidden", "true");
}

/* -------------------------
   Анимации при скролле
   ------------------------- */
function initAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  const onScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) el.classList.add("visible");
    });
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

/* -------------------------
   Карусель (gallery)
   ------------------------- */
function initCarousel() {
  const carousel = document.getElementById("gallery-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const dots = Array.from(carousel.querySelectorAll(".dot"));
  const counter = document.getElementById("carousel-current");
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    if (counter) counter.textContent = index + 1;
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      index = (index + 1) % slides.length;
      updateCarousel();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
    };
  }

  dots.forEach(dot =>
    dot.addEventListener("click", () => {
      index = Number(dot.dataset.index);
      updateCarousel();
    })
  );

  let auto = setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 3000);

  carousel.addEventListener("mouseenter", () => clearInterval(auto));
  carousel.addEventListener("mouseleave", () => {
    auto = setInterval(() => {
      index = (index + 1) % slides.length;
      updateCarousel();
    }, 4000);
  });

  updateCarousel();
}
