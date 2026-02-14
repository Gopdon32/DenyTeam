/**
 * [CONFIG] Глобальное состояние
 */
let currentLang = localStorage.getItem('lang') || 'ru';
let dictionary = {};
let users = {}; 
let activeUser = null;
let userKey = 'me';

// Настройки для GitHub API
const GH_SETTINGS = {
    owner: "Gopdon32",
    repo: "DenyTeam", 
    path: "data/projects.json"
};

/**
 * [CORE] Инициализация приложения
 */
async function init() {
    try {
        // Загружаем локализацию и базу данных одновременно
        const [langRes, dbRes] = await Promise.all([
            fetch('./lang.json'),
            fetch('./data/projects.json')
        ]);
        
        dictionary = await langRes.json();
        users = await dbRes.json();

        // Определяем, чью страницу показать
        const params = new URLSearchParams(window.location.search);
        userKey = params.get('user') || 'me';
        activeUser = users[userKey] || users.me;

        // Запуск интерфейса
        applyUserTheme();
        setupEventListeners();
        render();

        // Убираем экран загрузки
        document.body.classList.remove('loading');
    } catch (e) {
        console.error("Критическая ошибка инициализации:", e);
    }
}

/**
 * [THEME] Применение индивидуальных стилей
 */
function applyUserTheme() {
    const root = document.documentElement;
    root.removeAttribute('style'); // Очищаем старые переменные перед сменой пользователя

    const theme = activeUser.theme || {};
    
    // Цвета: берем из базы или ставим системные дефолты
    const colors = {
        'accent-green': theme.accent || (userKey === 'girl' ? '#ff79c6' : userKey === 'friend' ? '#ff0033' : '#22c55e'),
        'bg-black': theme.bg || '#080808',
        'bg-surface': theme.surface || '#121212',
        'bg-card': theme.card || '#181818'
    };

    // Применяем переменные к :root
    Object.entries(colors).forEach(([key, val]) => {
        root.style.setProperty(`--${key}`, val);
    });

    // Настройка аватара
    const avatarEl = document.querySelector('.avatar');
    if (avatarEl) {
        if (activeUser.avatar) {
            avatarEl.style.backgroundImage = `url('${activeUser.avatar}')`;
            avatarEl.innerText = "";
        } else {
            avatarEl.innerText = activeUser.name ? activeUser.name[0] : "D";
            avatarEl.style.backgroundImage = "none";
            avatarEl.style.backgroundColor = colors['accent-green'];
        }
    }

    // Класс для body (режимы отображения)
    document.body.className = activeUser.themeClass || (userKey === 'girl' ? 'soft-mode' : userKey === 'friend' ? 'audi-mode' : 'default-mode');
    
    // Подсветка активного пользователя в меню
    document.querySelectorAll('.user-link').forEach(link => {
        link.classList.toggle('active', link.id === `nav-${userKey}`);
    });
}

/**
 * [RENDER] Главная функция отрисовки
 */
function render(filter = 'all', isTag = false) {
    const t = dictionary[currentLang] || {};
    
    // Обновляем текстовые блоки
    document.getElementById('about-name').innerText = activeUser.name;
    document.getElementById('hero-subtitle').innerText = t[activeUser.roleKey] || activeUser.role || "";
    document.getElementById('about-text').innerText = activeUser.bio[currentLang] || activeUser.bio || "";
    document.getElementById('count-projects').innerText = activeUser.posts ? activeUser.posts.length : 0;
    document.getElementById('status-text').innerText = t[activeUser.statusKey] || "Online";
    document.getElementById('lang-switch').innerText = currentLang.toUpperCase();
    
    // Рендерим социальные сети
    const socialContainer = document.getElementById('social-container');
    if (socialContainer && activeUser.links) {
        socialContainer.innerHTML = activeUser.links.map(l => `
            <a href="${l.url}" target="_blank" class="social-item"><i class="${l.icon}"></i></a>
        `).join('');
    }
    
    // Рендерим бейджи
    const badgeRow = document.getElementById('user-badges');
    if (badgeRow && activeUser.badges) {
        badgeRow.innerHTML = activeUser.badges.map(b => `<span class="premium-badge">${b}</span>`).join('');
    }

    // Рендерим посты/проекты
    renderPostGrid(filter, isTag);
}

/**
 * [SUB-RENDER] Сетка карточек
 */
