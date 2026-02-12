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
  const app = document.getElementById('app');
  
  app.innerHTML = `
    ${renderNavbar()}
    <div class="page">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>GAC Toyota - Електромобілі майбутнього</h1>
            <p>Преміальні моделі з гарантією, фінансуванням та доставкою в Україну</p>
          </div>
        </div>
      </section>

      <section class="guarantee-section">
        <div class="container">
          <div class="guarantee-card">
            <div class="guarantee-icon">⚡</div>
            <div class="guarantee-content">
              <h3>Гарантія на акумулятор</h3>
              <p>GAC Toyota обіцяє, що у разі самовпалювання акумулятора компенсує новим автомобілем</p>
            </div>
          </div>
        </div>
      </section>

      <section class="catalog-container">
        <div class="container">
          <div class="catalog-title">
            <h2>Наш каталог автомобілів</h2>
            <p>Виберіть модель та перегляньте всі специфікації, ціни та комплектації</p>
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
  return `
    <div class="catalog-card" onclick="navigateTo('#/model/${car.slug}')">
      <div class="card-image-wrapper">
        <img src="${car.heroImage}" alt="${car.brand} ${car.model}" class="card-image" />
        <span class="card-badge">NEW</span>
        <div class="card-flag">
          <img src="src/images/flag-ua.svg" alt="Україна" title="Україна" />
        </div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <div class="card-title">
            <div class="card-brand">${car.brand}</div>
            <div class="card-model">${car.model}</div>
            <div class="card-year">${car.year}</div>
          </div>
        </div>
        
        <div class="card-price">від ${formatPrice(car.trims[0].price)} ₴</div>
        
        <div class="card-specs">
          <div class="spec-item">
            <span class="spec-label">Мотор:</span>
            <span>${car.trims[0].powerHp || 'N/A'} hp</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Батарея:</span>
            <span>${car.trims[0].batteryKwh || 'N/A'} kWh</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Запас:</span>
            <span>${car.trims[0].rangeKm || 'N/A'} km</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Привід:</span>
            <span>${car.trims[0].drive || 'N/A'}</span>
          </div>
        </div>

        <p class="card-description">${car.descriptionShort}</p>

        <div class="card-footer">
          <button class="btn btn-primary btn-small" onclick="navigateTo('#/model/${car.slug}')">Докладніше</button>
          <button class="btn btn-secondary btn-small" onclick="contactUs('${car.model}')">Замовити</button>
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
  
  // Reset gallery for new model
  currentGalleryIndex = 0;
  currentGallery = car.gallery || [];
  
  initMobileMenu();
  setupGalleryInteraction();
}

