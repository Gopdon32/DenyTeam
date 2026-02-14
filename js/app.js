/**
 * [CONFIG] Глобальное состояние
 */
let currentLang = localStorage.getItem('lang') || 'ru';
let dictionary = {};
let users = {}; 
let activeUser = null;
let userKey = 'me';

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
        const [langRes, dbRes] = await Promise.all([
            fetch('./lang.json'),
            fetch('./data/projects.json')
        ]);
        
        dictionary = await langRes.json();
        users = await dbRes.json();

        const params = new URLSearchParams(window.location.search);
        userKey = params.get('user') || 'me';
        activeUser = users[userKey] || users.me;

        applyUserTheme();
        setupEventListeners();
        render();

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
    root.removeAttribute('style');

    const theme = activeUser.theme || {};
    const colors = {
        'accent-green': theme.accent || (userKey === 'girl' ? '#ff79c6' : userKey === 'friend' ? '#ff0033' : '#22c55e'),
        'bg-black': theme.bg || '#080808',
        'bg-surface': theme.surface || '#121212',
        'bg-card': theme.card || '#181818'
    };

    Object.entries(colors).forEach(([key, val]) => {
        root.style.setProperty(`--${key}`, val);
    });

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

    document.body.className = activeUser.themeClass || (userKey === 'girl' ? 'soft-mode' : userKey === 'friend' ? 'audi-mode' : 'default-mode');
    
    document.querySelectorAll('.user-link').forEach(link => {
        link.classList.toggle('active', link.id === `nav-${userKey}`);
    });
}

/**
 * [RENDER] Главная функция отрисовки
 */
function render(filter = 'all', isTag = false) {
    const t = dictionary[currentLang] || {};
    
    document.getElementById('about-name').innerText = activeUser.name;
    document.getElementById('hero-subtitle').innerText = t[activeUser.roleKey] || activeUser.role || "";
    document.getElementById('about-text').innerText = activeUser.bio[currentLang] || activeUser.bio || "";
    document.getElementById('count-projects').innerText = activeUser.posts ? activeUser.posts.length : 0;
    document.getElementById('status-text').innerText = t[activeUser.statusKey] || "Online";
    document.getElementById('lang-switch').innerText = currentLang.toUpperCase();
    
    const socialContainer = document.getElementById('social-container');
    if (socialContainer && activeUser.links) {
        socialContainer.innerHTML = activeUser.links.map(l => `
            <a href="${l.url}" target="_blank" class="social-item"><i class="${l.icon}"></i></a>
        `).join('');
    }
    
    const badgeRow = document.getElementById('user-badges');
    if (badgeRow && activeUser.badges) {
        badgeRow.innerHTML = activeUser.badges.map(b => `<span class="premium-badge">${b}</span>`).join('');
    }

    renderPostGrid(filter, isTag);
}