function renderPostGrid(filter, isTag) {
    const posts = activeUser.posts || [];
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Сортируем: новые сверху
    let data = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Фильтрация
    if (filter !== 'all') {
        data = isTag ? data.filter(p => p.tags.includes(filter)) : data.filter(p => p.category === filter);
    }

    if (data.length === 0) {
        grid.innerHTML = `<div class="no-results">${currentLang === 'ru' ? 'Записей нет' : 'Empty'}</div>`;
        return;
    }

    grid.innerHTML = data.map((p, index) => `
        <div class="card post-card" style="animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.05}s">
            ${p.featured ? '<div class="featured-badge">NEW</div>' : ''}
            <div class="card-img" style="background-image: url('${p.image}')"></div>
            <div class="card-content">
                <span class="post-date">${p.date || ''}</span>
                <div class="tags">${p.tags.map(tag => `<span class="tag clickable-tag">#${tag}</span>`).join('')}</div>
                <h3>${p.title}</h3>
                <p>${p.desc ? p.desc[currentLang] : ''}</p>
                <div class="btn-open">${currentLang === 'ru' ? 'Читать далее' : 'Read more'}</div>
            </div>
        </div>
    `).join('');

    // Вешаем события на новые карточки
    grid.querySelectorAll('.card').forEach((card, i) => {
        card.onclick = (e) => {
            if (!e.target.classList.contains('clickable-tag')) showModal(data[i]);
        };
    });

    grid.querySelectorAll('.clickable-tag').forEach(tag => {
        tag.onclick = (e) => {
            e.stopPropagation();
            render(tag.innerText.replace('#', ''), true);
            document.getElementById('works-title')?.scrollIntoView({ behavior: 'smooth' });
        };
    });
}

/**
 * [UI] Модальное окно
 */
function showModal(post) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-data');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="modal-card">
            <div class="modal-header-img" style="background-image: url('${post.image}')"></div>
            <div class="modal-body">
                <div class="modal-meta-bar">
                    <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                    <div class="tags">${post.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
                </div>
                <h2>${post.title}</h2>
                <div class="description-section">
                    <p>${post.desc ? post.desc[currentLang] : (post.description || "")}</p>
                </div>
                <div class="modal-footer-actions">
                    ${post.link ? `<a href="${post.link}" target="_blank" class="btn-open primary-action">Открыть проект</a>` : ''}
                    <button class="btn-secondary" onclick="closeModal()">Закрыть</button>
                </div>
            </div>
        </div>
    `;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

window.closeModal = () => {
    document.getElementById('modal').style.display = "none";
    document.body.style.overflow = "auto";
};

/**
 * [ADMIN] Логика публикации на GitHub
 */
async function publishPost() {
    const token = document.getElementById('adm-token').value;
    const targetUser = document.getElementById('adm-user-select').value;
    const btn = document.querySelector('.adm-publish-btn');
    
    if(!token) return showToast("Нужен GitHub Token!");
    btn.disabled = true;
    btn.innerText = "Загрузка...";

    try {
        const url = `https://api.github.com/repos/${GH_SETTINGS.owner}/${GH_SETTINGS.repo}/contents/${GH_SETTINGS.path}`;
        
        // 1. Получаем текущий файл
        const res = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        const fileData = await res.json();
        // Декодируем UTF-8 base64
        const db = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));
        const descRu = document.getElementById('adm-desc-ru').value;
        const descEn = document.getElementById('adm-desc-en').value || descRu; // Если EN пустое, берем RU

        // 2. Формируем новый пост
        const newPost = {
            title: document.getElementById('adm-title').value || "Без названия",
            image: document.getElementById('adm-img').value || "https://via.placeholder.com/800x450",
            link: document.getElementById('adm-link').value || "#",
            date: new Date().toISOString().split('T')[0],
            tags: document.getElementById('adm-tags').value.split(',').map(t => t.trim()),
            category: document.getElementById('adm-category').value || "js",
            featured: true,
            desc: {
                ru: document.getElementById('adm-desc-ru').value,
                en: document.getElementById('adm-desc-en').value
            }
        };

        // 3. Обновляем JSON
        db[targetUser].posts.unshift(newPost);

        // 4. Кодируем и отправляем назад
        const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(db, null, 2))));
        
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Admin: add project ${newPost.title}`,
                content: updatedContent,
                sha: fileData.sha
            })
        });

        if (putRes.ok) {
            localStorage.setItem('gh_token', token); // Запоминаем токен после первого успеха
            showToast("Успешно опубликовано!");
            setTimeout(() => location.reload(), 1500);
        } else {
            throw new Error("GitHub API Error");
        }
    } catch (err) {
        showToast("Ошибка публикации!");
        console.error(err);
        btn.disabled = false;
        btn.innerText = "ОПУБЛИКОВАТЬ";
    }
}
window.publishPost = publishPost;

/**
 * [UI] Уведомления
 */
function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast visible';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
window.showToast = showToast;

/**
 * [EVENTS] Слушатели событий
 */
function setupEventListeners() {
    // Секретный вход в админку (5 кликов по аватару)
    let clicks = 0;
    document.querySelector('.avatar').onclick = () => {
        if (++clicks === 5) {
            document.getElementById('admin-panel').style.display = 'block';
            clicks = 0;
        }

    // Автоподстановка токена при открытии
    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) {
        const tokenInput = document.getElementById('adm-token');
        if (tokenInput) tokenInput.value = savedToken;
    }
    };

    // Переключатель языка
    document.getElementById('lang-switch').onclick = () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', currentLang);
        render();
        showToast(currentLang === 'ru' ? "Язык изменен" : "Language changed");
    };

    // Фильтры категорий
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            render(btn.dataset.cat);
        };
    });

    // Поиск
    document.getElementById('project-search')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = activeUser.posts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.tags.some(t => t.toLowerCase().includes(query))
        );
        // Вызываем частичный рендер сетки
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = ""; // Очистка
        renderPostGrid('all', false); // В этой версии лучше передать отфильтрованный массив, но для простоты перерендерим по базе
    });

    // Прокрутка и прогресс-бар
    window.onscroll = () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-bar').style.width = scrolled + "%";

        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) {
            scrollBtn.classList.toggle('visible', window.scrollY > 500);
        }
    };

    document.getElementById('scroll-top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Закрытие модалок по фону
    window.onclick = (e) => {
        if (e.target.id === 'modal') closeModal();
        if (e.target.id === 'admin-panel') e.target.style.display = 'none';
    };
}

document.getElementById('adm-file').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function() {
        // Записываем картинку в скрытое поле в формате Base64
        document.getElementById('adm-img').value = reader.result;
        showToast("Картинка готова!");
    };
    reader.readAsDataURL(e.target.files[0]);
};

// Запуск
init();