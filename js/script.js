document.addEventListener("DOMContentLoaded", function () {
  // --- 1. Установка Веб-Версии ---
  // Определяем версию ОДИН РАЗ здесь
  const APP_VERSION = "1.0";

  // Находим элементы плейсхолдеров и вставляем версию
  const btnVersPlaceholder = document.getElementById("btn-vers-placeh");
  const blckVersPlaceholder = document.getElementById("blck-vers-placeh");

  if (btnVersPlaceholder) btnVersPlaceholder.textContent = APP_VERSION;
  if (blckVersPlaceholder) blckVersPlaceholder.textContent = APP_VERSION;

  // --- 2. Логика Бургер-меню ---
  const burgerButton = document.getElementById("burger");
  const navMenu = document.querySelector("nav");

  if (burgerButton && navMenu) {
    burgerButton.addEventListener("click", function () {
      // Переключаем класс 'active' на самой кнопке бургера
      burgerButton.classList.toggle("active");
      // Переключаем класс 'open'/'hidden-nav' на меню (используйте ваш класс)
      navMenu.classList.toggle("open");
    });
  }

  // --- 3. Логика открытия Блока Версии ---
  const versionButton = document.getElementById("version");
  const versionBlock = document.getElementById("versionBlock-hide");

  if (versionButton && versionBlock) {
    versionButton.addEventListener("click", function () {
      // Переключаем класс 'active' на кнопке версии
      versionButton.classList.toggle("active");

      // Переключаем класс 'hiden' на блоке версии, чтобы показать/скрыть его
      versionBlock.classList.toggle("hiden");
    });
  }
});
