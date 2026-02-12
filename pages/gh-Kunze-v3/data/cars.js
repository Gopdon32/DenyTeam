window.CARS = [
  {
    id: 'BZ3x',
    slug: 'bz3x',
    name: 'GAC Toyota BZ3X 2025',
    mainPrice: 'від 38 500 $', // п.1: Актуальна ціна
    shortTagline: 'Електромобіль з інтелектуальним автопілотом Toyota Pilot (Momenta 5.0)',
    heroImage: './src/images/bz3x-hero.jpg',
    listPriceUA: 'від 38 500 $',
    // п.2: Нові адреси салонів
    showrooms: [
      'Київ, вул. Глибочицька 16',
      'Київ, Столичне шосе 104',
    ],
    // п.3: Розширені конфігурації згідно з PDF
    trims: [
      {
        name: '520 Pro',
        price: '38 500 $',
        specs: [
          'Запас ходу: 520 км (CLTC)',
          'Батарея: 58.37 кВт·год',
          'Потужність: 204 к.с.',
          'Smart Cockpit 8155',
          'Камера 360°, панорамний дах'
        ],
      },
      {
        name: '610 Max',
        price: '42 900 $',
        specs: [
          'Запас ходу: 610 км (CLTC)',
          'Потужність: 224 к.с. (165 кВт)',
          'Автопілот: Лідар + NVIDIA Orin-X (254 TOPS)',
          'Акустика: YAMAHA (11 динаміків)',
          'Бездротова зарядка 50W',
          'Вентиляція сидінь та V2L'
        ],
      },
    ],
    gallery: [
      './models/BZ3x/610/正面.jpg',
      './models/BZ3x/610/左前.jpg',
      './models/BZ3x/610/活力橙内饰.jpg',
      './models/BZ3x/610/后备箱1.webp',
    ],
    video: {
      src: './src/videos/bozhi-3x-trailer.mp4',
      poster: './src/images/bz3x-hero.jpg',
    },
    modelPage: './models/BZ3x/610/index.html',
  },
  // RAV4 залишаємо як був, або додаємо аналогічно
];