function renderModelHero(car) {
  const firstTrim = car.trims[0];
  return `
    <section class="model-hero">
      <div class="container">
        <div class="model-hero-content">
          <div class="model-hero-image">
            <img src="${car.heroImage}" alt="${car.brand} ${car.model}" />
          </div>
          <div class="model-hero-info">
            <h1>${car.brand} ${car.model} ${car.year}</h1>
            <div class="model-hero-price">від ${formatPrice(firstTrim.price)} ₴</div>
            <p class="model-hero-desc">${car.descriptionShort}</p>
            
            <div class="model-hero-features">
              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.powerHp}</strong> к.с.</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.batteryKwh}</strong> кВт⋅ч</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon"></div>
                <span><strong>${firstTrim.rangeKm}</strong> км запасу</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon"></div>
                <span>Привід <strong>${firstTrim.drive}</strong></span>
              </div>
            </div>

            <div class="model-hero-cta">
              <button class="btn btn-primary" onclick="contactUs('${car.model}')">Замовити тест-драйв</button>
              <button class="btn btn-outline" onclick="scrollToContacts()">Зв'язатися</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTrimsSection(car) {
  return `
    <section class="trims-section">
      <div class="container">
        <div class="trims-title">
          <h2>Комплектації та ціни</h2>
          <p>Виберіть комплектацію, яка вам найбільше підходить</p>
        </div>

        <div class="trims-list">
          ${car.trims.map((trim, idx) => `
            <div class="trim-card">
              <div class="trim-name">${trim.name}</div>
              <div class="trim-price">${formatPrice(trim.price)} ₴</div>
              
              <div class="trim-specs">
                <div class="trim-spec">
                  <span class="trim-spec-label">Power</span>
                  <span class="trim-spec-value">${trim.powerHp} к.с.</span>
                </div>
                <div class="trim-spec">
                  <span class="trim-spec-label">Battery</span>
                  <span class="trim-spec-value">${trim.batteryKwh} kWh</span>
                </div>
                <div class="trim-spec">
                  <span class="trim-spec-label">Range</span>
                  <span class="trim-spec-value">${trim.rangeKm} km</span>
                </div>
                <div class="trim-spec">
                  <span class="trim-spec-label">Drive</span>
                  <span class="trim-spec-value">${trim.drive}</span>
                </div>
                <div class="trim-spec">
                  <span class="trim-spec-label">Colors</span>
                  <span class="trim-spec-value">${trim.colors.join(', ')}</span>
                </div>
              </div>

              <button class="btn btn-secondary" style="width:100%; margin-top: 15px;" onclick="contactUs('${car.model} ${trim.name}')">
                Order Now
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderVideoReviewSection(car) {
  return `
    <!--
    <section class="video-review">
      <div class="container">
        <div class="video-review-title">
          <h2>Відеоогляд</h2>
          <p>Дивіться детальні відеооглади ${car.brand} ${car.model}</p>
        </div>

        <div class="video-wrapper">
          <video controls>
            <source src="path/to/video.mp4" type="video/mp4">
            Ваш браузер не підтримує відео.
          </video>
        </div>
      </div>
    </section>
    -->
  `;
}

function renderPdfSection(car) {
  const pdfs = getPdfLinks(car.slug);
  if (!pdfs || pdfs.length === 0) {
    return '';
  }

  return `
    <section class="pdf-section">
      <div class="container">
        <div class="pdf-title">
          <h2>Технічні характеристики</h2>
          <p>Завантажте PDF з детальними специфікаціями моделі</p>
        </div>

        <div class="pdf-list">
          ${pdfs.map(pdf => {
            const fileName = pdf.split('/').pop();
            return `
              <a href="${pdf}" target="_blank" class="pdf-link">
                <span class="pdf-icon">📄</span>
                <span class="pdf-name">${fileName.replace(/.pdf$/, '').replace(/-/g, ' ')}</span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderGallerySection(car) {
  if (!car.gallery || car.gallery.length === 0) {
    return '';
  }

  return `
    <section class="gallery-section">
      <div class="container">
        <div class="gallery-title">
          <h2>Галерея фото</h2>
          <p>Переглядайте детальні фотографії ${car.brand} ${car.model}</p>
        </div>

        <div class="gallery-grid">
          ${car.gallery.map((img, idx) => `
            <div class="gallery-item" onclick="openGallery(${idx})">
              <img src="${img}" alt="Фото ${idx + 1}" />
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderContactsSection() {
  return `
    <section class="contacts-section" id="contacts">
      <div class="container">
        <div class="contacts-title">
          <h2>Зв'яжіться з нами</h2>
          <p>Наша команда готова відповісти на всі ваші запитання</p>
        </div>

        <div class="contacts-grid">
          ${APP_CONFIG.STORES.map(store => `
            <div class="contact-item">
              <div class="contact-label">📍 ${store.name}</div>
              <div class="contact-value">${store.address}</div>
              <div class="contact-label">Телефони</div>
              <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="contact-phone">
                ${APP_CONFIG.PRIMARY_PHONE}
              </a>
              <a href="tel:${APP_CONFIG.SECONDARY_PHONE.replace(/\s+/g, '')}" style="display: block; margin-top: 8px;">
                ${APP_CONFIG.SECONDARY_PHONE}
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
  return `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <div class="navbar-brand" onclick="navigateTo('')">
            <span class="navbar-brand-text">KUNZE</span>
            <span style="opacity: 0.6;">Auto</span>
          </div>

          <div class="navbar-menu" id="navMenu">
            <a href="#" onclick="handleMenuClick(event, 'catalog')">Каталог</a>
            <a href="#" onclick="handleMenuClick(event, 'contacts')">Контакти</a>
            <a href="#" onclick="handleMenuClick(event, 'order')">Замовити</a>
          </div>

          <div class="navbar-contacts">
            <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="navbar-contact-phone">
              ☎️ ${APP_CONFIG.PRIMARY_PHONE}
            </a>
            
            <div class="navbar-socials">
              <a href="${APP_CONFIG.SOCIAL.telegram}" target="_blank" class="navbar-social-icon" title="Telegram">${getSocialIcon('telegram')}</a>
              <a href="${APP_CONFIG.SOCIAL.whatsapp}" target="_blank" class="navbar-social-icon" title="WhatsApp">${getSocialIcon('whatsapp')}</a>
              <a href="${APP_CONFIG.SOCIAL.tiktok}" target="_blank" class="navbar-social-icon" title="TikTok">${getSocialIcon('tiktok')}</a>
            </div>
          </div>

          <button class="navbar-toggle" id="mobileToggle">
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
  return `
    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Період роботи</h4>
            <ul>
              <li><strong>На будні:</strong> 08:00 - 18:00</li>
              <li><strong>Обід:</strong> 13:00 - 14:00</li>
              <li><strong>У вихідні:</strong> 10:00 - 16:00</li>
              <li><a href="#">Придбати онлайн</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contacts</h4>
            ${APP_CONFIG.STORES.map(store => `
              <div class="footer-contact">
                <strong>${store.name}</strong><br>
                📍 ${store.address}<br>
                <a href="tel:${APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '')}" class="contact-phone">
                  ${APP_CONFIG.PRIMARY_PHONE}
                </a>
              </div>
            `).join('')}
            <div class="footer-socials">
              <a href="${APP_CONFIG.SOCIAL.telegram}" target="_blank" class="footer-social" title="Telegram">${getSocialIcon('telegram')}</a>
              <a href="${APP_CONFIG.SOCIAL.whatsapp}" target="_blank" class="footer-social" title="WhatsApp">${getSocialIcon('whatsapp')}</a>
              <a href="${APP_CONFIG.SOCIAL.tiktok}" target="_blank" class="footer-social" title="TikTok">${getSocialIcon('tiktok')}</a>
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
  // Always ensure we have the correct gallery for current model
  if (currentGallery.length === 0) {
    const modelMatch = window.location.hash.match(/#\/model\/([a-z0-9\-]+)/);
    if (modelMatch) {
      const car = cars.find(c => c.slug === modelMatch[1]);
      if (car && car.gallery) {
        currentGallery = car.gallery;
      }
    }
  }
  
  const popup = document.getElementById('galleryPopup');
  const img = document.getElementById('galleryImage');
  const current = document.getElementById('current');
  const total = document.getElementById('total');
  
  if (currentGallery.length > 0) {
    img.src = currentGallery[currentGalleryIndex];
    current.textContent = currentGalleryIndex + 1;
    total.textContent = currentGallery.length;
    popup.classList.add('open');
    popup.removeAttribute('inert');
    document.body.style.overflow = 'hidden';
  }
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
  const popup = document.getElementById('galleryPopup');
  const closeBtn = document.querySelector('.gallery-popup-close');
  const nextBtn = document.querySelector('.gallery-next');
  const prevBtn = document.querySelector('.gallery-prev');
  
  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  if (nextBtn) nextBtn.addEventListener('click', nextGallery);
  if (prevBtn) prevBtn.addEventListener('click', prevGallery);
  
  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closeGallery();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (popup && popup.classList.contains('open')) {
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') nextGallery();
      if (e.key === 'ArrowLeft') prevGallery();
    }
  });
}

// ============================================================================
// MOBILE MENU
// ============================================================================

function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  
  if (toggle && menu) {
    // Remove old listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    const toggleBtn = document.getElementById('mobileToggle');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('active');
      menu.classList.toggle('active');
    });
    
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        // Close menu after clicking
        setTimeout(() => {
          toggleBtn.classList.remove('active');
          menu.classList.remove('active');
        }, 100);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        toggleBtn.classList.remove('active');
        menu.classList.remove('active');
      }
    });
  }
}

// ============================================================================
// EVENT LISTENERS & INTERACTIONS
// ============================================================================

function setupEventListeners() {
  setupGalleryInteraction();
}

function navigateTo(hash) {
  window.location.hash = hash;
}

function handleMenuClick(e, action) {
  e.preventDefault();
  e.stopPropagation();
  
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('navMenu');
  
  // Close mobile menu
  if (toggle && menu) {
    toggle.classList.remove('active');
    menu.classList.remove('active');
  }
  
  if (action === 'catalog') {
    // Go to catalog/home
    window.location.hash = '/';
  } else if (action === 'contacts') {
    // Go to home and scroll to contacts
    window.location.hash = '/';
    setTimeout(() => {
      scrollToContacts();
    }, 200);
  } else if (action === 'order') {
    // Open WhatsApp contact
    contactUs();
  }
}

function scrollToContacts() {
  const contacts = document.getElementById('contacts');
  if (contacts) {
    setTimeout(() => {
      contacts.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    navigateTo('');
  }
}

function contactUs(model = '') {
  const phone = APP_CONFIG.PRIMARY_PHONE.replace(/\s+/g, '');
  const message = model ? `Мене цікавить ${model}` : 'Хочу отримати більше інформації';
  window.open(`https://wa.me/380732999777?text=${encodeURIComponent(message)}`, '_blank');
}

// ============================================================================
// UTILITIES
// ============================================================================

function formatPrice(price) {
  if (!price) return 'N/A';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}



