// gh-Kunze/js/renderModelPage.js

(function () {
  function createTrimsHTML(trims) {
    if (!trims || !trims.length) return '';
    return `
      <section class="trims section">
        <div class="section-inner">
          <h2>Комплектації та ціни</h2>
          <div class="trims-grid">
            ${trims
              .map(
                (trim) => `
              <article class="trim-card">
                <h3>${trim.name}</h3>
                <ul class="trim-specs">
                  ${trim.specs
                    .map((s) => `<li>${s}</li>`)
                    .join('')}
                </ul>
                <button class="btn primary">${trim.price}</button>
              </article>
            `,
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }

  function createGalleryHTML(gallery) {
    if (!gallery || !gallery.length) return '';
    return `
      <section class="gallery section">
        <div class="section-inner">
          <div class="carousel">
            <div class="carousel-track">
              ${gallery
                .map(
                  (src) => `
                <div class="carousel-slide">
                  <img src="${src}" alt="">
                </div>
              `,
                )
                .join('')}
            </div>
            <button class="carousel-btn prev">&#10094;</button>
            <button class="carousel-btn next">&#10095;</button>
            <div class="carousel-dots">
              ${gallery
                .map(
                  (_, i) =>
                    `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`,
                )
                .join('')}
            </div>
            <div class="carousel-counter">
              <span class="current">1</span> / <span class="total">${gallery.length}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function createVideoHTML(video) {
    if (!video) return '';
    return `
      <section class="warranty-with-video section">
        <div class="warranty-video-grid">
          <div class="warranty-block">
            <h2>Відеоогляд моделі</h2>
            <ul class="warranty-list">
              <li>Реальний вигляд авто з салону</li>
              <li>Демонстрація інтерʼєру та багажника</li>
              <li>Пояснення ключових переваг моделі</li>
            </ul>
          </div>
          <div class="video-block">
            <div class="video-wrapper">
              <video controls poster="${video.poster}">
                <source src="${video.src}" type="video/mp4">
                Ваш браузер не підтримує відео.
              </video>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function createShowroomsHTML(showrooms) {
    if (!showrooms || !showrooms.length) return '';
    return `
      <section class="advantages section">
        <div class="section-inner">
          <h2>Наші салони</h2>
          <ul class="advantages-list">
            ${showrooms
              .map(
                (addr) => `
              <li>
                ${addr}
              </li>
            `,
              )
              .join('')}
          </ul>
        </div>
      </section>
    `;
  }

  function renderModelPage(car) {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <section class="section hero">
        <div class="section-inner hero-inner">
          <div class="hero-content">
            <div class="hero-ua-badge">
              <span>Kunze Auto</span>
              <span>Офіційний партнер в Україні</span>
            </div>
            <h1>${car.name}</h1>
            <p class="hero-tagline">${car.shortTagline || ''}</p>
            <p class="car-price">${car.listPriceUA || car.mainPrice}</p>
            <div class="hero-buttons">
              <a href="#contact" class="btn primary">Записатися на перегляд</a>
              <a href="/" class="btn secondary">Повернутися на головну</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="${car.heroImage}" alt="${car.name}">
          </div>
        </div>
      </section>

      ${createTrimsHTML(car.trims)}
      ${createGalleryHTML(car.gallery)}
      ${createVideoHTML(car.video)}
      ${createShowroomsHTML(car.showrooms)}
    `;

    initCarousel(app);
  }

  function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const prevBtn = root.querySelector('.carousel-btn.prev');
    const nextBtn = root.querySelector('.carousel-btn.next');
    const dots = Array.from(root.querySelectorAll('.dot'));
    const currentEl = root.querySelector('.carousel-counter .current');

    let index = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      if (currentEl) currentEl.textContent = String(index + 1);
    }

    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      update();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        index = Number(dot.dataset.index || 0);
        update();
      });
    });

    update();
  }

  window.renderModelPage = renderModelPage;
})();
