/**
 * [IMPORT] Данные всех пользователей
 */
import { users } from './data.js';

/**
 * [CONFIG] Глобальное состояние
 */
let currentLang = localStorage.getItem('lang') || 'ru';
let dictionary = {};

const params = new URLSearchParams(window.location.search);
const userKey = params.get('user') || 'me';
const activeUser = users[userKey] || users.me;

/**
 * [CORE] Инициализация приложения
 */
async function init() {
    try {
        const response = await fetch('./lang.json');
        dictionary = await response.json();
    } catch (e) {
        console.error("Ошибка локализации:", e);
    }

    // Применяем тему и кастомные стили
    applyUserTheme();

    // Настройка слушателей событий
    setupEventListeners();
    
    // Первый рендер
    render();
}

/**
 * [THEME] Применение индивидуальных стилей и Аватара
 */
function applyUserTheme() {
    const root = document.documentElement;
    
    // Безопасное получение темы
    const theme = activeUser.theme || {};

    // Установка CSS переменных
    root.style.setProperty('--accent-green', theme.accent || '#22c55e');
    root.style.setProperty('--bg-black', theme.bg || '#080808');
    root.style.setProperty('--bg-surface', theme.surface || '#121212');
    root.style.setProperty('--bg-card', theme.card || '#181818');

    // Настройка Большого Аватара
    const avatarEl = document.querySelector('.avatar');
    if (avatarEl) {
        if (activeUser.avatar) {
            avatarEl.style.backgroundImage = `url('${activeUser.avatar}')`;
            avatarEl.innerText = "";
        } else {
            avatarEl.innerText = activeUser.name ? activeUser.name.charAt(0) : "D";
            avatarEl.style.backgroundImage = "none";
            avatarEl.style.background = theme.accent || '#22c55e';
        }
    }

    // Переключение режимов отображения в body
    document.body.classList.remove('audi-mode', 'soft-mode', 'loading');
    if (activeUser.themeClass) {
        document.body.classList.add(activeUser.themeClass);
    } else {
        if (userKey === 'friend') document.body.classList.add('audi-mode');
        if (userKey === 'girl') document.body.classList.add('soft-mode');
    }

    // Подсветка активного пользователя в навигации
    document.querySelectorAll('.user-link').forEach(link => {
        link.classList.remove('active');
        if (link.id === `nav-${userKey}`) link.classList.add('active');
    });
}

/**
 * [RENDER] Главный дирижер
 */
const render = (filter = 'all', isTag = false) => {
    const langData = dictionary[currentLang] || {};
    
    updateStaticTexts(langData);
    renderDetailedProfile();
    
    // Работаем с массивом posts (новые сверху)
    const posts = activeUser.posts || [];
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    renderPostGrid(filter, isTag, sortedPosts);
};

/**
 * [SUB-RENDER] Обновление текстов интерфейса
 */
function updateStaticTexts(t) {
    const mapping = {
        'works-title': 'works_title',
        'footer-text': 'footer_text',
        'filter_all': 'filter_all',
        'filter_layout': 'filter_layout',
        'filter_js': 'filter_js',
        'label-projects': 'user_projects',
        'label-status': 'status_label'
    };

    Object.entries(mapping).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && t[key]) el.innerText = t[key];
    });

    const aboutName = document.getElementById('about-name');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const aboutText = document.getElementById('about-text');
    const countProjects = document.getElementById('count-projects');
    const statusText = document.getElementById('status-text');
    const searchInput = document.getElementById('project-search');

    if (aboutName) aboutName.innerText = activeUser.name;
    if (heroSubtitle) heroSubtitle.innerText = t[activeUser.roleKey] || activeUser.role || "";
    
    if (aboutText) {
        aboutText.innerText = typeof activeUser.bio === 'object' 
            ? activeUser.bio[currentLang] 
            : activeUser.bio || "";
    }

    if (countProjects) countProjects.innerText = activeUser.posts?.length || 0;
    if (statusText) statusText.innerText = t[activeUser.statusKey] || activeUser.status || "Online";
    if (searchInput && t.search_placeholder) searchInput.placeholder = t.search_placeholder;

    const langBtn = document.getElementById('lang-switch');
    if (langBtn) langBtn.innerText = currentLang.toUpperCase();
}

/**
 * [SUB-RENDER] Соцсети и бейджи
 */
