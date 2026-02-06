// ==============================
// AUTH: робота з JWT у браузері
// ==============================

const AUTH_KEY = "denysblog_token";

function authSaveToken(token) {
  localStorage.setItem(AUTH_KEY, token);
}

function authGetToken() {
  return localStorage.getItem(AUTH_KEY) || "";
}

function authClearToken() {
  localStorage.removeItem(AUTH_KEY);
}

async function authLogin() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const out = document.getElementById("login-output");

  out.textContent = "Логін...";

  try {
    const data = await api.login(username, password);

    if (data.error) {
      out.textContent = "Помилка: " + data.error;
      return;
    }

    authSaveToken(data.token);
    out.textContent = "Успішний логін. Оновлюю сторінку...";
    setTimeout(() => location.reload(), 700);
  } catch (e) {
    out.textContent = "Помилка мережі";
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
