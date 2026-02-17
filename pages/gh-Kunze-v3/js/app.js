// ============================================================================
// KUNZE AUTO - GAC Toyota Dealership Website
// Main Application Logic - Routing, Rendering, Interactions
// ============================================================================

// App Configuration
const APP_CONFIG = {
  PRIMARY_PHONE: '+380 73 299 9777',
  SECONDARY_PHONE: '+380 75 685 3150',
  STORES: [
    { address: 'Глибочицька 16, Київ', name: 'Офіс 1' },
    { address: 'Столичне шосе 104, Київ', name: 'Офіс 2' }
  ],
  SOCIAL: {
    telegram: 'https://t.me/kunzeauto',
    whatsapp: 'https://wa.me/380732999777',
    tiktok: 'https://tiktok.com/@kunzeauto'
  }
};


let currentGalleryIndex = 0;
let currentGallery = [];
let currentCar = null;

// Language initialization (safe)
let currentLang = localStorage.getItem('lang');

// Normalize value (e.g., "UA", "Ua", " ua ")
if (typeof currentLang === 'string') {
  currentLang = currentLang.trim().toLowerCase();
}

// Fallback if invalid or missing
if (!currentLang || !LANG[currentLang]) {
  currentLang = 'ua';
  localStorage.setItem('lang', 'ua');
}



function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  handleRoute();

  setTimeout(() => {
    document.querySelectorAll('.lang-flag').forEach(flag => {
      flag.classList.remove('active');
    });
    document
      .querySelector(`.lang-flag[onclick="setLanguage('${lang}')"]`)
      ?.classList.add('active');
  }, 50);
}



// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  hidePreloader();
  handleRoute();
  initMobileMenu();
  setupEventListeners();
});

window.addEventListener('hashchange', handleRoute);

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
  }
}

// ============================================================================
// ROUTER - Handle URL Navigation
// ============================================================================

