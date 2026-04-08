import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';
import type { Trip } from '@alpha-trekkers/shared';

type FortGroupKey = 'pune' | 'mumbai' | 'nashik' | 'satara' | 'konkan';

interface FortEntry {
  name: string;
  slug: string;
  region: string;
  group: FortGroupKey;
  placeType?: 'fort' | 'waterfall' | 'route';
  difficulty: Trip['difficulty'];
  durationHours: number;
  elevationM: number;
  maxAltitudeM: number;
  price: number;
  image: string;
  shortDescription: string;
}

interface FortSection {
  title: string;
  forts: FortEntry[];
}

export const WEEKDAY_LOCATION_GROUPS: FortSection[] = [
  {
    title: 'Nashik / Igatpuri Region (Challenging)',
    forts: [
      { name: 'Alang', slug: 'alang-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'DIFFICULT', durationHours: 14, elevationM: 1150, maxAltitudeM: 1485, price: 1799, image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[0], shortDescription: 'A serious Sahyadri climb with exposed sections and a huge high-range feel.' },
      { name: 'Madan', slug: 'madan-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'DIFFICULT', durationHours: 13, elevationM: 1080, maxAltitudeM: 1471, price: 1799, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[2], shortDescription: 'Technical rock-cut sections and a dramatic summit profile make this a strong challenge pick.' },
      { name: 'Kulang', slug: 'kulang-fort-trek', region: 'Igatpuri', group: 'nashik', difficulty: 'DIFFICULT', durationHours: 13, elevationM: 1100, maxAltitudeM: 1448, price: 1699, image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[1], shortDescription: 'A long endurance fort climb known for its massive plateau and remote feel.' },
      { name: 'Ratangad', slug: 'ratangad-fort-trek', region: 'Ahmednagar', group: 'nashik', difficulty: 'MODERATE', durationHours: 10, elevationM: 760, maxAltitudeM: 1297, price: 1299, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[3], shortDescription: 'A classic fort route with caves, ridge drama, and a storied Sahyadri skyline.' },
      { name: 'Salher', slug: 'salher-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'DIFFICULT', durationHours: 12, elevationM: 980, maxAltitudeM: 1567, price: 1499, image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[3], shortDescription: 'A big-mountain fort climb with one of the strongest summit rewards in north Maharashtra.' },
      { name: 'Mulher', slug: 'mulher-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 9, elevationM: 720, maxAltitudeM: 1306, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutKalsubai, shortDescription: 'Historic Baglan fort route with broad top sections and strong old-kingdom character.' },
      { name: 'Hargad', slug: 'hargad-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 8, elevationM: 620, maxAltitudeM: 1098, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'A quieter ridge fort that pairs sharp climbs with clean Baglan views.' },
      { name: 'Ahivantgad', slug: 'ahivantgad-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 9, elevationM: 700, maxAltitudeM: 1311, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[3], shortDescription: 'Large plateau-style fort terrain with a long history and wide-ranging summit lines.' },
      { name: 'Achala', slug: 'achala-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 8, elevationM: 610, maxAltitudeM: 1372, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'A less-crowded hill fort route suited for trekkers who want cleaner mountain solitude.' },
      { name: 'Harihar', slug: 'harihar-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 8, elevationM: 500, maxAltitudeM: 1120, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[0], shortDescription: 'Compact thrill trek with the iconic vertical staircase.' },
    ],
  },
  {
    title: 'Konkan & Deep Sahyadri',
    forts: [
      { name: 'Sindhudurg', slug: 'sindhudurg-fort', region: 'Sindhudurg', group: 'konkan', difficulty: 'EASY', durationHours: 6, elevationM: 40, maxAltitudeM: 20, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.heroes.about, shortDescription: 'Sea fort exploration focused on coastal history, ramparts, and Konkan atmosphere.' },
      { name: 'Vijaydurg', slug: 'vijaydurg-fort', region: 'Sindhudurg', group: 'konkan', difficulty: 'EASY', durationHours: 6, elevationM: 55, maxAltitudeM: 28, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.heroes.trips, shortDescription: 'A major Konkan sea fort known for its scale, sea walls, and maritime legacy.' },
      { name: 'Devgad', slug: 'devgad-fort', region: 'Sindhudurg', group: 'konkan', difficulty: 'EASY', durationHours: 5, elevationM: 70, maxAltitudeM: 40, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'A lighter coastal heritage stop with sea breeze, bastions, and quick exploration.' },
      { name: 'Mahipatgad', slug: 'mahipatgad-fort', region: 'Ratnagiri', group: 'konkan', difficulty: 'MODERATE', durationHours: 9, elevationM: 760, maxAltitudeM: 840, price: 1299, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad, shortDescription: 'Forest-heavy fort access leading to one of the broader plateaus in this region.' },
      { name: 'Sumargad', slug: 'sumargad-fort', region: 'Ratnagiri', group: 'konkan', difficulty: 'DIFFICULT', durationHours: 10, elevationM: 820, maxAltitudeM: 904, price: 1399, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna, shortDescription: 'A rugged deep-Sahyadri route with steeper sections and a stronger remote-mountain feel.' },
      { name: 'Rasalgad', slug: 'rasalgad-fort', region: 'Ratnagiri', group: 'konkan', difficulty: 'MODERATE', durationHours: 7, elevationM: 420, maxAltitudeM: 462, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'Compact Konkan-side fort exploration with bastions, cannon points, and easy access.' },
      { name: 'Vasota (Vyaghragad)', slug: 'vasota-vyaghragad-trek', region: 'Satara', group: 'konkan', difficulty: 'DIFFICULT', durationHours: 10, elevationM: 720, maxAltitudeM: 1171, price: 1499, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'A dense forest-and-fort combination inside the Koyna backwaters zone with a wild feel.' },
    ],
  },
  {
    title: 'Deep Sahyadri / Jungle Treks',
    forts: [
      { name: 'Naneghat Waterfalls', slug: 'naneghat-waterfalls', region: 'Junnar', group: 'pune', placeType: 'waterfall', difficulty: 'EASY', durationHours: 7, elevationM: 260, maxAltitudeM: 750, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'A monsoon-friendly ghat walk with cloud walls, flowing rock faces, and classic pass scenery.' },
      { name: 'Malshej Ghat Waterfalls', slug: 'malshej-ghat-hidden-waterfalls', region: 'Malshej', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 8, elevationM: 320, maxAltitudeM: 820, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.heroes.contact, shortDescription: 'Scenic roadside and hidden monsoon cascades spread across the Malshej escarpment.' },
      { name: 'Aadrai Jungle Deep Waterfalls', slug: 'aadrai-jungle-deep-waterfalls', region: 'Malshej', group: 'pune', placeType: 'waterfall', difficulty: 'DIFFICULT', durationHours: 10, elevationM: 540, maxAltitudeM: 870, price: 1399, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.andharban[1], shortDescription: 'A longer jungle trek through mist, streams, and deep valley waterfalls in the Aadrai zone.' },
      { name: 'Kalu Waterfall', slug: 'kalu-waterfall-trek', region: 'Malshej', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 9, elevationM: 460, maxAltitudeM: 740, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.thoseghar[0], shortDescription: 'One of Maharashtra’s highest waterfalls, approached through a lush monsoon valley route.' },
      { name: 'Reverse Waterfall', slug: 'naneghat-reverse-waterfall', region: 'Junnar', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 7, elevationM: 280, maxAltitudeM: 760, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'A wind-driven monsoon spectacle where the Naneghat cliff flow appears to reverse into the sky.' },
      { name: 'Nanemachi Waterfall', slug: 'nanemachi-waterfall-trek', region: 'Raigad', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 8, elevationM: 360, maxAltitudeM: 640, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[2], shortDescription: 'A deep forest waterfall route best known for its layered cascades and secluded monsoon mood.' },
      { name: 'Kataldhar Deep Route', slug: 'kataldhar-deep-route', region: 'Lonavala', group: 'pune', placeType: 'route', difficulty: 'DIFFICULT', durationHours: 10, elevationM: 620, maxAltitudeM: 700, price: 1399, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.andharban[2], shortDescription: 'An advanced trail into one of the region’s deeper waterfall basins, best suited to strong hikers.' },
      { name: 'Plus Valley Extreme Routes', slug: 'plus-valley-extreme-routes', region: 'Tamhini', group: 'pune', placeType: 'route', difficulty: 'EXTREME', durationHours: 11, elevationM: 760, maxAltitudeM: 900, price: 1499, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'A demanding valley descent and climb-out route known for exposure, stream beds, and raw terrain.' },
      { name: 'Madhe Ghat Waterfall', slug: 'madhe-ghat-waterfall-trek', region: 'Velhe', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 8, elevationM: 430, maxAltitudeM: 850, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.heroes.register, shortDescription: 'A scenic long monsoon approach into one of the most photogenic waterfall walls near Pune.' },
      { name: 'Bhairavgad Waterfall Trails', slug: 'bhairavgad-waterfall-trails', region: 'Malshej', group: 'pune', placeType: 'route', difficulty: 'DIFFICULT', durationHours: 9, elevationM: 580, maxAltitudeM: 1020, price: 1299, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutHarishchandragad, shortDescription: 'Rugged trails with seasonal waterfalls, steep sections, and stronger cliff-edge mountain character.' },
      { name: 'Harishchandragad Waterfalls', slug: 'harishchandragad-kedareshwar-waterfalls', region: 'Ahmednagar', group: 'pune', placeType: 'waterfall', difficulty: 'DIFFICULT', durationHours: 11, elevationM: 820, maxAltitudeM: 1424, price: 1499, image: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[2], shortDescription: 'A deeper Harishchandragad-side route focused on monsoon flows, caves, and the Kedareshwar zone.' },
    ],
  },
];

export const WEEKEND_FORT_GROUPS: Array<
  FortSection & {
    sections?: FortSection[];
  }
> = [
  {
    title: 'Pune',
    forts: [
      { name: 'Lohagad', slug: 'lohagad-fort-trek', region: 'Pune', group: 'pune', difficulty: 'EASY', durationHours: 5, elevationM: 450, maxAltitudeM: 1033, price: 699, image: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[0], shortDescription: 'Beginner-friendly monsoon fort with stone steps and Vinchukata ridge.' },
      { name: 'Visapur', slug: 'visapur-fort', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 6, elevationM: 520, maxAltitudeM: 1084, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.heroes.trips, shortDescription: 'Broad fort plateau near Lonavala with walls, ruins, and monsoon cloud cover.' },
      { name: 'Tikona', slug: 'tikona-fort', region: 'Pune', group: 'pune', difficulty: 'EASY', durationHours: 4, elevationM: 300, maxAltitudeM: 1066, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.heroes.home, shortDescription: 'Compact pyramid-shaped fort overlooking Pawna backwaters.' },
      { name: 'Tung', slug: 'tung-fort', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 4, elevationM: 320, maxAltitudeM: 1075, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'Narrow summit fort with strong lake and valley visuals around Pawna.' },
      { name: 'Korigad', slug: 'korigad-fort', region: 'Pune', group: 'pune', difficulty: 'EASY', durationHours: 5, elevationM: 350, maxAltitudeM: 923, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[2], shortDescription: 'Easy plateau fort with intact walls and broad viewpoints near Lonavala.' },
      { name: 'Rajmachi', slug: 'rajmachi-fort-night-trek', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 12, elevationM: 650, maxAltitudeM: 920, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[0], shortDescription: 'Twin-fort classic with sunrise and night-trek appeal.' },
      { name: 'Sinhagad', slug: 'sinhagad-fort', region: 'Pune', group: 'pune', difficulty: 'EASY', durationHours: 4, elevationM: 320, maxAltitudeM: 1312, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad, shortDescription: 'Historic Pune fort known for quick access, wind, and evening views.' },
      { name: 'Rajgad', slug: 'rajgad-fort-trek', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 10, elevationM: 850, maxAltitudeM: 1395, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[0], shortDescription: 'Large fort circuit and former Maratha capital with multiple machis.' },
      { name: 'Torna', slug: 'torna-fort-trek', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 9, elevationM: 900, maxAltitudeM: 1403, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.torna[0], shortDescription: 'The first fort captured by Shivaji Maharaj and one of Pune’s strongest ridge walks.' },
      { name: 'Purandar', slug: 'purandar-fort', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 6, elevationM: 500, maxAltitudeM: 1387, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna, shortDescription: 'Historic twin-level fort with a strong military legacy and open skyline.' },
      { name: 'Raireshwar', slug: 'raireshwar-plateau', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 7, elevationM: 420, maxAltitudeM: 1372, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad, shortDescription: 'Temple plateau route tied closely to Maratha history and monsoon meadows.' },
      { name: 'Malhargad', slug: 'malhargad-fort', region: 'Pune', group: 'pune', difficulty: 'EASY', durationHours: 4, elevationM: 220, maxAltitudeM: 976, price: 699, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'Short heritage climb and one of the last forts built in the Maratha period.' },
      { name: 'Kailasgad', slug: 'kailasgad-fort', region: 'Pune', group: 'pune', difficulty: 'MODERATE', durationHours: 5, elevationM: 340, maxAltitudeM: 944, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'Quiet monsoon fort route with reservoir-facing viewpoints.' },
      { name: 'Shivneri', slug: 'shivneri-fort', region: 'Junnar', group: 'pune', difficulty: 'EASY', durationHours: 4, elevationM: 300, maxAltitudeM: 1050, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'Birthplace fort of Shivaji Maharaj with broad steps and strong historical value.' },
    ],
  },
  {
    title: 'Mumbai',
    forts: [
      { name: 'Karnala', slug: 'karnala-fort', region: 'Raigad', group: 'mumbai', difficulty: 'MODERATE', durationHours: 5, elevationM: 430, maxAltitudeM: 475, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[3], shortDescription: 'Bird sanctuary fort with a dramatic pinnacle and forest trail.' },
      { name: 'Kalavantin Durg', slug: 'kalavantin-durg', region: 'Raigad', group: 'mumbai', difficulty: 'DIFFICULT', durationHours: 7, elevationM: 650, maxAltitudeM: 686, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[2], shortDescription: 'Famous exposed staircase climb near Panvel with big rock drama.' },
      { name: 'Prabalgad', slug: 'prabalgad-fort', region: 'Raigad', group: 'mumbai', difficulty: 'MODERATE', durationHours: 7, elevationM: 640, maxAltitudeM: 700, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.heroes.about, shortDescription: 'Longer fort day near Matheran with forest approach and plateau views.' },
      { name: 'Irshalgad', slug: 'irshalgad-fort', region: 'Raigad', group: 'mumbai', difficulty: 'DIFFICULT', durationHours: 6, elevationM: 500, maxAltitudeM: 370, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[1], shortDescription: 'Rocky monsoon route known for its needle-like pinnacle profile.' },
      { name: 'Manikgad', slug: 'manikgad-fort', region: 'Raigad', group: 'mumbai', difficulty: 'MODERATE', durationHours: 6, elevationM: 480, maxAltitudeM: 572, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'A lesser-crowded fort near Panvel with monsoon greenery and old ruins.' },
      { name: 'Chanderi', slug: 'chanderi-fort', region: 'Raigad', group: 'mumbai', difficulty: 'DIFFICULT', durationHours: 7, elevationM: 650, maxAltitudeM: 790, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'Steep forest climb with cave stop and rugged Sahyadri feel.' },
      { name: 'Matheran (Garbet Plateau)', slug: 'garbet-plateau', region: 'Matheran', group: 'mumbai', difficulty: 'MODERATE', durationHours: 6, elevationM: 420, maxAltitudeM: 650, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'Cloud-heavy plateau route with one of the best monsoon landscapes near Mumbai.' },
      { name: 'Sondai', slug: 'sondai-fort', region: 'Karjat', group: 'mumbai', difficulty: 'EASY', durationHours: 4, elevationM: 320, maxAltitudeM: 365, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[1], shortDescription: 'Short Karjat fort route with quick reward views and ladders near the top.' },
      { name: 'Songiri', slug: 'songiri-fort', region: 'Raigad', group: 'mumbai', difficulty: 'EASY', durationHours: 4, elevationM: 220, maxAltitudeM: 429, price: 699, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'Compact heritage climb suited for a lighter weekend outing.' },
      { name: 'Sagargad', slug: 'sagargad-fort', region: 'Alibaug', group: 'mumbai', difficulty: 'MODERATE', durationHours: 5, elevationM: 360, maxAltitudeM: 347, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[2], shortDescription: 'Alibaug-side fort with waterfall pockets and Konkan-facing views.' },
    ],
  },
  {
    title: 'Nashik / Igatpuri (Quick Trips)',
    forts: [
      { name: 'Kalsubai', slug: 'kalsubai-peak-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 8, elevationM: 1200, maxAltitudeM: 1646, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[0], shortDescription: 'Highest peak in Maharashtra with summit ladders and huge sunrise views.' },
      { name: 'Harihar', slug: 'harihar-fort-trek', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 8, elevationM: 500, maxAltitudeM: 1120, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[0], shortDescription: 'Compact thrill trek with the iconic vertical staircase.' },
      { name: 'Trimbakgad', slug: 'trimbakgad-fort', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 5, elevationM: 360, maxAltitudeM: 1041, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[3], shortDescription: 'Quick fort climb near Trimbakeshwar with temple-town surroundings.' },
      { name: 'Anjaneri', slug: 'anjaneri-fort', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 6, elevationM: 420, maxAltitudeM: 1280, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutKalsubai, shortDescription: 'Plateau-and-peak route associated with mythology and wide hill views.' },
      { name: 'Brahmagiri', slug: 'brahmagiri-fort', region: 'Nashik', group: 'nashik', difficulty: 'MODERATE', durationHours: 5, elevationM: 380, maxAltitudeM: 1298, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[1], shortDescription: 'Temple-linked hill circuit with broad Trimbak valley visuals.' },
      { name: 'Kavnai', slug: 'kavnai-fort', region: 'Igatpuri', group: 'nashik', difficulty: 'EASY', durationHours: 4, elevationM: 280, maxAltitudeM: 646, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[1], shortDescription: 'Fast fort near Igatpuri with lake views and light climbing effort.' },
    ],
  },
  {
    title: 'Satara Side (Short Trips)',
    forts: [
      { name: 'Thoseghar', slug: 'thoseghar-waterfalls-trail', region: 'Satara', group: 'satara', difficulty: 'EASY', durationHours: 7, elevationM: 120, maxAltitudeM: 950, price: 749, image: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[0], shortDescription: 'Relaxed scenic monsoon outing focused on waterfall viewpoints and short walks.' },
      { name: 'Pratapgad', slug: 'pratapgad-fort', region: 'Satara', group: 'satara', difficulty: 'EASY', durationHours: 4, elevationM: 260, maxAltitudeM: 1080, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.heroes.about, shortDescription: 'Classic hill fort near Mahabaleshwar with easy heritage access.' },
      { name: 'Sajjangad', slug: 'sajjangad-fort', region: 'Satara', group: 'satara', difficulty: 'EASY', durationHours: 3, elevationM: 180, maxAltitudeM: 1003, price: 699, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad, shortDescription: 'Temple-fort visit known more for history and calm than trekking strain.' },
      { name: 'Ajinkyatara', slug: 'ajinkyatara-fort', region: 'Satara', group: 'satara', difficulty: 'EASY', durationHours: 3, elevationM: 190, maxAltitudeM: 1006, price: 699, image: MAHARASHTRA_MONSOON_IMAGES.sections.fortCircuits, shortDescription: 'A city-edge Satara fort best for quick heritage visits and viewpoints.' },
      { name: 'Kamalgad', slug: 'kamalgad-fort', region: 'Satara', group: 'satara', difficulty: 'MODERATE', durationHours: 6, elevationM: 520, maxAltitudeM: 1375, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutTorna, shortDescription: 'Higher fort route near Wai with strong escarpment views.' },
      { name: 'Vairatgad', slug: 'vairatgad-fort', region: 'Satara', group: 'satara', difficulty: 'EASY', durationHours: 4, elevationM: 250, maxAltitudeM: 1177, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutRajgad, shortDescription: 'Short scenic fort route suited for a quick Satara-side plan.' },
      { name: 'Pandavgad', slug: 'pandavgad-fort', region: 'Satara', group: 'satara', difficulty: 'MODERATE', durationHours: 5, elevationM: 420, maxAltitudeM: 1270, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'A quieter fort route above Wai with plateau edges and green valleys.' },
    ],
  },
  {
    title: 'Konkan (Short Visits)',
    forts: [
      { name: 'Raigad', slug: 'raigad-fort', region: 'Raigad', group: 'konkan', difficulty: 'MODERATE', durationHours: 6, elevationM: 600, maxAltitudeM: 820, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.heroes.about, shortDescription: 'Capital fort of the Maratha Empire and one of the strongest heritage destinations in Maharashtra.' },
    ],
  },
  {
    title: 'Waterfalls',
    forts: [
      { name: 'Devkund Waterfall', slug: 'devkund-waterfall-trek', region: 'Raigad', group: 'konkan', placeType: 'waterfall', difficulty: 'EASY', durationHours: 8, elevationM: 220, maxAltitudeM: 820, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[0], shortDescription: 'Classic forest waterfall route with stream crossings and a plunge pool finish.' },
      { name: 'Andharban', slug: 'andharban-jungle-trek', region: 'Pune', group: 'pune', placeType: 'route', difficulty: 'MODERATE', durationHours: 9, elevationM: 180, maxAltitudeM: 690, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[0], shortDescription: 'Dense jungle traverse with valley views and monsoon waterfall pockets.' },
      { name: 'Bhaje Waterfall', slug: 'bhaje-waterfall-trail', region: 'Lonavala', group: 'pune', placeType: 'waterfall', difficulty: 'EASY', durationHours: 5, elevationM: 180, maxAltitudeM: 620, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.heroes.contact, shortDescription: 'Short monsoon route near the Bhaje caves with flowing rock walls and easy access.' },
      { name: 'Kataldhar Waterfall', slug: 'kataldhar-waterfall-trail', region: 'Lonavala', group: 'pune', placeType: 'waterfall', difficulty: 'DIFFICULT', durationHours: 9, elevationM: 540, maxAltitudeM: 710, price: 1299, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.andharban[2], shortDescription: 'A deep-cut valley waterfall route that becomes dramatic in peak monsoon.' },
      { name: 'Aadrai Jungle Waterfalls', slug: 'aadrai-jungle-waterfalls', region: 'Malshej', group: 'pune', placeType: 'waterfall', difficulty: 'DIFFICULT', durationHours: 10, elevationM: 540, maxAltitudeM: 870, price: 1399, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.andharban[1], shortDescription: 'Long jungle access through mist, streams, and multiple deep-Sahyadri cascades.' },
      { name: 'Plus Valley Waterfalls', slug: 'plus-valley-waterfalls', region: 'Tamhini', group: 'pune', placeType: 'route', difficulty: 'EXTREME', durationHours: 11, elevationM: 760, maxAltitudeM: 900, price: 1499, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'Demanding valley terrain with streambeds, cliff sections, and powerful seasonal flows.' },
      { name: 'Secret Waterfall', slug: 'secret-waterfall-lonavala', region: 'Lonavala', group: 'pune', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 6, elevationM: 250, maxAltitudeM: 690, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.heroes.register, shortDescription: 'A lesser-known Lonavala-side cascade route suited to cleaner monsoon escapes.' },
      { name: 'Mulshi Backwater Waterfalls', slug: 'mulshi-backwater-waterfalls', region: 'Mulshi', group: 'pune', placeType: 'waterfall', difficulty: 'EASY', durationHours: 6, elevationM: 220, maxAltitudeM: 640, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'Scenic monsoon drives and short approaches around the Mulshi reservoir waterfalls.' },
      { name: 'Pandavkada Falls', slug: 'pandavkada-falls', region: 'Navi Mumbai', group: 'mumbai', placeType: 'waterfall', difficulty: 'EASY', durationHours: 5, elevationM: 180, maxAltitudeM: 370, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.thoseghar[1], shortDescription: 'One of the most recognized monsoon falls near Mumbai, best for a shorter scenic outing.' },
      { name: 'Kondana Waterfall', slug: 'kondana-waterfall-trail', region: 'Karjat', group: 'mumbai', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 6, elevationM: 260, maxAltitudeM: 540, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[2], shortDescription: 'Forest approach route combining cave-side history with strong rainy-season flow.' },
    ],
  },
  {
    title: 'More Waterfalls',
    forts: [
      { name: 'Lingmala Waterfall', slug: 'lingmala-waterfall-trail', region: 'Mahabaleshwar', group: 'satara', placeType: 'waterfall', difficulty: 'EASY', durationHours: 5, elevationM: 200, maxAltitudeM: 1280, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.thoseghar[0], shortDescription: 'A polished Mahabaleshwar waterfall stop with a strong monsoon visual payoff.' },
      { name: 'Thoseghar Waterfalls', slug: 'thoseghar-waterfalls-trail', region: 'Satara', group: 'satara', placeType: 'waterfall', difficulty: 'EASY', durationHours: 7, elevationM: 120, maxAltitudeM: 950, price: 749, image: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[0], shortDescription: 'Relaxed scenic monsoon outing focused on waterfall viewpoints and short walks.' },
      { name: 'Vajrai Waterfall', slug: 'vajrai-waterfall-trail', region: 'Satara', group: 'satara', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 7, elevationM: 320, maxAltitudeM: 1140, price: 999, image: MAHARASHTRA_MONSOON_IMAGES.waterfalls.thoseghar[2], shortDescription: 'Tiered mountain waterfall route near Satara with huge rain-fed volume in season.' },
      { name: 'Kaas Plateau Seasonal Waterfalls', slug: 'kaas-plateau-seasonal-waterfalls', region: 'Satara', group: 'satara', placeType: 'waterfall', difficulty: 'EASY', durationHours: 6, elevationM: 260, maxAltitudeM: 1210, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.aboutThoseghar, shortDescription: 'Seasonal cascades and plateau-edge drops paired with the Kaas monsoon landscape.' },
      { name: 'Kalavantin-Prabalgad Waterfalls', slug: 'kalavantin-prabalgad-waterfalls', region: 'Panvel', group: 'mumbai', placeType: 'route', difficulty: 'DIFFICULT', durationHours: 8, elevationM: 560, maxAltitudeM: 690, price: 1199, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[2], shortDescription: 'Steeper monsoon lines and waterfall pockets around the Kalavantin-Prabalgad massif.' },
      { name: 'Irshalgad Waterfall Routes', slug: 'irshalgad-waterfall-routes', region: 'Karjat', group: 'mumbai', placeType: 'route', difficulty: 'DIFFICULT', durationHours: 8, elevationM: 520, maxAltitudeM: 370, price: 1099, image: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[1], shortDescription: 'Rugged monsoon approach trails with waterfall views around the Irshalgad massif.' },
      { name: 'Matheran Waterfalls', slug: 'matheran-waterfalls', region: 'Matheran', group: 'mumbai', placeType: 'waterfall', difficulty: 'EASY', durationHours: 6, elevationM: 240, maxAltitudeM: 800, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.sections.chooseUsRange, shortDescription: 'Cloud-heavy waterfall pockets and forest edges around the Matheran plateau.' },
      { name: 'Chinchoti Waterfalls', slug: 'chinchoti-waterfalls', region: 'Vasai', group: 'mumbai', placeType: 'waterfall', difficulty: 'MODERATE', durationHours: 6, elevationM: 220, maxAltitudeM: 310, price: 899, image: MAHARASHTRA_MONSOON_IMAGES.heroes.contact, shortDescription: 'Popular monsoon stream-and-waterfall route close to Mumbai with a greener, softer profile.' },
      { name: 'Yeoor Hills Waterfalls', slug: 'yeoor-hills-waterfalls', region: 'Thane', group: 'mumbai', placeType: 'waterfall', difficulty: 'EASY', durationHours: 5, elevationM: 180, maxAltitudeM: 320, price: 799, image: MAHARASHTRA_MONSOON_IMAGES.sections.monsoonTrails, shortDescription: 'Shorter Thane-side waterfall escapes inside the Yeoor forest belt.' },
    ],
  },
];

const STATIC_FORT_DIRECTORY = [
  ...WEEKDAY_LOCATION_GROUPS.flatMap((group) =>
    group.forts.map((fort) => ({ ...fort, category: 'WEEKDAY' as const })),
  ),
  ...WEEKEND_FORT_GROUPS.flatMap((group) =>
    [
      ...group.forts,
      ...(group.sections?.flatMap((section) => section.forts) ?? []),
    ].map((fort) => ({ ...fort, category: 'WEEKEND' as const })),
  ),
];

const STATIC_FORTS_BY_SLUG = new Map(
  STATIC_FORT_DIRECTORY.map((fort) => [fort.slug, fort]),
);

export function getStaticFortTrip(slug: string): Trip | null {
  const fort = STATIC_FORTS_BY_SLUG.get(slug);
  if (!fort) return null;

  const isFort = (fort.placeType ?? 'fort') === 'fort';
  const mapQuery = encodeURIComponent(`${fort.name} Maharashtra`);
  const title = isFort
    ? fort.name.includes('Plateau')
      ? fort.name
      : `${fort.name} Fort Trek`
    : fort.name;
  const routeWindow = fort.category === 'WEEKDAY' ? 'weekday' : 'weekend';
  const routeLabel = isFort
    ? fort.category === 'WEEKDAY'
      ? 'weekday trek collection'
      : 'weekend fort collection'
    : `${routeWindow} waterfall and jungle route collection`;
  const terrainLabel = isFort
    ? 'hill-fort architecture, stone steps or forest trail sections, and panoramic Sahyadri or Konkan scenery'
    : 'waterfall approaches, jungle trail sections, stream crossings, and dramatic monsoon valley scenery';
  const description = `${fort.name} is part of our curated ${routeLabel} for Maharashtra. This location is grouped under ${fort.region} and is shown in the ${routeWindow} trips dropdown so users can open a dedicated detail page even when the destination is not yet coming from the admin trip database.

The route is best approached as a one-day outdoor outing. Expect a mix of ${terrainLabel} depending on the exact location. During monsoon and post-monsoon months, these routes become greener, cooler, and far more visual.

This page is a static location entry for navigation and discovery. It gives users a clean place to land from the ${routeWindow} trips menu while the full commercial trip data for the location can be added later.`;

  return {
    id: `static-${fort.slug}`,
    title,
    slug: fort.slug,
    description,
    shortDescription: fort.shortDescription,
    difficulty: fort.difficulty,
    category: fort.category,
    durationHours: fort.durationHours,
    distanceKm: Math.max(4, Math.round(fort.durationHours * 1.5)),
    elevationM: fort.elevationM,
    maxAltitudeM: fort.maxAltitudeM,
    region: fort.region,
    fortName: isFort ? fort.name : undefined,
    startLocation: `${fort.name}, ${fort.region}`,
    endLocation: `${fort.name}, ${fort.region}`,
    meetingPoint: `${fort.region} base pickup`,
    meetingTime: '06:00 AM',
    basePrice: fort.price,
    discountPrice: undefined,
    maxGroupSize: 30,
    minAge: 10,
    isActive: true,
    isFeatured: false,
    avgRating: 4.8,
    totalReviews: 0,
    totalBookings: 0,
    latitude: undefined,
    longitude: undefined,
    highlights: [
      isFort
        ? `Explore ${fort.name} as part of the curated ${routeWindow} fort list`
        : `Explore ${fort.name} as part of the curated ${routeWindow} waterfall and jungle list`,
      isFort
        ? fort.category === 'WEEKDAY'
          ? 'Strong weekday route for same-day mountain or heritage seekers'
          : 'Strong weekend route for fort history and viewpoint seekers'
        : 'Strong monsoon route for waterfall, jungle, and valley seekers',
      'Monsoon and post-monsoon scenery around the hill section',
      isFort ? 'Works as a same-day fort outing with heritage focus' : 'Works as a same-day nature outing with monsoon focus',
      `Region access centered around ${fort.region}`,
      'Suitable for menu-driven discovery before full package data is added',
    ],
    inclusions: [
      'Fort guide support when available',
      'Trip coordination and route information',
      'Basic first aid readiness',
      'Group assistance for navigation and pacing',
    ],
    exclusions: [
      'Personal transport unless specified in package',
      'Personal meals and snacks',
      'Travel insurance',
      'Anything not mentioned in inclusions',
    ],
    thingsToCarry: [
      'Minimum 2 litres of water',
      'Good grip trekking shoes',
      'Rainwear during monsoon',
      'Cap or sun protection',
      'ID proof',
      'Small backpack',
      'Energy snacks',
      'Personal medication if any',
    ],
    itinerary: [
      { time: '06:00 AM', title: 'Assembly', description: `Meet near the ${fort.region} access point and review the route for ${fort.name}.` },
      { time: '07:00 AM', title: 'Approach to base', description: `Reach the trailhead or fort base village and begin the route toward ${fort.name}.` },
      { time: '09:00 AM', title: 'Climb and exploration', description: `Ascend the main fort trail, visit the key gates, plateau, or viewpoint sections, and spend time exploring.` },
      { time: '12:00 PM', title: 'Break and photography', description: 'Pause for refreshments, photos, and time at the main scenic or heritage highlights.' },
      { time: '01:00 PM', title: 'Return', description: 'Begin descent and return to the base point in a steady group format.' },
    ],
    routeMapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    images: [
      {
        id: `static-image-${fort.slug}`,
        url: fort.image,
        altText: title,
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    schedules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
