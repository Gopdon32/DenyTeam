// js/app.js

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const car = cars[0];

  app.innerHTML = `
    ${renderHero(car)}
    ${renderHeroWarranty(car)}
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
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  const app = document.getElementById("app");
  if (preloader) preloader.style.display = "none";
  if (app) app.style.opacity = "1";
});

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

function renderHeroWarranty(car) {
  return `
    <section class="hero-warranty section fade-in">
      <div class="section-inner hero-warranty-inner">
        <h2>${car.heroWarranty.title}</h2>
        <p class="warranty-highlight">${car.heroWarranty.guarantee}</p>
        <p class="warranty-accent">${car.heroWarranty.compensation}</p>
        <p class="warranty-ukraine">${car.heroWarranty.ukraine}</p>
      </div>
    </section>
    <hr class="ukraine">
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
    <section class="section warranty-with-video fade-in">
      <div class="section-inner warranty-video-grid">

        <div class="warranty-block">
          <h2>Гарантія та безпека</h2>
          <ul class="warranty-list">
            ${car.warranty.notes.map((n) => `<li>${n}</li>`).join("")}
          </ul>

          <div class="warranty-meta">
            <div><strong>${car.warranty.carYears} років</strong><span>гарантія на авто</span></div>
            <div><strong>${car.warranty.batteryYears} років</strong><span>гарантія на батарею</span></div>
          </div>
        </div>

        <div class="video-block">
          <div class="video-wrapper">
            <video
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              poster="${car.video.poster}"
            >
              <source src="${car.video.src}" type="video/mp4">
              Ваш браузер не підтримує відео.
            </video>
          </div>
        </div>

      </div>
    </section>
    <hr class="ukraine">
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
        <li><strong>Ціна:</strong> від ${trim.priceFrom.toLocaleString("uk-UA")} $ до ${trim.priceTo.toLocaleString("uk-UA")} $</li>
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
          <p>Телефон: <a href="tel:${c.phone}">${c.phone}</a></p>
          <p>Telegram: <a href="https://t.me/${c.telegram.replace("@", "")}" target="_blank">${c.telegram}</a></p>
        </div>
      </div>
    </footer>
  `;
}

function initAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  const onScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

function initCarousel() {
  const carousel = document.getElementById("gallery-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".prev");
  const nextBtn = carousel.querySelector(".next");
  const dots = carousel.querySelectorAll(".dot");
  const counter = document.getElementById("carousel-current");

  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
    counter.textContent = index + 1;
  }

  nextBtn.onclick = () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  };

  prevBtn.onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  };

  dots.forEach((dot) => {
    dot.onclick = () => {
      index = Number(dot.dataset.index);
      updateCarousel();
    };
  });

  setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4000);

  updateCarousel();
}

function renderNav() {
  const navRoot = document.getElementById("nav-root");

  navRoot.innerHTML = `
    <div class="nav">
      <div class="nav-inner">

        <div class="logo">
          <a href="#">
            <img src="src/images/logo.png" alt="Logo Kunze">
            <p>Kunze Auto</p>
          </a>
        </div>
        

        <div class="nav-right">
          <a href="tel:${navData.phone}" class="nav-phone">${navData.phone}</a>
          <a href="https://t.me/${navData.telegram.replace("@", "")}" class="nav-tg">Telegram</a>
        </div>

      </div>
    </div>
  `;
}

renderNav();
