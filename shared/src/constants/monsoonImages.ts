const commonsFile = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;

export const MAHARASHTRA_MONSOON_IMAGES = {
  heroes: {
    home: commonsFile('Fort Tikona in Rainy Season.jpg'),
    trips: commonsFile('Visapur fort in monsoon.jpg'),
    about: commonsFile('Pratapgad fort during the rainy season.jpg'),
    contact: commonsFile('Sahyadri Waterfall.jpg'),
    booking: commonsFile('RajmachiView from Trek Point.JPG'),
    login: commonsFile('Lohagad hills.jpg'),
    register: commonsFile('Waterfall in Shivthar Ghalai, Sahyadri Mountains.jpg'),
    myBookings: commonsFile('View from Kalsubai peak.jpg'),
    tripDetail: commonsFile('Trail from Pachnai to Harishchandragad (32606500883).jpg'),
  },
  fallback: {
    tripCard: commonsFile('Pratapgad fort during the rainy season.jpg'),
    tripDetail: commonsFile('Trail towards Kokankada (32577897544).jpg'),
  },
  sections: {
    chooseUsRange: commonsFile('Sahyadri Range at Bhimashankar, Maharashtra, India.jpg'),
    weekendTrips: commonsFile('Rajgad Fort 01.jpg'),
    fortCircuits: commonsFile('A view of fort torna in monsoon.jpg'),
    monsoonTrails: commonsFile('Sahyadri Waterfall.jpg'),
    aboutRajgad: commonsFile('Rajgad after monsoon.jpg'),
    aboutHarishchandragad: commonsFile('Trail from Pachnai to Harishchandragad (33264929342).jpg'),
    aboutTorna: commonsFile('View While Climbing Torna Fort.jpg'),
    aboutKalsubai: commonsFile('View from Kalsubai peak.jpg'),
    aboutRajmachi: commonsFile('Hikers climbing one of the forts at Rajmachi.jpg'),
    aboutHarihar: commonsFile('Harihar Fort Steep Stairs.jpg'),
    aboutDevkund: commonsFile('Maharashtra, Devkund.jpg'),
    aboutAndharban: commonsFile('AndharBan View.jpg'),
    aboutThoseghar: commonsFile('Thoseghar Falls.jpg'),
  },
  trips: {
    rajgad: [
      commonsFile('Rajgad Fort 01.jpg'),
      commonsFile('Rajgad Fort 02.jpg'),
      commonsFile('Rajgad after monsoon.jpg'),
      commonsFile('Rajgad Fort 07.jpg'),
    ],
    torna: [
      commonsFile('A view of fort torna in monsoon.jpg'),
      commonsFile('View While Climbing Torna Fort.jpg'),
      commonsFile('Torna fort(Buruj) 01.jpg'),
      commonsFile('Torna fort Natural view at Rainy season.jpg'),
    ],
    harishchandragad: [
      commonsFile('Trail from Pachnai to Harishchandragad (32606500883).jpg'),
      commonsFile('Trail towards Kokankada (32577897544).jpg'),
      commonsFile('Shivling at Harishchandragad.jpg'),
      commonsFile('Surroundings of Harishchandragad.jpg'),
    ],
    kalsubai: [
      commonsFile('View from Kalsubai peak.jpg'),
      commonsFile('Mt. Kalsubai.jpg'),
      commonsFile('Kalasubai steps.jpg'),
      commonsFile('Kalsubai devotees.jpg'),
    ],
    lohagad: [
      commonsFile('Lohagad hills.jpg'),
      commonsFile('Steps leading to Lohagad fort.jpg'),
      commonsFile('Lohagad Fort, near Pune, Maharashtra.jpg'),
      commonsFile('Visapur fort in monsoon.jpg'),
    ],
    rajmachi: [
      commonsFile('RajmachiView from Trek Point.JPG'),
      commonsFile('Hikers climbing one of the forts at Rajmachi.jpg'),
      commonsFile('Mountain waterfalls.jpg'),
      commonsFile('Rajmachi Fort.JPG'),
    ],
    harihar: [
      commonsFile('Hariharfort.jpg'),
      commonsFile('Harihar - Harihar Fort (11253817395).jpg'),
      commonsFile('Harihar Fort Steep Stairs.jpg'),
      commonsFile('Harihar - View from Harihar (11253931813).jpg'),
    ],
    devkund: [
      commonsFile('Devkund Waterfall.JPG'),
      commonsFile('Devkund waterfalls.jpg'),
      commonsFile('Maharashtra, Devkund.jpg'),
      '/destinations/Devkund Waterfall in lush surroundings.png',
    ],
    andharban: [
      commonsFile('AndharBan.jpg'),
      commonsFile('AndharBan View.jpg'),
      commonsFile('Andharban Jungle Waterfall Pune.jpg'),
      commonsFile('Andharban Jungle Pune Waterfall View.jpg'),
    ],
    thoseghar: [
      commonsFile('Thoseghar Falls.jpg'),
      commonsFile('ThosegharFall1.jpg'),
      commonsFile('Thoseghar Waterfalls - Satara, Pune.jpg'),
      commonsFile('Monsoon Waterfall.jpg'),
    ],
  },
  waterfalls: {
    devkund: [
      commonsFile('Devkund waterfalls.jpg'),
      commonsFile('Maharashtra, Devkund.jpg'),
      commonsFile('Devkund Waterfall.JPG'),
    ],
    thoseghar: [
      commonsFile('Thoseghar Falls.jpg'),
      commonsFile('ThosegharFall1.jpg'),
      commonsFile('Thoseghar Waterfalls - Satara, Pune.jpg'),
    ],
    kumbhe: [
      commonsFile('Kumbhe Waterfall View Point.jpg'),
      commonsFile('Kumbhe Waterfall.jpg'),
    ],
    andharban: [
      commonsFile('Andharban Jungle Waterfall Pune.jpg'),
      commonsFile('Andharban Jungle Pune Waterfall View.jpg'),
      commonsFile('AndharBan View.jpg'),
    ],
  },
  seedHeroImages: [
    commonsFile('Fort Tikona in Rainy Season.jpg'),
    commonsFile('Sahyadri Waterfall.jpg'),
    commonsFile('Waterfall in Shivthar Ghalai, Sahyadri Mountains.jpg'),
  ],
} as const;