function renderPostGrid(filter, isTag) {
    const posts = activeUser.posts || [];
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    let data = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

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
 * [ADMIN CMS LOGIC]
 */
window.switchAdminTab = (tab) => {
    document.getElementById('admin-list-tab').style.display = tab === 'list' ? 'block' : 'none';
    document.getElementById('admin-form-tab').style.display = tab === 'form' ? 'block' : 'none';
    document.getElementById('btn-tab-list')?.classList.toggle('active', tab === 'list');
    document.getElementById('btn-tab-form')?.classList.toggle('active', tab === 'form');
    if(tab === 'list') window.loadAdminList();
};

window.loadAdminList = () => {
    const u = document.getElementById('adm-manage-user').value;
    const cont = document.getElementById('admin-posts-container');
    const psts = users[u].posts || [];
    cont.innerHTML = psts.map((p, i) => `
        <div style="display:flex; align-items:center; justify-content:space-between; background:#1a1a1a; padding:10px; border-radius:10px; border:1px solid #333; margin-bottom:5px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:35px; height:35px; border-radius:4px; background:url('${p.image}') center/cover"></div>
                <span style="color:white; font-size:13px;">${p.title}</span>
            </div>
            <div style="display:flex; gap:5px;">
                <button onclick="window.prepareEdit('${u}', ${i})" style="background:#333; color:#fff; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-pen"></i></button>
                <button onclick="window.deletePost('${u}', ${i})" style="background:#422; color:#f55; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
};

window.prepareEdit = (u, i) => {
    const p = users[u].posts[i];
    document.getElementById('adm-user-select').value = u;
    document.getElementById('adm-title').value = p.title;
    document.getElementById('adm-img').value = p.image;
    document.getElementById('adm-category').value = p.category;
    document.getElementById('adm-tags').value = p.tags.join(', ');
    document.getElementById('adm-desc-ru').value = p.desc.ru;
    document.getElementById('adm-desc-en').value = p.desc.en;
    document.getElementById('adm-link').value = p.link || "";
    document.getElementById('edit-index').value = i;
    document.getElementById('adm-save-btn').innerText = "ОБНОВИТЬ ПОСТ";
    window.switchAdminTab('form');
};

async function publishPost() {
    const token = document.getElementById('adm-token').value;
    const targetUser = document.getElementById('adm-user-select').value;
    const editIdx = parseInt(document.getElementById('edit-index').value);
    const btn = document.getElementById('adm-save-btn');
    
    // ВАЛИДАЦИЯ
    const payload = {
        title: document.getElementById('adm-title').value.trim(),
        cat: document.getElementById('adm-category').value.trim(),
        tags: document.getElementById('adm-tags').value.trim(),
        img: document.getElementById('adm-img').value,
        descRu: document.getElementById('adm-desc-ru').value.trim()
    };

    if (!payload.title || !payload.cat || !payload.tags || !payload.img || !payload.descRu || !token) {
        return showToast("Ошибка: Заполните все поля отмеченные *");
    }

    btn.disabled = true;
    btn.innerText = "Синхронизация...";

    try {
        const url = `https://api.github.com/repos/${GH_SETTINGS.owner}/${GH_SETTINGS.repo}/contents/${GH_SETTINGS.path}`;
        const res = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        const fileData = await res.json();
        const db = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));

        const newPost = {
            title: payload.title,
            image: payload.img,
            link: document.getElementById('adm-link').value || "#",
            date: new Date().toISOString().split('T')[0],
            tags: payload.tags.split(',').map(t => t.trim()),
            category: payload.cat,
            featured: true,
            desc: {
                ru: payload.descRu,
                en: document.getElementById('adm-desc-en').value.trim() || payload.descRu
            }
        };

        if (editIdx > -1) {
            db[targetUser].posts[editIdx] = newPost;
        } else {
            db[targetUser].posts.unshift(newPost);
        }

        const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(db, null, 2))));
        
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: editIdx > -1 ? `Update: ${newPost.title}` : `Add: ${newPost.title}`,
                content: updatedContent,
                sha: fileData.sha
            })
        });

        if (putRes.ok) {
            localStorage.setItem('gh_token', token);
            showToast("Успешно сохранено!");
            setTimeout(() => location.reload(), 1000);
        } else {
            throw new Error("GitHub Error");
        }
    } catch (err) {
        showToast("Ошибка API!");
        btn.disabled = false;
        btn.innerText = "ОПУБЛИКОВАТЬ";
    }
}
window.publishPost = publishPost;

window.deletePost = async (u, i) => {
    if(!confirm("Удалить этот проект навсегда?")) return;
    const token = document.getElementById('adm-token').value;
    if(!token) return showToast("Нужен токен для удаления!");

    try {
        const url = `https://api.github.com/repos/${GH_SETTINGS.owner}/${GH_SETTINGS.repo}/contents/${GH_SETTINGS.path}`;
        const res = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        const fileData = await res.json();
        const db = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));

        db[u].posts.splice(i, 1);

        const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(db, null, 2))));
        await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}` },
            body: JSON.stringify({ message: `Delete project from ${u}`, content: updatedContent, sha: fileData.sha })
        });
        showToast("Удалено");
        setTimeout(() => location.reload(), 500);
    } catch (e) { showToast("Ошибка удаления"); }
};

/**
 * [UI SETTINGS]
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
                    <p>${post.desc ? post.desc[currentLang] : ""}</p>
                </div>
                <div class="modal-footer-actions">
                    ${post.link && post.link !== "#" ? `<a href="${post.link}" target="_blank" class="btn-open primary-action">Открыть проект</a>` : ''}
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
 * [EVENTS]
 */
function setupEventListeners() {
    let clicks = 0;
    document.querySelector('.avatar').onclick = () => {
        if (++clicks === 5) {
            document.getElementById('admin-panel').style.display = 'block';
            window.switchAdminTab('list');
            clicks = 0;
        }
    };

    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) {
        const tokenInput = document.getElementById('adm-token');
        if (tokenInput) tokenInput.value = savedToken;
    }

    document.getElementById('lang-switch').onclick = () => {
        currentLang = currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', currentLang);
        render();
        showToast(currentLang === 'ru' ? "Язык изменен" : "Language changed");
    };

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            if(btn.id.startsWith('btn-tab')) return;
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            render(btn.dataset.cat);
        };
    });

    document.getElementById('adm-file').onchange = function(e) {
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('adm-img').value = reader.result;
            showToast("Картинка готова!");
        };
        if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
    };

    window.onscroll = () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progress = document.getElementById('progress-bar');
        if(progress) progress.style.width = scrolled + "%";

        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 500);
    };

    document.getElementById('scroll-top').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    window.onclick = (e) => {
        if (e.target.id === 'modal') closeModal();
        if (e.target.id === 'admin-panel') e.target.style.display = 'none';
    };
}

init();