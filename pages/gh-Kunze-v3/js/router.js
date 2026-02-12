// gh-Kunze/js/router.js

(function () {
  function parseHash() {
    const hash = window.location.hash || '';
    // формат: #/model/bz3x
    const parts = hash.replace(/^#\/?/, '').split('/');
    if (parts[0] === 'model' && parts[1]) {
      return { type: 'model', slug: parts[1].toLowerCase() };
    }
    return { type: 'home' };
  }

  function findCarBySlug(slug) {
    if (!window.CARS) return null;
    return window.CARS.find((c) => c.slug.toLowerCase() === slug);
  }

  function renderHome() {
    // тут ти можеш викликати існуючу логіку з app.js
    // наприклад:
    if (window.renderHomePage) {
      window.renderHomePage();
      return;
    }

    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <section class="section">
        <div class="section-inner">
          <h1>Kunze Auto</h1>
          <p>Оберіть модель у верхньому меню.</p>
        </div>
      </section>
    `;
  }

  function handleRoute() {
    const route = parseHash();
    if (route.type === 'model') {
      const car = findCarBySlug(route.slug);
      if (car && window.renderModelPage) {
        window.renderModelPage(car);
      } else {
        renderHome();
      }
    } else {
      renderHome();
    }
  }

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);

  window.router = { handleRoute };
})();