function handleRoute() {
  const hash = window.location.hash || '';
  const modelMatch = hash.match(/#\/model\/([a-z0-9\-]+)/);
  
  if (modelMatch && modelMatch[1]) {
    const slug = modelMatch[1];
    const car = cars.find(c => c.slug === slug);
    if (car) {
      renderModelPage(car);
      return;
    }
  }
  
  renderHomePage();
}

// ============================================================================
// HOME PAGE - CATALOG
// ============================================================================

function renderHomePage() {
  const t = LANG[currentLang];
  const app = document.getElementById('app');
  
  app.innerHTML = `
    ${renderNavbar()}
    <div class="page">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>${t.heroTitle}</h1>
            <p>${t.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section class="guarantee-section">
        <div class="container">
          <div class="guarantee-card">
            <div class="guarantee-icon">⚡</div>
            <div class="guarantee-content">
              <h3>${t.guaranteeTitle}</h3>
              <p>${t.guaranteeText}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="catalog-container" id="catalog-container">
        <div class="container">
          <div class="catalog-title">
            <h2>${t.catalogTitle}</h2>
            <p>${t.catalogSubtitle}</p>
          </div>

          <div class="catalog-grid">
            ${cars.map(car => renderCatalogCard(car)).join('')}
          </div>
        </div>
      </section>
    </div>

    ${renderFooter()}
  `;
  
  initMobileMenu();
}


function renderCatalogCard(car) {
  const t = LANG[currentLang];

  return `
    <div class="catalog-card">
      <a href="#/model/${car.slug}" class="card-image-wrapper" aria-label="${car.brand} ${car.model}">
        <img src="${car.heroImage}" alt="${getAlt(car, car.heroImage)}" class="card-image" loading="lazy" decoding="async" width="400" height="300" />
        <span class="card-badge">NEW</span>
        <div class="card-flag">
          <img src="src/images/logo.png" alt="Україна" title="Україна" />
        </div>
      </a>

      <div class="card-content">
        <div class="card-header">
          <div class="card-title">
            <div class="card-brand">${car.brand}</div>
            <div class="card-model">${car.model}</div>
            <div class="card-year">${car.year}</div>
          </div>
        </div>
        
        <div class="card-price">${t.priceFrom} ${formatPrice(car.trims[0].price)} $</div>

        <p class="card-description">
          ${t.descriptionMap[car.descriptionShort] || car.descriptionShort}
        </p>

        <div class="card-footer">
          <a href="#/model/${car.slug}" class="btn btn-primary btn-small">
            ${t.details}
          </a>

          <button 
            class="btn btn-secondary btn-small" 
            onclick="contactUs('${car.model}')"
            type="button"
          >
            ${t.order}
          </button>
        </div>
      </div>
    </div>
  `;
}



// ============================================================================
// MODEL DETAIL PAGE
// ============================================================================

function renderModelPage(car) {
  const app = document.getElementById('app');

  app.innerHTML = `
    ${renderNavbar()}
    <div class="page model-page">
      ${renderModelHero(car)}
      ${renderTrimsSection(car)}
      ${renderPdfSection(car)}
      ${renderVideoReviewSection(car)}
      ${renderGallerySection(car)}
      ${renderContactsSection()}
    </div>
    ${renderFooter()}
  `;

  window.scrollTo(0, 0);

  currentGalleryIndex = 0;
  currentCar = car;
  currentGallery = car.gallery || [];


  initMobileMenu();
  setupGalleryInteraction();
}



function renderModelHero(car) {
  const t = LANG[currentLang];
  const firstTrim = car.trims[0];

  return `
    <section class="model-hero">
      <div class="container">
        <div class="model-hero-content">
          <div class="model-hero-image">
            <img src="${car.heroImage}" alt="${getAlt(car, car.heroImage)}" class="model-hero-img" loading="eager" decoding="async" width="1600" height="900" />

          </div>

          <div class="model-hero-info">
            <h1>${car.brand} ${car.model} ${car.year}</h1>
            <div class="card-price">${t.priceFrom} ${formatPrice(car.trims[0].price)} $</div>
            <p class="model-hero-desc">${t.descriptionMap[car.descriptionShort] || car.descriptionShort}</p>

            <div class="model-hero-features">
              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.powerHp}</strong> ${t.power}</span>
              </div>

              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.batteryKwh}</strong> ${t.battery}</span>
              </div>

              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.rangeKm}</strong> ${t.range}</span>
              </div>

              <div class="feature-item">
                <div class="feature-icon"></div>
                <span>${t.drive} <strong>${t.driveMap[firstTrim.drive] || firstTrim.drive}</strong></span>
              </div>
            </div>

            <div class="model-hero-cta">
              <button class="btn btn-primary" onclick="contactUs('${car.model}')">
                ${t.testDrive}
              </button>

              <button class="btn btn-outline" onclick="scrollToContacts()">
                ${t.contactUs}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function scrollToContacts() {
  const el = document.getElementById('contacts');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}



function renderTrimsSection(car) {
  const t = LANG[currentLang];

  return `
    <section class="trims-section">
      <div class="container">
        <div class="trims-title">
          <h2>${t.trimsTitle}</h2>
          <p>${t.trimsSubtitle}</p>
        </div>

        <div class="trims-list">
          ${car.trims.map((trim, idx) => `
            <div class="trim-card">
              <div class="trim-name">${trim.name}</div>
              <div class="trim-price">${formatPrice(trim.price)} $</div>
              
              <div class="trim-specs">
                <div class="trim-spec">
                  <span class="trim-spec-label">${t.power}</span>
                  <span class="trim-spec-value">${trim.powerHp} ${t.power}</span>
                </div>

                <div class="trim-spec">
                  <span class="trim-spec-label">${t.battery}</span>
                  <span class="trim-spec-value">${trim.batteryKwh} ${t.battery}</span>
                </div>

                <div class="trim-spec">
                  <span class="trim-spec-label">${t.range}</span>
                  <span class="trim-spec-value">${trim.rangeKm} ${t.range}</span>
                </div>

                <div class="trim-spec">
                  <span class="trim-spec-label">${t.drive}</span>
                  <span class="trim-spec-value">${t.driveMap[trim.drive] || trim.drive}</span>
                </div>

                <div class="trim-spec">
                  <span class="trim-spec-label">${t.colors}</span>
                  <span class="trim-spec-value">${trim.colors.map(c => t.colorsMap[c] || c).join(', ')}</span>
                </div>
              </div>

              <button class="btn btn-secondary" style="width:100%; margin-top: 15px;" 
                onclick="contactUs('${car.model} ${trim.name}')">
                ${t.order}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderVideoReviewSection(car) {
  const t = LANG[currentLang];

  if (!car.video) return "";

  const poster = getPoster(car);

  return `
    <section class="video-review">
      <div class="container">
        <div class="video-review-title">
          <h2>${t.videoTitle}</h2>
          <p>${t.videoSubtitle} ${car.brand} ${car.model}</p>
        </div>

        <div class="video-wrapper">
          <video controls preload="none" loading="lazy" poster="${poster}" width="1600" height="900" >
            <source src="${car.video}" type="video/mp4">
            ${t.videoNotSupported}
          </video>
        </div>
      </div>
    </section>
  `;
}




function getPoster(car) {
  return car.gallery?.[0] || car.heroImage || "";
}


function renderPdfSection(car) {
  const t = LANG[currentLang];
  const pdfs = getPdfLinks(car.slug);

  if (!pdfs || pdfs.length === 0) {
    return '';
  }

  return `
    <section class="pdf-section">
      <div class="container">
        <div class="pdf-title">
          <h2>${t.pdfTitle}</h2>
          <p>${t.pdfSubtitle}</p>
        </div>

        <div class="pdf-list">
          ${pdfs.map(pdf => {
            const fileName = pdf.split('/').pop();
            return `
              <a href="${pdf}" target="_blank" class="pdf-link">
                <span class="pdf-icon">📄</span>
                <span class="pdf-name">${fileName.replace(/.pdf$/, '').replace(/-/g, ' ').trim()}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}


function renderGallerySection(car) {
  const t = LANG[currentLang];

  if (!car.gallery || car.gallery.length === 0) return '';

  return `
    <section class="gallery-section">
      <div class="container">
        <div class="gallery-title">
          <h2>${t.galleryTitle}</h2>
          <p>${t.gallerySubtitle} ${car.brand} ${car.model}</p>
        </div>

        <div class="gallery-grid">
          ${car.gallery.map((img, idx) => `
            <div class="gallery-item" onclick="openGallery(${idx})">
              <img 
                src="${img}" 
                alt="${getAlt(car, img)}"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width="400"
                height="300"
              />
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}




function renderContactsSection() {
  const t = LANG[currentLang];

  return `
    <section class="contacts-section" id="contacts">
      <div class="container">
        <div class="contacts-title">
          <h2>${t.contactsTitle}</h2>
          <p>${t.contactsSubtitle}</p>
        </div>

        <div class="contacts-grid">
          ${APP_CONFIG.STORES.map((store, index) => `
            <div class="contact-card" ${index === 0 ? 'id="footer-contact"' : ''}>
              <strong>${t.office} ${index + 1}</strong><br>
              <span aria-hidden="true">📍</span> ${store.address}<br>
              <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="contact-phone">
                ${APP_CONFIG.PRIMARY_PHONE}
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}




// ============================================================================
// NAVBAR & FOOTER
// ============================================================================

function renderNavbar() {
  const t = LANG[currentLang];

  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">

          <div class="navbar-brand" onclick="navigateTo('')">
            <span class="navbar-brand-text">KUNZE</span>
            <span style="opacity: 0.6;"></span>
          </div>

          <div class="navbar-menu" id="navMenu">
            <a href="#" onclick="handleMenuClick(event, 'catalog')">
              ${t.navCatalog}
            </a>
            <a href="#" onclick="handleMenuClick(event, 'contacts')">
              ${t.navContacts}
            </a>
            <a href="#" onclick="handleMenuClick(event, 'order')">
              ${t.navOrder}
            </a>
          </div>

          <div class="navbar-contacts">
            <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="navbar-contact-phone">
              ☎️ ${APP_CONFIG.PRIMARY_PHONE}
            </a>

            <div class="navbar-socials">
              <a href="${APP_CONFIG.SOCIAL.telegram}" target="_blank" class="navbar-social-icon" title="Telegram">
                ${getSocialIcon('telegram')}
              </a>
              <a href="${APP_CONFIG.SOCIAL.whatsapp}" target="_blank" class="navbar-social-icon" title="WhatsApp">
                ${getSocialIcon('whatsapp')}
              </a>
              <a href="${APP_CONFIG.SOCIAL.tiktok}" target="_blank" class="navbar-social-icon" title="TikTok">
                ${getSocialIcon('tiktok')}
              </a>
            </div>
          </div>

          <!-- 🔥 Переключатель языка -->
          <div class="navbar-lang">
            <img src="src/icons/social/Ukraine.svg" class="lang-flag" onclick="setLanguage('ua')" />
            <img src="src/icons/social/usa.svg" class="lang-flag" onclick="setLanguage('en')" />
          </div>

          <button class="navbar-toggle" id="mobileToggle" aria-label="Меню" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>
      </div>
    </nav>
  `;
}


function getSocialIcon(platform) {
  const icons = {
    telegram: `<img src="src/icons/social/telegram.png" alt="Telegram" class="social-icon-img" />`,
    whatsapp: `<img src="src/icons/social/whatsapp.png" alt="WhatsApp" class="social-icon-img" />`,
    tiktok: `<img src="src/icons/social/tiktok.svg" alt="TikTok" class="social-icon-img" />`
  };
  return icons[platform] || '';
}

function renderFooter() {
  const t = LANG[currentLang];

  return `
    <footer aria-label="Футер сайту">
      <div class="container">
        <div class="footer-content">

          <div class="footer-section">
            <h4>${t.footerWorkHours}</h4>
            <ul>
              <li><strong>${t.footerWeekdays}:</strong> 10:00 - 19:00</li>
              <li><strong>${t.footerLunch}:</strong> 13:00 - 14:00</li>
              <li><strong>${t.footerWeekend}:</strong> 10:00 - 16:00</li>
              <li><a href="#">${t.footerBuyOnline}</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>${t.footerContacts}</h4>

            ${APP_CONFIG.STORES.map((store, index) => `
              <div class="footer-contact" ${index === 0 ? 'id="footer-contact"' : ''}>
                <strong>${t.office} ${index + 1}</strong><br>
                <span aria-hidden="true">📍</span> ${store.address}<br>
                <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="contact-phone">
                  ${APP_CONFIG.PRIMARY_PHONE}
                </a>
              </div>
            `).join('')}

            <div class="footer-socials">
              <a href="${APP_CONFIG.SOCIAL.telegram}" target="_blank" class="footer-social" title="Telegram">
                ${getSocialIcon('telegram')}
              </a>
              <a href="${APP_CONFIG.SOCIAL.whatsapp}" target="_blank" class="footer-social" title="WhatsApp">
                ${getSocialIcon('whatsapp')}
              </a>
              <a href="${APP_CONFIG.SOCIAL.tiktok}" target="_blank" class="footer-social" title="TikTok">
                ${getSocialIcon('tiktok')}
              </a>
            </div>
          </div>

        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2024 Kunze Auto - GAC Toyota. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}



// ============================================================================
// GALLERY POPUP
// ============================================================================

function openGallery(index) {
  currentGalleryIndex = index;

  if (!currentGallery || currentGallery.length === 0) return;

  const popup = document.getElementById('galleryPopup');
  const img = document.getElementById('galleryImage');
  const current = document.getElementById('current');
  const total = document.getElementById('total');

  const file = currentGallery[currentGalleryIndex];

  img.loading = "eager";
  img.decoding = "async";
  img.src = file;
  img.alt = getAlt(currentCar, file);

  current.textContent = currentGalleryIndex + 1;
  total.textContent = currentGallery.length;

  popup.classList.add('open');
  popup.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
}


function closeGallery() {
  const popup = document.getElementById('galleryPopup');
  popup.classList.remove('open');
  popup.setAttribute('inert', '');
  document.body.style.overflow = 'auto';
}

function nextGallery() {
  if (currentGalleryIndex < currentGallery.length - 1) {
    currentGalleryIndex++;
    openGallery(currentGalleryIndex);
  }
}

function prevGallery() {
  if (currentGalleryIndex > 0) {
    currentGalleryIndex--;
    openGallery(currentGalleryIndex);
  }
}

function setupGalleryInteraction() {
  console.log("SETUP CALLED");

  const popup = document.getElementById('galleryPopup');
  const closeBtn = document.querySelector('.gallery-popup-close');
  const nextBtn = document.querySelector('.gallery-next');
  const prevBtn = document.querySelector('.gallery-prev');

  closeBtn?.addEventListener('click', closeGallery);
  nextBtn?.addEventListener('click', nextGallery);
  prevBtn?.addEventListener('click', prevGallery);

  popup?.addEventListener('click', (e) => {
    if (e.target === popup) closeGallery();
  });

  document.addEventListener('keydown', (e) => {
    if (!popup.classList.contains('open')) return;

    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') nextGallery();
    if (e.key === 'ArrowLeft') prevGallery();
  });

  // Swipe
  let startX = 0;
  let isDragging = false;
  let isTouchMode = false;

  const MIN_SWIPE = 50;

  popup.addEventListener('touchstart', (e) => {
    isTouchMode = true;
    startX = e.changedTouches[0].clientX;
  });

  popup.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > MIN_SWIPE) diff < 0 ? nextGallery() : prevGallery();
  });

  popup.addEventListener('mousedown', (e) => {
    if (isTouchMode) return;
    isDragging = true;
    startX = e.clientX;
  });

  popup.addEventListener('mouseup', (e) => {
    if (!isDragging || isTouchMode) return;
    isDragging = false;

    const diff = e.clientX - startX;
    if (Math.abs(diff) > MIN_SWIPE) diff < 0 ? nextGallery() : prevGallery();
  });

  popup.addEventListener('mouseleave', () => {
    isDragging = false;
  });
}


// ============================================================================
// MOBILE MENU (final optimized version)
// ============================================================================

let closeMenuHandler = null;

function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');

  if (!toggle || !menu) return;

  // Remove old listeners
  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);

  const toggleBtn = document.getElementById('mobileToggle');

  // Toggle menu
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBtn.classList.toggle('active');
    menu.classList.toggle('active');

    const isOpen = toggleBtn.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);

    // 🔥 Блокуємо скрол сторінки
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      menu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    });
  });

  // Close menu when clicking outside
  if (closeMenuHandler) {
    document.removeEventListener('click', closeMenuHandler);
  }

  closeMenuHandler = (e) => {
    if (!e.target.closest('.navbar')) {
      toggleBtn.classList.remove('active');
      menu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = 'auto';
    }
  };

  document.addEventListener('click', closeMenuHandler);
}

// ============================================================================
// EVENT LISTENERS & INTERACTIONS
// ============================================================================
function setupEventListeners() {
  
}


function navigateTo(hash) {
  window.location.hash = hash;
}

function handleMenuClick(e, action) {
  e.preventDefault();
  e.stopPropagation();

  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');

  // Закриваємо меню
  if (toggle && menu) {
    toggle.classList.remove('active');
    menu.classList.remove('active');
  }

  // Функція, яка викликається після рендера головної
  function scrollAfterLoad(targetId) {
    const isHome = window.location.hash === '' || window.location.hash === '#';

    // Якщо ми НЕ на головній (тобто на сторінці моделі)
    if (!isHome) {
      sessionStorage.setItem('scrollTarget', targetId);
      window.location.hash = ''; // повертаємось на головну
      return;
    }

    // Якщо вже на головній — чекаємо рендер і скролимо
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  // Обробка пунктів меню
  if (action === 'catalog') {
    scrollAfterLoad('catalog-container');

  } else if (action === 'contacts') {
    scrollAfterLoad('footer-contact'); // ← працює стабільно

  } else if (action === 'order') {
    contactUs();
  }
}


// Після зміни hash (коли повернулись з моделі на головну)
window.addEventListener('hashchange', () => {
  const target = sessionStorage.getItem('scrollTarget');

  if (target && (window.location.hash === '' || window.location.hash === '#')) {
    setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    sessionStorage.removeItem('scrollTarget');
  }
});


function contactUs(model = '') {
  const t = LANG[currentLang];
  const phone = APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '');

  const message = model
    ? `${t.contactModel} ${model}`
    : t.contactGeneral;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatPrice(price) {
  if (!price) return 'N/A';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getAlt(car, img) {
  const uaAlt = altMap[car.slug]?.[img];

  // Якщо є український alt → повертаємо його
  if (uaAlt) {
    // Якщо мова англійська → автоматичний переклад
    if (currentLang === 'en') {
      return translateAltToEnglish(uaAlt, car);
    }
    return uaAlt;
  }

  // Якщо alt немає → fallback
  return currentLang === 'en'
    ? `${car.brand} ${car.model} — photo`
    : `${car.brand} ${car.model} — фото`;
}

function translateAltToEnglish(uaAlt, car) {
  // Автоматичний переклад ключових слів
  return uaAlt
    .replace('передній вигляд', 'front view')
    .replace('вигляд збоку', 'side view')
    .replace('передній лівий ракурс', 'front-left angle')
    .replace('передній правий ракурс', 'front-right angle')
    .replace('задній вигляд', 'rear view')
    .replace('задній лівий ракурс', 'rear-left angle')
    .replace('задній правий ракурс', 'rear-right angle')
    .replace('панорамний дах', 'sunroof')
    .replace('багажник', 'trunk')
    .replace('рух', 'driving')
    .replace('ключ', 'key')
    .replace('моторний відсік', 'engine bay')
    .replace('салон', 'interior')
    .replace('панель приладів', 'dashboard')
    .replace('водійське сидіння', 'driver seat')
    .replace('пасажирське сидіння', 'passenger seat')
    .replace('зарядний порт', 'charging port')
    .replace('фара', 'headlight')
    .replace('двері водія', 'driver door')
    .replace('версія з люком', 'sunroof version')
    .replace('версія без люка', 'no-sunroof version')
    .replace('основний ракурс', 'main angle')
    .replace('білий', 'white')
    .replace('чорний', 'black')
    .replace('помаранчевий', 'orange')
    .replace('помаранчева', 'orange')
    .replace('помаранчеві', 'orange')
    .replace('ряд', 'row')
    .replace('сидіння', 'seats')
    .replace('фото', 'photo')
    .replace(' — ', ' — ');
}




window.navigateTo = navigateTo;
window.handleMenuClick = handleMenuClick;
window.setLanguage = setLanguage;
window.contactUs = contactUs;
window.scrollToContacts = scrollToContacts;
window.openGallery = openGallery;
window.closeGallery = closeGallery;
window.nextGallery = nextGallery;
window.prevGallery = prevGallery;
