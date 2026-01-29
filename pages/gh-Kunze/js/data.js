// Упрощённый файл данных — лишнее удалено, структура документации сохранена.

/* Структура:
   cars: [
     { id, brand, model, year, heroImage, heroTagline, descriptionShort,
       ua: {...}, status: {...}, trims: [...], advantages: [...], gallery: [...], contacts: {...}, video: {...} }
   ]
*/

const cars = [
  {
    id: "bz3x",
    brand: "GAC Toyota",
    model: "BZ3X",
    year: 2025,

    heroImage: "src/images/bz3x-hero.jpg",
    heroTagline: "Електромобіль нового покоління",
    descriptionShort: "Преміальна динаміка. Великий запас ходу. Офіційна гарантія виробника.",

    ua: { symbol: "🇺🇦", note: "У разі заводського дефекту — повна компенсація або заміна авто" },

    status: {
      isNew: true,
      mileage: 0,
      pointsCheck: 18,
      stagesCheck: 3,
      notes: [
        "Автомобіль новий, без пробігу",
        "Оригінальна заводська плівка на салоні",
        "Повна передпродажна діагностика",
        "Доставка без пошкоджень",
      ],
    },

    trims: [
      { id: "610-max", name: "BZ3X 610 Max", type: "EV", colors: ["Білий", "Сірий", "Чорний"], rangeKm: 610, batteryKwh: 67.92, powerHp: 152, drive: "Передній", price: 38500 },
      { id: "520-pro", name: "BZ3X 520 Pro", type: "EV", colors: ["Білий"], rangeKm: 520, batteryKwh: 58.37, powerHp: 152, drive: "Передній", price: 36500 },
    ],

    advantages: ["Великий запас ходу", "Надійність Toyota", "Сучасні технології GAC", "Економічність", "Преміальний салон", "Високий рівень безпеки"],

    gallery: [
      { type: "exterior", src: "src/images/bz3x-exterior.png", alt: "Екстер'єр BZ3X" },
      { type: "interior", src: "src/images/bz3x-interior.png", alt: "Салон BZ3X" },
      { type: "trunk", src: "src/images/bz3x-trunk.png", alt: "Багажник BZ3X" },
      { type: "engine", src: "src/images/bz3x-engine.png", alt: "Моторний відсік BZ3X" },
      { type: "inside1", src: "src/images/c1.jpg", alt: "Салон BZ3X" },
      { type: "inside2", src: "src/images/c2.jpg", alt: "Салон BZ3X" },
      { type: "inside3", src: "src/images/c3.jpg", alt: "Салон BZ3X" },
    ],

    contacts: {
      partner: "Kunze — офіційний партнер GAC Toyota",
      phone: "+38 (073) 29 99 777",
      telegram: "@kunze_auto",
      qrImage: "src/images/kunze-qr.png",
    },

    video: { src: "src/videos/bz3x-trailer.mp4", poster: "", title: "Офіційний трейлер GAC Toyota BZ3X" },
  }
];
