// ==============================
// LOADER: Прелоадер
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 150);
});