function renderDetailedProfile() {
    const socialContainer = document.getElementById('social-container');
    if (socialContainer && activeUser.links) {
        socialContainer.innerHTML = activeUser.links.map(link => `
            <a href="${link.url}" target="_blank" class="social-item" title="${link.url}">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    }

    const badgeRow = document.getElementById('user-badges');
    if (badgeRow && activeUser.badges) {
        badgeRow.innerHTML = activeUser.badges.map(b => `
            <span class="premium-badge">${b}</span>
        `).join('');
    }
}

/**
 * [SUB-RENDER] Сетка постов (вместо проектов)
 */
function renderPostGrid(filter, isTag, dataArray) {
    const filtered = filter === 'all' 
        ? dataArray 
        : isTag 
            ? dataArray.filter(p => p.tags.includes(filter))
            : dataArray.filter(p => p.category === filter);

    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results">${currentLang === 'ru' ? 'Записей не найдено' : 'No posts found'}</div>`;
        return;
    }

    grid.innerHTML = filtered.map((p) => `
        <div class="card post-card" style="animation: fadeInUp 0.5s ease forwards">
            ${p.featured ? `<div class="featured-badge">NEW</div>` : ''}
            <div class="card-img" style="background-image: url('${p.image}')"></div>
            <div class="card-content">
                <span class="post-date">${p.date || ''}</span>
                <div class="tags">${p.tags.map(t => `<span class="tag clickable-tag">#${t}</span>`).join('')}</div>
                <h3>${p.title}</h3>
                <p class="post-preview">${p.desc ? p.desc[currentLang] : ''}</p>
                <div class="btn-open">${currentLang === 'ru' ? 'Читать далее' : 'Read more'}</div>
            </div>
        </div>
    `).join('');

    // Обработка кликов
    grid.querySelectorAll('.card').forEach((card, idx) => {
        card.onclick = (e) => {
            if (!e.target.classList.contains('clickable-tag')) {
                showModal(filtered[idx]);
            }
        };
    });

    grid.querySelectorAll('.clickable-tag').forEach(tag => {
        tag.onclick = (e) => {
            e.stopPropagation();
            const tagName = tag.innerText.replace('#', '');
            render(tagName, true);
            const title = document.getElementById('works-title');
            if (title) title.scrollIntoView({ behavior: 'smooth' });
        };
    });
}

/**
 * [UI] Закрытие модального окна
 * Используем именованную функцию (function), она "всплывает" в коде автоматически.
 */
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Возвращаем скролл
    }
}

/**
 * [UI] Улучшенное модальное окно
 */
const showModal = (post) => {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-data');
    
    if (!modal || !content) return; // Защита от ошибок, если HTML не прогружен

    const description = post.desc ? post.desc[currentLang] : (post.description || "");

    content.innerHTML = `
        <div class="modal-card">
            <div class="modal-header-img" style="background-image: url('${post.image}')">
                <div class="modal-header-overlay">
                    <div class="modal-header-text">
                        <span class="modal-label">${post.category ? post.category.toUpperCase() : 'PROJECT'}</span>
                        <h2>${post.title}</h2>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-meta-bar">
                    <div class="meta-block">
                        <i class="fa-regular fa-calendar"></i>
                        <span>${post.date || '2024'}</span>
                    </div>
                    <div class="meta-block">
                        <i class="fa-solid fa-layer-group"></i>
                        <div class="tags">
                            ${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-content-main">
                    <div class="description-section">
                        <h3>${currentLang === 'ru' ? 'Описание' : 'Description'}</h3>
                        <p>${description}</p>
                    </div>
                    <div class="tech-section">
                        <h4>${currentLang === 'ru' ? 'Технологический стек' : 'Tech Stack'}</h4>
                        <div class="tech-icons">
                            <i class="fa-brands fa-html5"></i>
                            <i class="fa-brands fa-css3-alt"></i>
                            <i class="fa-brands fa-js"></i>
                        </div>
                    </div>
                </div>
                <div class="modal-footer-actions">
                    ${post.link ? `
                        <a href="${post.link}" target="_blank" class="btn-open primary-action">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            ${currentLang === 'ru' ? 'Открыть проект' : 'Launch Demo'}
                        </a>
                    ` : ''}
                    <button class="btn-secondary" id="close-modal-btn">
                        ${currentLang === 'ru' ? 'Закрыть' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Безопасное назначение клика
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.onclick = closeModal;
};

/**
 * [UI] Уведомления (Toasts)
 */
window.showToast = (message) => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.add('visible'); }, 10);
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

/**
 * [EVENTS] Слушатели
 */
function setupEventListeners() {
    // 1. Поиск по постам
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.oninput = (e) => {
            const query = e.target.value.toLowerCase();
            // Используем activeUser.posts (убедись, что activeUser глобально доступен)
            const filtered = activeUser.posts.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.tags.some(t => t.toLowerCase().includes(query))
            );
            renderPostGrid('all', false, filtered);
        };
    }
    
    // 3. Закрытие модалки (Клик по фону)
    window.onclick = (e) => { 
        if (e.target.id === 'modal') closeModal(); 
    };

    // 4. Фильтрация категорий
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            // Если render() принимает категорию — все ок. 
            // Иначе используй renderPostGrid(btn.dataset.cat)
            render(btn.dataset.cat, false);
        };
    });

    // 5. Переключение языка
    const langBtn = document.getElementById('lang-switch');
    if (langBtn) {
        langBtn.onclick = () => {
            currentLang = currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem('lang', currentLang);
            
            // Перерисовываем весь интерфейс
            render(); 
            
            // Вызов тоста (проверь наличие функции window.showToast)
            if (window.showToast) {
                window.showToast(currentLang === 'ru' ? "Язык обновлен" : "Language updated");
            }
        };
    }

    // 6. Прокрутка: Прогресс-бар и кнопка "Вверх"
    window.onscroll = () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = scrolled + "%";

        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }
    };

    // 7. Клик по кнопке "Вверх"
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 8. Эффект свечения курсора (Glow)
    const glow = document.getElementById('cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });
    }
}

init();