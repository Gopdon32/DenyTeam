// ==============================
// THEME: load saved theme
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("theme-dark");
  }

  const btnDesktop = document.getElementById("theme-toggle");
  const btnMobile  = document.getElementById("theme-toggle-mobile");

  function toggleTheme() {
    document.documentElement.classList.toggle("theme-dark");
    const isDark = document.documentElement.classList.contains("theme-dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  if (btnDesktop) btnDesktop.addEventListener("click", toggleTheme);
  if (btnMobile)  btnMobile.addEventListener("click", toggleTheme);
});


// ==============================
// BURGER MENU
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobile-menu");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      menu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove("active");
        menu.classList.remove("open");
      }
    });
  }
});


// ==============================
// TOAST
// ==============================

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}


// ==============================
// INPUT FILLED STATE
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.classList.add("filled");
      } else {
        input.classList.remove("filled");
      }
    });
  });
});


// ==============================
// AUTO OPEN CREATE POST MODAL
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("create") === "1") {
    const modal = document.getElementById("create-post-modal");
    if (modal) modal.classList.add("show");

    history.replaceState({}, document.title, window.location.pathname);
  }
});
