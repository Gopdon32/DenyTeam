// js/data.js

const navData = {
  phone: "+38 (073) 29 99 777",
  telegram: "@kunze_auto",
};

const cars = [
  {
    id: "bozhi-3x",
    brand: "GAC Toyota",
    model: "Bozhi 3X",
    year: 2025,
    heroImage: "src/images/bozhi-3x-hero.jpg",
    heroTagline: "Електромобіль нового покоління",
    descriptionShort:
      "Преміальна динаміка. Великий запас ходу. Офіційна гарантія виробника.",
    ua: {
      label: "Для України",
      symbol: "🇺🇦",
      note: "У разі заводського дефекту — повна компенсація або заміна авто",
    },
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
    warranty: {
      carYears: 5,
      batteryYears: 8,
      hasCompensation: true,
      notes: [
        "Офіційна гарантія GAC Toyota",
        "Гарантія на авто до 5 років",
        "Гарантія на батарею до 8 років",
        "У разі заводського дефекту — повна компенсація або заміна авто",
        "Підтримка українською мовою",
      ],
    },
    trims: [
      {
        id: "610-max",
        name: "Bozhi 3X 610 Max",
        type: "EV",
        colors: ["Білий", "Сірий", "Чорний"],
        rangeKm: 610,
        batteryKwh: 67.92,
        powerHp: 152,
        drive: "Передній",
        priceFrom: 28667,
        priceTo: 28800,
      },
      {
        id: "520-pro",
        name: "Bozhi 3X 520 Pro",
        type: "EV",
        colors: ["Білий"],
        rangeKm: 520,
        batteryKwh: 58.37,
        powerHp: 152,
        drive: "Передній",
        priceFrom: 25920,
        priceTo: 26000,
      },
    ],
    advantages: [
      "Великий запас ходу",
      "Надійність Toyota",
      "Сучасні технології GAC",
      "Економічність",
      "Преміальний салон",
      "Високий рівень безпеки",
    ],
    gallery: [
      {
        type: "exterior",
        src: "src/images/bozhi-3x-exterior.png",
        alt: "Екстер'єр Bozhi 3X",
      },
      {
        type: "interior",
        src: "src/images/bozhi-3x-interior.png",
        alt: "Салон Bozhi 3X",
      },
      {
        type: "trunk",
        src: "src/images/bozhi-3x-trunk.png",
        alt: "Багажник Bozhi 3X",
      },
      {
        type: "engine",
        src: "src/images/bozhi-3x-engine.png",
        alt: "Моторний відсік Bozhi 3X",
      },
      {
        type: "inside1",
        src: "src/images/c1.jpg",
        alt: "Салон Bozhi 3X",
      },
      {
        type: "inside2",
        src: "src/images/c2.jpg",
        alt: "Салон Bozhi 3X",
      },
      {
        type: "inside3",
        src: "src/images/c3.jpg",
        alt: "Салон Bozhi 3X",
      },
    ],
    contacts: {
      partner: "Kunze — офіційний партнер GAC Toyota",
      phone: "+38 (073) 29 99 777",
      telegram: "@kunze_auto",
      qrImage: "src/images/kunze-qr.png",
    },
    video: {
      src: "src/videos/bozhi-3x-trailer.mp4",
      poster: "",
      title: "Офіційний трейлер GAC Toyota Bozhi 3X",
    },
    heroWarranty: {
      title: "GAC Toyota Bozhi 3X — електромобіль нового покоління",
      guarantee: "Офіційна гарантія: 5 років на авто, 8 років на батарею",
      compensation:
        "У разі заводського дефекту — повна компенсація або заміна авто",
      ukraine: "🔰 Підтримка українською | 🇺🇦 Гарантія для України",
    },
  },
];
