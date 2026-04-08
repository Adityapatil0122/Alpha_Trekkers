import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MAHARASHTRA_MONSOON_IMAGES } from '@alpha-trekkers/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...\n');

  // Clean existing data in correct order
  await prisma.bookingParticipant.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tripImage.deleteMany();
  await prisma.tripSchedule.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.heroImage.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data.');

  // ========== ADMIN USER ==========
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@alphatrekkers.com',
      password: adminPassword,
      firstName: 'Alpha',
      lastName: 'Admin',
      phone: '9876543210',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // ========== HELPER: Generate upcoming weekend dates ==========
  function getUpcomingWeekends(count: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    let current = new Date(today);
    // Move to next Saturday
    current.setDate(current.getDate() + ((6 - current.getDay() + 7) % 7 || 7));
    current.setHours(6, 0, 0, 0);
    for (let i = 0; i < count; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
    return dates;
  }

  const weekends = getUpcomingWeekends(8);

  function getUpcomingWeekdays(count: number): Date[] {
    const dates: Date[] = [];
    const current = new Date();
    current.setDate(current.getDate() + 1);
    current.setHours(6, 0, 0, 0);

    while (dates.length < count) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  const weekdays = getUpcomingWeekdays(12);
  const mapUrl = (latitude: number, longitude: number) =>
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  // ========== TRIPS ==========

  const tripsData = [
    {
      title: 'Rajgad Fort Trek',
      slug: 'rajgad-fort-trek',
      description: `Rajgad, meaning "The King of Forts", was the capital of the Maratha Empire under Chhatrapati Shivaji Maharaj for over 26 years before it moved to Raigad. Perched at an elevation of 1,395 metres in the Sahyadri mountain range, Rajgad is one of the most formidable and historically significant forts in Maharashtra. The trek offers a perfect blend of history, adventure, and natural beauty.

The trail begins from the village of Gunjavane at the base and weaves through dense forest patches, rocky scrambles, and exposed ridgelines before reaching the massive fortification walls. The fort complex is divided into four distinct mahals (sections): Padmavati Machi, Suvela Machi, Sanjeevani Machi, and Balle Killa (the citadel). Each section tells its own story of the Maratha Empire's glory.

Highlights of the trek include the Padmavati Temple, the double fortification walls with their ingenious bastions, the ancient water cisterns that supplied the entire fort, and the breathtaking panoramic views of the surrounding peaks including Torna, Sinhagad, and Purandar. On a clear day, the view from Balle Killa stretches to the Konkan coastline.

This trek is ideal for intermediate trekkers who want to experience both the physical challenge and the deep historical significance that Maharashtra's forts offer.`,
      shortDescription: 'Trek to the King of Forts, the capital of the Maratha Empire for 26 years, offering stunning Sahyadri views and rich history.',
      difficulty: 'MODERATE' as const,
      category: 'WEEKEND' as const,
      durationHours: 10,
      distanceKm: 14,
      elevationM: 850,
      maxAltitudeM: 1395,
      region: 'Pune',
      fortName: 'Rajgad',
      startLocation: 'Gunjavane Village, Pune',
      endLocation: 'Gunjavane Village, Pune',
      meetingPoint: 'Swargate Bus Stand, Pune',
      meetingTime: '05:30 AM',
      basePrice: 1299,
      discountPrice: 999,
      maxGroupSize: 30,
      minAge: 12,
      isFeatured: true,
      latitude: 18.2428,
      longitude: 73.6818,
      routeMapUrl: mapUrl(18.2428, 73.6818),
      highlights: [
        'Explore the former capital of the Maratha Empire',
        'Visit the ancient Padmavati Temple',
        'Panoramic 360-degree views from Balle Killa',
        'Witness double fortification walls with bastions',
        'See ancient water cisterns and grain storage systems',
        'Views of Torna, Sinhagad, and Purandar forts',
        'Walk through Suvela Machi and Sanjeevani Machi',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and packed lunch',
        'First aid kit and safety equipment',
        'Transport from Swargate to base village and back',
        'Entry charges where applicable',
        'Group photos and trip certificate',
      ],
      exclusions: [
        'Personal expenses and snacks',
        'Travel insurance',
        'Anything not mentioned in inclusions',
        'Camping equipment (for overnight option)',
      ],
      thingsToCarry: [
        'Minimum 2 litres of water',
        'Comfortable trekking shoes with good grip',
        'Sunscreen and sunglasses',
        'Rain poncho (during monsoon)',
        'Light snacks and energy bars',
        'Personal medication if any',
        'ID proof (mandatory)',
        'Small backpack (max 10L)',
        'Cap or hat for sun protection',
        'Torch/headlamp',
      ],
      itinerary: [
        { time: '05:30 AM', title: 'Assembly at Swargate', description: 'Meet at Swargate Bus Stand. Introductions, attendance, and safety briefing.' },
        { time: '06:00 AM', title: 'Depart for Gunjavane', description: 'Travel by private vehicle to Gunjavane village, the base of Rajgad. En route, learn about the fort\'s history.' },
        { time: '07:30 AM', title: 'Arrive at Gunjavane & Breakfast', description: 'Arrive at the base village. Enjoy a traditional Maharashtrian breakfast of poha, tea, and bananas. Warm-up stretches.' },
        { time: '08:00 AM', title: 'Begin Trek via Chor Darwaja', description: 'Start ascending via the Chor Darwaja (Thieves Gate) route. Pass through thick forest cover and rocky patches.' },
        { time: '09:30 AM', title: 'Reach Padmavati Machi', description: 'Arrive at Padmavati Machi. Visit the Padmavati Temple and explore the water cisterns. Short water break.' },
        { time: '10:15 AM', title: 'Ascend to Balle Killa', description: 'Climb to the highest point of the fort, the citadel. Explore the ruins and take in the panoramic views.' },
        { time: '11:00 AM', title: 'Explore Suvela Machi', description: 'Walk across to Suvela Machi, known for its dramatic cliff-side exposure and the Nedhe (needle) viewpoint.' },
        { time: '12:00 PM', title: 'Lunch Break', description: 'Enjoy packed lunch on the fort with sweeping views of the valley. Group photos and rest.' },
        { time: '01:00 PM', title: 'Begin Descent', description: 'Start the return trek via the same route, descending carefully through the rocky sections.' },
        { time: '03:00 PM', title: 'Reach Base & Depart', description: 'Arrive back at Gunjavane. Refreshments and snacks. Board vehicles for return to Pune.' },
        { time: '05:00 PM', title: 'Arrive at Pune', description: 'Reach Swargate Bus Stand. Trek concludes with fond memories and new friendships.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[0], altText: 'Rajgad Fort in the Maharashtra monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[1], altText: 'Rainy ridge sections at Rajgad Fort', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[2], altText: 'Rajgad after the monsoon rains', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajgad[3], altText: 'Cloud-wrapped monsoon view from Rajgad', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 1, 2, 3].map((i) => ({
        date: weekends[i],
        availableSpots: 30,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Torna Fort Trek',
      slug: 'torna-fort-trek',
      description: `Torna Fort, also known as Prachandagad, holds an extraordinary place in Maratha history as the very first fort captured by a young Chhatrapati Shivaji Maharaj at the age of just 16 in 1643. This pivotal conquest marked the genesis of the Maratha Empire. Standing at 1,403 metres, Torna is the highest fort in the Pune district and offers one of the most rewarding trekking experiences in the Sahyadri range.

The approach trail from Velhe village is a scenic route that traverses through terraced farmlands, dense deciduous forests teeming with birdlife, and rugged rock patches that demand careful navigation. The fort itself is massive, with impressive gates, bastions, and the ruins of granaries that once sustained large garrisons. Two ancient temples, dedicated to Mengai Devi and Tornjai, are nestled within the fort walls.

The trek is particularly stunning during the post-monsoon season when the entire region transforms into a verdant paradise with seasonal waterfalls, wildflowers, and dramatic cloud play across the mountain ridges. The view from the top encompasses neighboring forts like Rajgad, Sinhagad, and the distant peaks of Raigad district.

Torna is a moderately challenging trek suitable for those who have completed at least a couple of basic treks. The steep sections near the summit test your endurance but reward you with an unparalleled sense of achievement.`,
      shortDescription: 'The first fort conquered by Shivaji Maharaj at age 16. The highest fort in Pune district at 1,403m with stunning Sahyadri vistas.',
      difficulty: 'MODERATE' as const,
      category: 'WEEKEND' as const,
      durationHours: 9,
      distanceKm: 12,
      elevationM: 900,
      maxAltitudeM: 1403,
      region: 'Pune',
      fortName: 'Torna',
      startLocation: 'Velhe Village, Pune',
      endLocation: 'Velhe Village, Pune',
      meetingPoint: 'Swargate Bus Stand, Pune',
      meetingTime: '05:30 AM',
      basePrice: 1199,
      discountPrice: 899,
      maxGroupSize: 25,
      minAge: 14,
      isFeatured: true,
      latitude: 18.2747,
      longitude: 73.6233,
      routeMapUrl: mapUrl(18.2747, 73.6233),
      highlights: [
        'First fort captured by Chhatrapati Shivaji Maharaj in 1643',
        'Highest fort in Pune district at 1,403 metres',
        'Ancient Mengai Devi and Tornjai temples',
        'Stunning panoramic views of the Sahyadri range',
        'Views of Rajgad, Sinhagad, and other forts',
        'Massive fortification walls and bastions',
        'Seasonal waterfalls on the trail (post-monsoon)',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and packed lunch',
        'First aid kit and safety equipment',
        'Transport from Swargate to Velhe and back',
        'Entry charges where applicable',
        'Group photos and trip certificate',
      ],
      exclusions: [
        'Personal expenses and snacks',
        'Travel insurance',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 2.5 litres of water',
        'Sturdy trekking shoes (mandatory)',
        'Sunscreen and sunglasses',
        'Rain poncho (during monsoon)',
        'Energy bars and dry fruits',
        'Personal medication if any',
        'ID proof (mandatory)',
        'Compact backpack',
        'Cap or hat',
        'Torch/headlamp',
      ],
      itinerary: [
        { time: '05:30 AM', title: 'Assembly at Swargate', description: 'Meet at Swargate Bus Stand. Quick introductions and safety briefing.' },
        { time: '06:00 AM', title: 'Depart for Velhe', description: 'Drive through the scenic Pune-Velhe route passing through lush green valleys.' },
        { time: '07:30 AM', title: 'Arrive at Velhe & Breakfast', description: 'Breakfast at a local eatery in Velhe. Warm-up and preparation for the trek.' },
        { time: '08:00 AM', title: 'Begin Trek', description: 'Start the ascent through forested trails. The initial section winds through farmlands before entering thick forest.' },
        { time: '09:30 AM', title: 'Reach Budhla Machi', description: 'Arrive at the first machi. Take a breather and enjoy views of the valley below.' },
        { time: '10:30 AM', title: 'Reach Zunzar Machi & Summit', description: 'Scale the final steep section to reach the top. Explore the Mengai Devi temple and the citadel ruins.' },
        { time: '11:30 AM', title: 'Fort Exploration & Lunch', description: 'Explore the fort complex, the ancient cisterns, and enjoy packed lunch with panoramic views.' },
        { time: '12:30 PM', title: 'Begin Descent', description: 'Start the descent back via the same trail. Take care on the steep sections.' },
        { time: '02:30 PM', title: 'Reach Base & Depart', description: 'Return to Velhe. Refreshments and board vehicles for Pune.' },
        { time: '04:30 PM', title: 'Arrive at Pune', description: 'Reach Swargate. Trek concludes.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.torna[0], altText: 'Torna Fort in monsoon clouds', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.torna[1], altText: 'Climbing trail on Torna during the rains', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.torna[2], altText: 'Torna bastion in wet-season light', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.torna[3], altText: 'Torna fort in lush monsoon weather', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 1, 2, 3].map((i) => ({
        date: weekends[i],
        availableSpots: 25,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Harishchandragad Trek',
      slug: 'harishchandragad-trek',
      description: `Harishchandragad is a legendary hill fortress in the Ahmednagar district of Maharashtra, steeped in mythology and geological wonder. The fort dates back to the 6th century and is mentioned in ancient Matsya Purana. Rising to an impressive 1,424 metres, it is one of the most iconic and challenging treks in the Western Ghats and a bucket-list destination for every serious trekker in India.

The star attraction is the Konkan Kada (Konkan Cliff), a massive concave overhang that drops vertically for over 300 metres, creating one of the most dramatic cliff faces in all of India. The sheer scale of this natural amphitheatre must be seen to be believed. Standing at the edge of Konkan Kada at sunrise, watching the golden light flood the valleys below while clouds swirl around the cliff face, is an experience that defines why people trek.

The fort complex houses the Kedareshwar Cave, a remarkable ancient temple containing a massive Shiva Linga surrounded by waist-deep water (accessible in non-monsoon months). The Saptatirtha Pushkarini, a sacred stepped tank, and the Taramati Peak (the highest point) add to the fort's allure.

Multiple approach routes exist, with the Pachnai route being the most popular and the Nalichi Vaat route offering a more challenging rock-climbing experience suitable for advanced trekkers. The Khireshwar route provides a moderate alternative with beautiful forest sections.`,
      shortDescription: 'Home to the legendary Konkan Kada cliff and Kedareshwar Cave. One of the most iconic and dramatic treks in the Western Ghats.',
      difficulty: 'DIFFICULT' as const,
      category: 'WEEKEND' as const,
      durationHours: 14,
      distanceKm: 18,
      elevationM: 1100,
      maxAltitudeM: 1424,
      region: 'Ahmednagar',
      fortName: 'Harishchandragad',
      startLocation: 'Khireshwar Village, Ahmednagar',
      endLocation: 'Khireshwar Village, Ahmednagar',
      meetingPoint: 'Shivajinagar Bus Stand, Pune',
      meetingTime: '04:30 AM',
      basePrice: 1799,
      discountPrice: 1499,
      maxGroupSize: 20,
      minAge: 14,
      isFeatured: true,
      latitude: 19.3889,
      longitude: 73.7778,
      routeMapUrl: mapUrl(19.3889, 73.7778),
      highlights: [
        'Witness the breathtaking Konkan Kada cliff overhang',
        'Visit the ancient Kedareshwar Cave temple with Shiva Linga in water',
        'Sunrise at Konkan Kada, one of the best in India',
        'Explore the sacred Saptatirtha Pushkarini tank',
        'Summit Taramati Peak, the highest point of the fort',
        'Trek through dense forest with rich biodiversity',
        'Ancient rock carvings and historical ruins dating to 6th century',
        'Overnight camping option under the stars',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'All meals (dinner, breakfast, lunch)',
        'Tents and sleeping bags (for overnight trek)',
        'First aid kit and safety equipment',
        'Transport from Pune to base village and back',
        'Forest entry permits',
        'Group photos and trip certificate',
      ],
      exclusions: [
        'Personal expenses',
        'Travel insurance',
        'Personal trekking gear (shoes, raincoat)',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 3 litres of water',
        'Ankle-support trekking shoes (mandatory)',
        'Warm layers for night camping',
        'Headlamp/torch with extra batteries',
        'Rain poncho and bag cover',
        'Energy-rich snacks',
        'Personal medication',
        'ID proof (mandatory)',
        'Change of clothes in dry bag',
        'Sunscreen and insect repellent',
        'Power bank for phone',
      ],
      itinerary: [
        { time: '04:30 AM', title: 'Assembly at Shivajinagar', description: 'Meet at Shivajinagar Bus Stand. Attendance check and brief for the overnight trek.' },
        { time: '05:00 AM', title: 'Depart for Khireshwar', description: 'Drive via Malshej Ghat. Enjoy scenic views of the Western Ghats en route.' },
        { time: '08:00 AM', title: 'Arrive at Base & Breakfast', description: 'Reach Khireshwar village. Hot breakfast and warm-up exercises. Distribute packed lunches.' },
        { time: '08:45 AM', title: 'Begin Trek', description: 'Start the ascent via the Khireshwar route. Initial section through farmland transitions to thick forest.' },
        { time: '11:00 AM', title: 'Enter the Fort Plateau', description: 'Reach the fort area after a steep climb. Water break and regroup.' },
        { time: '11:30 AM', title: 'Visit Kedareshwar Cave', description: 'Explore the ancient cave temple with the Shiva Linga surrounded by natural water.' },
        { time: '12:30 PM', title: 'Lunch & Rest', description: 'Lunch near the Saptatirtha Pushkarini tank. Rest and explore the ruins.' },
        { time: '02:00 PM', title: 'Trek to Konkan Kada', description: 'Walk to the legendary Konkan Kada. Soak in the dramatic views. Safety briefing at the cliff edge.' },
        { time: '03:30 PM', title: 'Summit Taramati Peak', description: 'Climb to the highest point of the fort for 360-degree views of the Sahyadri range.' },
        { time: '04:30 PM', title: 'Set Up Camp', description: 'Return to the camping area. Set up tents, evening tea, and free time.' },
        { time: '06:30 PM', title: 'Sunset & Dinner', description: 'Watch the sunset paint the Sahyadris golden. Hot dinner under the stars. Campfire and stories.' },
        { time: '05:00 AM (Day 2)', title: 'Sunrise at Konkan Kada', description: 'Wake early for the magical sunrise at Konkan Kada. Breakfast and pack up camp.' },
        { time: '07:30 AM', title: 'Begin Descent', description: 'Start the return trek to Khireshwar with energy and memories.' },
        { time: '10:30 AM', title: 'Reach Base & Depart', description: 'Arrive at the base village. Refreshments. Board vehicles for return to Pune.' },
        { time: '02:00 PM', title: 'Arrive at Pune', description: 'Reach Shivajinagar. Trek concludes.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[0], altText: 'Pachnai trail to Harishchandragad in monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[1], altText: 'Trail towards Kokankada in the rains', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[2], altText: 'Harishchandragad cave temple during monsoon season', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harishchandragad[3], altText: 'Surroundings of Harishchandragad under cloudy skies', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 2, 4, 6].map((i) => ({
        date: weekends[i],
        availableSpots: 20,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Kalsubai Peak Trek',
      slug: 'kalsubai-peak-trek',
      description: `Kalsubai Peak, standing majestically at 1,646 metres, holds the distinction of being the highest peak in Maharashtra, earning it the title "Everest of Maharashtra". Located in the Sahyadri mountain range near the Bhandardara reservoir in Ahmednagar district, this trek offers the ultimate bragging rights for any trekker in the state.

The well-trodden trail starts from Bari village and ascends through a series of iron ladders, rocky sections, and exposed ridgelines. The presence of fixed iron ladders and railings at the steepest sections makes the trek accessible to a wider range of fitness levels despite the significant altitude gain. The trail passes through tribal hamlets, terraced farms, and eventually breaks through the tree line to reveal the rocky summit approach.

At the top, you will find the Kalsubai Temple, a sacred shrine visited by locals and trekkers alike. The panoramic views from the summit are unparalleled: the vast Bhandardara reservoir glimmering to the east, the rugged Sahyadri peaks stretching to the horizon in every direction, and on exceptionally clear winter mornings, the distant outline of the Arabian Sea to the west.

The trek is especially popular during the monsoon season when the entire landscape transforms into a lush green carpet dotted with seasonal waterfalls and wildflowers. Post-monsoon, the clear skies offer the best photography opportunities. Winter treks reward you with crisp air and crystal-clear visibility.`,
      shortDescription: 'Summit the Everest of Maharashtra at 1,646m. The highest peak in the state with iron ladder ascents and breathtaking reservoir views.',
      difficulty: 'MODERATE' as const,
      category: 'WEEKEND' as const,
      durationHours: 8,
      distanceKm: 10,
      elevationM: 1200,
      maxAltitudeM: 1646,
      region: 'Ahmednagar',
      fortName: 'Kalsubai',
      startLocation: 'Bari Village, Ahmednagar',
      endLocation: 'Bari Village, Ahmednagar',
      meetingPoint: 'Kasara Railway Station',
      meetingTime: '05:00 AM',
      basePrice: 1499,
      discountPrice: 1199,
      maxGroupSize: 30,
      minAge: 12,
      isFeatured: true,
      latitude: 19.6014,
      longitude: 73.7106,
      routeMapUrl: mapUrl(19.6014, 73.7106),
      highlights: [
        'Summit the highest peak in Maharashtra (1,646m)',
        'Climb fixed iron ladders on the rock face',
        'Panoramic views of Bhandardara reservoir',
        'Visit the sacred Kalsubai Temple at the summit',
        'Earn the "Everest of Maharashtra" bragging rights',
        'Views of Alang, Madan, and Kulang forts',
        'Stunning sunrise views on clear days',
        'Rich tribal culture at Bari village',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and packed lunch',
        'First aid kit and safety equipment',
        'Transport from Kasara to Bari village and back',
        'Forest entry permits',
        'Group photos and trip certificate',
      ],
      exclusions: [
        'Personal expenses and snacks',
        'Travel insurance',
        'Train tickets to/from Kasara',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 2.5 litres of water',
        'Good grip trekking shoes',
        'Sunscreen and sunglasses',
        'Rain jacket (monsoon)',
        'Warm layer for summit (winter)',
        'Energy bars and electrolytes',
        'Personal medication',
        'ID proof (mandatory)',
        'Compact backpack',
        'Gloves for ladder sections',
      ],
      itinerary: [
        { time: '05:00 AM', title: 'Assembly at Kasara Station', description: 'Meet at Kasara Railway Station. Board private vehicle to Bari village.' },
        { time: '06:30 AM', title: 'Arrive at Bari Village & Breakfast', description: 'Traditional breakfast at a local home. Warm-up and trek briefing.' },
        { time: '07:00 AM', title: 'Begin Trek', description: 'Start the ascent from Bari village. Initial trail passes through farmlands and the tribal settlement.' },
        { time: '08:30 AM', title: 'First Ladder Section', description: 'Reach the first set of iron ladders. Navigate carefully with guide assistance.' },
        { time: '09:30 AM', title: 'Above the Tree Line', description: 'Break through the tree line into the exposed rocky summit section. Dramatic views open up.' },
        { time: '10:00 AM', title: 'Summit Kalsubai Peak', description: 'Reach the top! Visit the temple, soak in the 360-degree views. Photography and celebration.' },
        { time: '10:45 AM', title: 'Lunch at Summit', description: 'Enjoy packed lunch at the highest point in Maharashtra. Group photos.' },
        { time: '11:30 AM', title: 'Begin Descent', description: 'Start the return trek. Extra caution on ladder sections during descent.' },
        { time: '01:30 PM', title: 'Reach Base & Depart', description: 'Return to Bari village. Refreshments. Board vehicle for Kasara.' },
        { time: '03:00 PM', title: 'Arrive at Kasara', description: 'Reach Kasara Station. Trek concludes.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[0], altText: 'View from Kalsubai peak in the wet season', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[1], altText: 'Misty Kalsubai slopes in monsoon weather', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[2], altText: 'Steps on the Kalsubai climb during rains', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.kalsubai[3], altText: 'Kalsubai summit temple visit', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 1, 2, 3, 4, 5].map((i) => ({
        date: weekends[i],
        availableSpots: 30,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Lohagad Fort Trek',
      slug: 'lohagad-fort-trek',
      description: `Lohagad, meaning "Iron Fort", is one of the most accessible yet historically significant forts in Maharashtra. Perched at 1,033 metres near Lonavala in the Pune district, it offers a perfect introduction to the world of Sahyadri trekking. The fort has witnessed rule by multiple dynasties including the Satavahanas, Chalukyas, Rashtrakutas, Yadavas, Bahamanis, Mughals, Marathas, and the British, making it a living chronicle of over 2,000 years of Indian history.

The well-marked trail starts from the small hamlet of Lohagadwadi and follows a stone-paved path that winds up through four distinct gates: Ganesh Darwaja, Narayan Darwaja, Hanuman Darwaja, and Maha Darwaja. Each gate features unique architectural elements and defensive designs that showcase the military engineering genius of their builders. The path is paved and has railings in steeper sections, making it one of the most beginner-friendly fort treks in Maharashtra.

The Vinchukata (Scorpion Tail), a narrow ridgeline extending from the main fort, is the highlight of Lohagad. This dramatic knife-edge ridge offers thrilling views on both sides and is a photographer's paradise, especially during the monsoon when clouds swirl around the fort and waterfalls cascade down the surrounding cliffs.

Adjacent to Lohagad is Visapur Fort, which can be combined for a longer trek. The twin forts together make for an excellent full-day adventure. During monsoon, the area around Lohagad becomes incredibly scenic with the Pawna Lake filling up and the famous Bhaja Caves nearby adding a cultural dimension to the experience.`,
      shortDescription: 'The perfect beginner fort trek near Lonavala. 2,000 years of history, the thrilling Vinchukata ridge, and stunning monsoon views.',
      difficulty: 'EASY' as const,
      category: 'WEEKEND' as const,
      durationHours: 5,
      distanceKm: 7,
      elevationM: 450,
      maxAltitudeM: 1033,
      region: 'Pune',
      fortName: 'Lohagad',
      startLocation: 'Lohagadwadi, Pune',
      endLocation: 'Lohagadwadi, Pune',
      meetingPoint: 'Lonavala Railway Station',
      meetingTime: '07:00 AM',
      basePrice: 899,
      discountPrice: 699,
      maxGroupSize: 35,
      minAge: 10,
      isFeatured: true,
      latitude: 18.7087,
      longitude: 73.4748,
      routeMapUrl: mapUrl(18.7087, 73.4748),
      highlights: [
        'Beginner-friendly fort trek with paved paths',
        'Walk the thrilling Vinchukata (Scorpion Tail) ridge',
        'Pass through four magnificent historical gates',
        'Over 2,000 years of layered history',
        'Stunning monsoon views with waterfalls and clouds',
        'Views of Pawna Lake and Visapur Fort',
        'Nearby Bhaja Caves for a cultural add-on',
        'Perfect introduction to Sahyadri trekking',
      ],
      inclusions: [
        'Expert trek leader',
        'Breakfast and snacks',
        'First aid kit',
        'Transport from Lonavala station to base and back',
        'Entry charges',
        'Group photos',
      ],
      exclusions: [
        'Personal expenses',
        'Travel to/from Lonavala',
        'Travel insurance',
        'Lunch (available at stalls near base)',
      ],
      thingsToCarry: [
        'Minimum 1.5 litres of water',
        'Sports shoes or trekking shoes',
        'Sunscreen',
        'Rain poncho (monsoon is a must)',
        'Light snacks',
        'ID proof',
        'Small backpack',
        'Camera',
      ],
      itinerary: [
        { time: '07:00 AM', title: 'Assembly at Lonavala Station', description: 'Meet at Lonavala Railway Station. Short drive to Lohagadwadi base village.' },
        { time: '07:30 AM', title: 'Breakfast & Briefing', description: 'Enjoy hot breakfast at a local eatery. Safety briefing and warm-up.' },
        { time: '08:00 AM', title: 'Begin Trek', description: 'Start ascending via the stone-paved path. Pass through the four historic gates with stories at each stop.' },
        { time: '09:00 AM', title: 'Reach Fort Plateau', description: 'Arrive at the main fort area. Explore the cannons, water tanks, and ruins.' },
        { time: '09:30 AM', title: 'Vinchukata Ridge Walk', description: 'Walk the famous Scorpion Tail ridge. Thrilling views on both sides. Photography break.' },
        { time: '10:15 AM', title: 'Fort Exploration', description: 'Explore the remaining sections of the fort. Visit the highest point for panoramic views.' },
        { time: '11:00 AM', title: 'Begin Descent', description: 'Start the easy descent back to base.' },
        { time: '12:00 PM', title: 'Reach Base & Depart', description: 'Return to Lohagadwadi. Optional visit to Bhaja Caves. Board vehicle for Lonavala station.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[0], altText: 'Lohagad hills during the monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[1], altText: 'Steps leading to Lohagad Fort in monsoon', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[2], altText: 'Rainy-season view across Lohagad Fort', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.lohagad[3], altText: 'Monsoon view near Lohagad and Visapur', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        date: weekends[i],
        availableSpots: 35,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Harihar Fort Trek',
      slug: 'harihar-fort-trek',
      description: `Harihar Fort, also known as Harshagad, is one of the most visually unforgettable forts in Maharashtra because of its near-vertical staircase carved directly into the rock face. Located near Trimbakeshwar in the Nashik district, the fort rises on a triangular rock massif and feels dramatically fortified even before you begin the climb. The fort stands at around 1,120 metres above sea level and is famous across the Sahyadris for its steep, iconic stairway.

The trek usually starts from Nirgudpada village and reaches the famous staircase after a scenic walk through open fields, forested patches, and rocky sections. The final rock-cut steps are narrow, steep, and thrilling, making Harihar a favorite among trekkers looking for a high-adrenaline day trek without committing to an overnight expedition.

Once on top, the fort opens into a broad plateau with small ruins, a temple area, water cisterns, and wide views of nearby peaks in the Trimbak range. On clear days, you can spot Basgad, Brahmagiri, and the surrounding Nashik hills. In monsoon and post-monsoon months, the fort looks especially dramatic with moving clouds, deep green valleys, and mist flowing past the stairway.

Harihar works especially well as a weekday trek because it is compact, memorable, and easy to complete in a single day while still feeling like a major Sahyadri achievement.`,
      shortDescription: 'A dramatic day trek near Nashik known for its near-vertical rock-cut staircase and sweeping views from the summit plateau.',
      difficulty: 'MODERATE' as const,
      category: 'WEEKDAY' as const,
      durationHours: 8,
      distanceKm: 6,
      elevationM: 500,
      maxAltitudeM: 1120,
      region: 'Nashik',
      fortName: 'Harihar',
      startLocation: 'Nirgudpada Village, Nashik',
      endLocation: 'Nirgudpada Village, Nashik',
      meetingPoint: 'Kasara Railway Station',
      meetingTime: '05:15 AM',
      basePrice: 1499,
      discountPrice: 1099,
      maxGroupSize: 24,
      minAge: 14,
      isFeatured: true,
      latitude: 19.9075,
      longitude: 73.4703,
      routeMapUrl: mapUrl(19.9075, 73.4703),
      highlights: [
        'Climb the iconic 80-degree rock-cut staircase',
        'Panoramic views of the Trimbak range and nearby forts',
        'Compact trek with a high adventure payoff',
        'Ancient fort ruins and summit water cisterns',
        'Excellent monsoon and post-monsoon photography route',
        'One of the most distinctive fort silhouettes in Maharashtra',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and packed lunch',
        'Base transport from Kasara and return',
        'First aid kit and safety equipment',
        'Forest and entry permissions where applicable',
        'Group photos',
      ],
      exclusions: [
        'Travel to and from Kasara',
        'Personal expenses and snacks',
        'Travel insurance',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 2 litres of water',
        'Trekking shoes with strong grip',
        'Rain jacket or poncho in monsoon',
        'Cap and sunscreen for exposed sections',
        'Energy snacks',
        'ID proof (mandatory)',
        'Compact backpack with rain cover',
        'Personal medication if any',
      ],
      itinerary: [
        { time: '05:15 AM', title: 'Assembly at Kasara', description: 'Meet at Kasara Railway Station. Attendance, introductions, and briefing.' },
        { time: '06:00 AM', title: 'Drive to Nirgudpada', description: 'Travel by local vehicle to Nirgudpada village through the Igatpuri-Nashik belt.' },
        { time: '07:00 AM', title: 'Breakfast at Base', description: 'Quick breakfast, warm-up session, and trail briefing before starting the trek.' },
        { time: '07:30 AM', title: 'Begin Trek', description: 'Walk through village fields and gradually gain height on the approach trail.' },
        { time: '09:00 AM', title: 'Reach the Staircase Section', description: 'Take a short halt before the famous rock-cut steps. Guides manage spacing and movement.' },
        { time: '09:45 AM', title: 'Summit Plateau Exploration', description: 'Reach the top, explore the fort remains, cisterns, and summit viewpoints.' },
        { time: '11:00 AM', title: 'Packed Lunch with Views', description: 'Enjoy lunch on the plateau while taking in the surrounding Sahyadri ridges.' },
        { time: '11:45 AM', title: 'Begin Descent', description: 'Descend carefully via the staircase and retrace the approach trail.' },
        { time: '02:00 PM', title: 'Reach Base & Depart', description: 'Return to Nirgudpada, refresh, and board transport for Kasara.' },
        { time: '03:30 PM', title: 'Arrive at Kasara', description: 'Trip concludes with enough time to continue the rest of the weekday smoothly.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[0], altText: 'Harihar Fort profile in monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[1], altText: 'Rock face at Harihar Fort', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[2], altText: 'Harihar Fort staircase', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.harihar[3], altText: 'View from Harihar summit', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 2, 4, 6, 8].map((i) => ({
        date: weekdays[i],
        availableSpots: 24,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Devkund Waterfall Trek',
      slug: 'devkund-waterfall-trek',
      description: `Devkund is one of Maharashtra's best-known monsoon waterfall trails, located near Bhira in Raigad district. The trek leads through a lush forest corridor, river crossings, and open rocky sections before reaching a striking plunge pool framed by steep cliffs. The combination of easy access, dense greenery, and a dramatic waterfall finale has made Devkund a favorite for nature-focused day trips.

Unlike fort treks that revolve around climbs and summit exploration, Devkund is driven by the journey through water-fed terrain. The route passes along streams and through sections that feel completely transformed in peak monsoon, with fresh green cover and rushing side cascades at every turn.

At the end of the trail, the waterfall drops into a deep blue-green pool that creates one of the most recognizable scenic spots in the Sahyadris. Safety management around water conditions is important during peak rains, which is why guided departures work well for first-time visitors.

This location fits perfectly into the weekday category because it delivers a full monsoon experience in a compact one-day format with less physical strain than a high-elevation fort.`,
      shortDescription: 'A compact forest-and-stream trek to one of Maharashtra’s most famous plunge-pool waterfalls near Bhira.',
      difficulty: 'EASY' as const,
      category: 'WEEKDAY' as const,
      durationHours: 8,
      distanceKm: 6,
      elevationM: 220,
      maxAltitudeM: 820,
      region: 'Raigad',
      startLocation: 'Bhira Village, Raigad',
      endLocation: 'Bhira Village, Raigad',
      meetingPoint: 'Mulund Check Naka, Mumbai',
      meetingTime: '05:00 AM',
      basePrice: 1199,
      discountPrice: 999,
      maxGroupSize: 30,
      minAge: 10,
      isFeatured: true,
      latitude: 18.4144,
      longitude: 73.3819,
      routeMapUrl: mapUrl(18.4144, 73.3819),
      highlights: [
        'Reach the famous turquoise plunge pool at Devkund',
        'Scenic forest trail with stream crossings',
        'Ideal introductory monsoon trek',
        'Strong photography and nature experience',
        'Great weekday escape from Mumbai or Pune',
        'Lush valley scenery throughout the route',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and lunch',
        'Transport from Mumbai pickup and return',
        'First aid kit and safety support',
        'Local guide and entry permits where applicable',
        'Group photos',
      ],
      exclusions: [
        'Personal expenses',
        'Snacks en route',
        'Travel insurance',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 2 litres of water',
        'Trekking or sports shoes with grip',
        'Quick-dry clothes',
        'Rainwear and backpack cover',
        'Spare clothes in waterproof bag',
        'ID proof (mandatory)',
        'Electrolytes and light snacks',
        'Personal medication',
      ],
      itinerary: [
        { time: '05:00 AM', title: 'Assembly at Mumbai Pickup', description: 'Meet at Mulund Check Naka and depart toward Bhira village.' },
        { time: '08:00 AM', title: 'Reach Bhira & Breakfast', description: 'Breakfast at base, registration formalities, and safety briefing.' },
        { time: '08:45 AM', title: 'Begin Trek', description: 'Start the trail through village outskirts, forests, and stream crossings.' },
        { time: '10:30 AM', title: 'Reach Devkund', description: 'Arrive at the waterfall basin. Rest, photography, and controlled exploration.' },
        { time: '11:30 AM', title: 'Packed Lunch', description: 'Lunch in the designated safe zone near the waterfall route.' },
        { time: '12:15 PM', title: 'Begin Return Walk', description: 'Retrace the forest trail back toward Bhira.' },
        { time: '02:00 PM', title: 'Reach Base & Depart', description: 'Freshen up, have refreshments, and start the return journey.' },
        { time: '05:30 PM', title: 'Arrive Back', description: 'Trip ends with a same-day return ideal for weekday schedules.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[0], altText: 'Devkund waterfall in monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[1], altText: 'Devkund waterfall plunge pool', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[2], altText: 'View of Devkund valley', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.devkund[3], altText: 'Devkund waterfall trail', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [1, 3, 5, 7, 9].map((i) => ({
        date: weekdays[i],
        availableSpots: 30,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Andharban Jungle Trek',
      slug: 'andharban-jungle-trek',
      description: `Andharban, literally meaning "dark forest", is one of the most atmospheric monsoon trails in Maharashtra. Located along the Tamhini Ghat belt, the route is known for dense canopy, valley views, persistent mist, and numerous streams and side waterfalls that come alive during the rains. Unlike most Sahyadri treks, Andharban is more of a forest traverse than a summit push.

The trail starts near Pimpri and gradually descends through a corridor of thick vegetation, wet roots, mossy rocks, and cloud-filled openings over the Kundalika valley. The combination of long shaded sections and dramatic valley cutouts gives the trek a highly immersive feel from start to finish.

Monsoon is the defining season here. The forest becomes deeply saturated, the trail edges fill with water, and several waterfall pockets appear along the route. Because the trek is long but not steep in the classic fort-trek sense, it attracts hikers who want movement, scenery, and monsoon texture rather than just a summit photo.

Andharban is ideal for weekday departures when you want a full outdoor day, but not the commitment of a long fort circuit or overnight camp.`,
      shortDescription: 'A cloud-wrapped forest traverse through Tamhini’s dark green valley with streams, side waterfalls, and immersive monsoon scenery.',
      difficulty: 'MODERATE' as const,
      category: 'WEEKDAY' as const,
      durationHours: 9,
      distanceKm: 13,
      elevationM: 180,
      maxAltitudeM: 690,
      region: 'Pune',
      fortName: 'Andharban',
      startLocation: 'Pimpri, Tamhini Ghat, Pune',
      endLocation: 'Bhira Dam, Raigad',
      meetingPoint: 'Deccan Bus Stop, Pune',
      meetingTime: '05:30 AM',
      basePrice: 1299,
      discountPrice: 1099,
      maxGroupSize: 28,
      minAge: 12,
      isFeatured: false,
      latitude: 18.4072,
      longitude: 73.4208,
      routeMapUrl: mapUrl(18.4072, 73.4208),
      highlights: [
        'Dense rainforest-like trail during monsoon',
        'Long valley views over the Kundalika basin',
        'Multiple side waterfalls and streams on the route',
        'One of Maharashtra’s best cloud-and-canopy hikes',
        'Excellent weekday monsoon trail for experienced walkers',
        'Strong birdlife and deep forest atmosphere',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Breakfast and packed lunch',
        'Transport from Pune to trailhead and return from exit point',
        'First aid kit and safety support',
        'Local guide and permissions',
        'Group photos',
      ],
      exclusions: [
        'Personal expenses',
        'Travel insurance',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 2.5 litres of water',
        'Trekking shoes with reliable grip',
        'Full rainwear and backpack cover',
        'Extra socks and quick-dry clothing',
        'Electrolytes and trail snacks',
        'ID proof (mandatory)',
        'Towel and change clothes in waterproof cover',
        'Personal medication',
      ],
      itinerary: [
        { time: '05:30 AM', title: 'Assembly in Pune', description: 'Meet at Deccan Bus Stop and begin travel toward Tamhini.' },
        { time: '07:30 AM', title: 'Breakfast & Briefing', description: 'Breakfast stop near base, followed by route briefing and weather check.' },
        { time: '08:15 AM', title: 'Begin Forest Traverse', description: 'Start descending into the Andharban trail under thick canopy.' },
        { time: '10:30 AM', title: 'Waterfall and Valley Stops', description: 'Regroup at major viewpoints and waterfall pockets for hydration and photography.' },
        { time: '12:30 PM', title: 'Lunch Break', description: 'Packed lunch at a safe open patch along the forest route.' },
        { time: '01:00 PM', title: 'Continue Toward Exit', description: 'Resume the long traverse, gradually moving toward the Bhira side.' },
        { time: '03:30 PM', title: 'Reach End Point', description: 'Exit the trail near the dam side, refresh, and board the return vehicle.' },
        { time: '06:30 PM', title: 'Arrive Back in Pune', description: 'Trip concludes as a full but efficient weekday monsoon adventure.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[0], altText: 'Andharban forest trail', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[1], altText: 'Andharban valley viewpoint', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[2], altText: 'Andharban waterfall section', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.andharban[3], altText: 'Andharban waterfall view', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 3, 5, 8, 10].map((i) => ({
        date: weekdays[i],
        availableSpots: 28,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Thoseghar Waterfalls Trail',
      slug: 'thoseghar-waterfalls-trail',
      description: `Thoseghar is a well-known monsoon waterfall zone near Satara, famous for a series of seasonal cascades that pour into a deep valley once the rains strengthen across western Maharashtra. The site combines easy walking access, dramatic viewpoints, and sweeping valley scenery, making it one of the most approachable waterfall experiences in the state.

The outing focuses on moving between viewpoint decks, short trail sections, and landscape stops rather than on a demanding summit climb. During peak monsoon, the mist, wind, and noise of the falls create a full sensory experience that works especially well for groups looking for a lighter outdoor day.

Thoseghar also suits travelers who prefer photography, scenic viewpoints, and road-trip pacing over strenuous trekking. The route can be combined with short walks through nearby plateau sections and roadside monsoon points around Satara.

Because the physical demand is lighter than a fort or long forest trek, Thoseghar fits naturally into the weekday category and broadens the trip mix beyond only summit-based adventures.`,
      shortDescription: 'A relaxed monsoon outing near Satara with dramatic valley waterfalls, short walks, and scenic viewpoints.',
      difficulty: 'EASY' as const,
      category: 'WEEKDAY' as const,
      durationHours: 7,
      distanceKm: 4,
      elevationM: 120,
      maxAltitudeM: 950,
      region: 'Satara',
      fortName: 'Thoseghar',
      startLocation: 'Thoseghar Village, Satara',
      endLocation: 'Thoseghar Village, Satara',
      meetingPoint: 'Satara Bus Stand',
      meetingTime: '07:00 AM',
      basePrice: 899,
      discountPrice: 749,
      maxGroupSize: 35,
      minAge: 8,
      isFeatured: false,
      latitude: 17.5966,
      longitude: 73.8458,
      routeMapUrl: mapUrl(17.5966, 73.8458),
      highlights: [
        'Witness the famous Thoseghar waterfall chain in peak monsoon',
        'Easy access with scenic viewpoints and short trails',
        'Perfect for mixed-age and relaxed travel groups',
        'Strong monsoon road-trip and photography location',
        'Valley mist, wind, and panoramic green landscapes',
        'Good same-day weekday experience from Satara and Pune side',
      ],
      inclusions: [
        'Trip host and local support',
        'Breakfast and lunch',
        'Local transport for the waterfall circuit where applicable',
        'First aid kit',
        'Entry charges where required',
        'Group photos',
      ],
      exclusions: [
        'Personal purchases',
        'Travel insurance',
        'Anything not mentioned in inclusions',
      ],
      thingsToCarry: [
        'Minimum 1.5 litres of water',
        'Sports shoes or trekking shoes',
        'Rainwear in monsoon',
        'Small backpack',
        'Cap or hood for wind at viewpoints',
        'ID proof',
        'Phone pouch for water protection',
        'Personal medication',
      ],
      itinerary: [
        { time: '07:00 AM', title: 'Assembly at Satara', description: 'Meet at Satara Bus Stand and depart toward the waterfall zone.' },
        { time: '08:00 AM', title: 'Breakfast Stop', description: 'Breakfast en route with monsoon route briefing and weather update.' },
        { time: '09:00 AM', title: 'Viewpoint Circuit Begins', description: 'Visit the main Thoseghar viewpoints and short walking trails.' },
        { time: '11:00 AM', title: 'Scenic Plateau and Waterfall Stops', description: 'Spend time at secondary viewpoints and photography zones.' },
        { time: '12:30 PM', title: 'Lunch', description: 'Lunch at a local stop near the waterfall circuit.' },
        { time: '01:15 PM', title: 'Final Monsoon Stops', description: 'Short final walk and wrap-up around the viewpoint area.' },
        { time: '03:00 PM', title: 'Return to Satara', description: 'Depart the waterfall zone and head back to the city.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[0], altText: 'Thoseghar waterfall during monsoon', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[1], altText: 'Thoseghar falls close view', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[2], altText: 'Thoseghar waterfall viewpoint', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.thoseghar[3], altText: 'Monsoon valley waterfall scene', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [2, 4, 6, 9, 11].map((i) => ({
        date: weekdays[i],
        availableSpots: 35,
        status: 'OPEN' as const,
      })),
    },
    {
      title: 'Rajmachi Fort Night Trek',
      slug: 'rajmachi-fort-night-trek',
      description: `Rajmachi Fort, strategically perched between Lonavala and Karjat, is one of the most popular night trekking destinations in Maharashtra. The fort complex consists of two strongholds: Shrivardhan and Manaranjan, both sitting at approximately 900 metres above sea level. The twin fortifications guard the old trade route through Bor Ghat, one of the historical passes connecting the Konkan coast to the Deccan plateau.

The night trek from Karjat side is the most thrilling approach, starting in the darkness and ascending through a dense forest trail illuminated only by your headlamp. The trail passes through the quaint tribal village of Udhewadi, where traditional mud-and-thatch houses stand as they have for centuries. The forest comes alive at night with the sounds of crickets, owls, and rustling leaves, creating an immersive sensory experience that daytime treks simply cannot match.

As you climb higher, the darkness gives way to a spectacular dawn, and reaching the fort summit just as the sun breaks the horizon is the defining moment of this trek. The views from Shrivardhan bastion at sunrise, overlooking the Bor Ghat valley and the distant Sahyadri peaks bathed in golden light, are worth every step of the climb.

The Rajmachi fort complex is well-preserved with intact bastions, doorways, and water tanks. The ruins of cavalry stables and ammunition storage rooms tell tales of the fort's strategic importance during the Maratha period. After exploring both peaks, the descent offers beautiful views of the Konkan landscape stretching to the horizon.`,
      shortDescription: 'An exhilarating night trek to the twin forts of Shrivardhan and Manaranjan. Trek through darkness to witness a magical Sahyadri sunrise.',
      difficulty: 'MODERATE' as const,
      category: 'NIGHT_TREK' as const,
      durationHours: 12,
      distanceKm: 16,
      elevationM: 650,
      maxAltitudeM: 920,
      region: 'Raigad',
      fortName: 'Rajmachi',
      startLocation: 'Kondivade Village, Karjat',
      endLocation: 'Kondivade Village, Karjat',
      meetingPoint: 'Karjat Railway Station',
      meetingTime: '10:00 PM',
      basePrice: 1399,
      discountPrice: 1099,
      maxGroupSize: 25,
      minAge: 16,
      isFeatured: true,
      latitude: 18.8375,
      longitude: 73.3975,
      routeMapUrl: mapUrl(18.8375, 73.3975),
      highlights: [
        'Thrilling night trek through dense forest',
        'Explore twin forts: Shrivardhan and Manaranjan',
        'Magical sunrise from the fort summit',
        'Visit the traditional Udhewadi tribal village',
        'Nocturnal forest sounds and wildlife experience',
        'Historic Bor Ghat trade route views',
        'Well-preserved bastions and fortification walls',
        'Stunning Konkan landscape views during descent',
      ],
      inclusions: [
        'Expert trek leader and support staff',
        'Late-night snacks, early morning tea, breakfast, and lunch',
        'First aid kit and safety equipment',
        'Transport from Karjat station to base and back',
        'Forest entry permits',
        'Group photos and trip certificate',
      ],
      exclusions: [
        'Personal expenses',
        'Travel to/from Karjat',
        'Travel insurance',
        'Personal trekking gear',
      ],
      thingsToCarry: [
        'Minimum 2 litres of water',
        'Trekking shoes with excellent grip (mandatory)',
        'Bright headlamp with extra batteries (mandatory)',
        'Warm jacket or fleece for night',
        'Rain gear during monsoon',
        'Energy snacks',
        'Personal medication',
        'ID proof (mandatory)',
        'Backpack with rain cover',
        'Extra pair of socks',
        'Power bank',
      ],
      itinerary: [
        { time: '10:00 PM', title: 'Assembly at Karjat Station', description: 'Meet at Karjat Railway Station. Headlamp check, safety briefing, and group introduction.' },
        { time: '10:30 PM', title: 'Drive to Kondivade', description: 'Short drive to Kondivade village, the trek base point.' },
        { time: '11:00 PM', title: 'Begin Night Trek', description: 'Start the ascent in darkness. Enter the forest trail with headlamps on. The sounds of the night forest surround you.' },
        { time: '01:00 AM', title: 'Reach Udhewadi Village', description: 'Arrive at the tribal village of Udhewadi. Midnight tea and snack break. Rest for 20 minutes.' },
        { time: '01:30 AM', title: 'Continue to Fort', description: 'Resume the trek towards the Shrivardhan peak. The trail gets steeper and more exciting.' },
        { time: '03:30 AM', title: 'Reach Shrivardhan Summit', description: 'Arrive at the first peak. Set up for sunrise viewing. Rest and warm up.' },
        { time: '05:30 AM', title: 'Sunrise', description: 'Witness the spectacular sunrise over the Sahyadri mountains. Photography and soaking in the moment.' },
        { time: '06:30 AM', title: 'Explore Shrivardhan Fort', description: 'Explore the bastions, fortifications, and cannons. Breakfast served with views.' },
        { time: '07:30 AM', title: 'Trek to Manaranjan Fort', description: 'Cross over to the second peak, Manaranjan. Explore the ruins and enjoy different perspectives.' },
        { time: '09:00 AM', title: 'Begin Descent', description: 'Start the descent in daylight, enjoying the forest and valley views you missed at night.' },
        { time: '11:30 AM', title: 'Reach Base & Lunch', description: 'Arrive back at Kondivade. Hot lunch and rest. Share stories from the night trek.' },
        { time: '12:30 PM', title: 'Depart for Karjat', description: 'Board vehicle for Karjat station. Trek concludes with great memories of the night adventure.' },
      ],
      images: [
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[0], altText: 'Rainy Rajmachi view from the trek route', isPrimary: true, sortOrder: 0 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[1], altText: 'Trekkers climbing toward Rajmachi in monsoon', isPrimary: false, sortOrder: 1 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[2], altText: 'Waterfalls around Rajmachi during rainy season', isPrimary: false, sortOrder: 2 },
        { url: MAHARASHTRA_MONSOON_IMAGES.trips.rajmachi[3], altText: 'Rajmachi fort landscape in the wet season', isPrimary: false, sortOrder: 3 },
      ],
      schedules: [0, 1, 3, 5].map((i) => ({
        date: weekends[i],
        availableSpots: 25,
        status: 'OPEN' as const,
      })),
    },
  ];

  for (const tripData of tripsData) {
    const { images, schedules, ...data } = tripData;

    const trip = await prisma.trip.create({
      data: {
        ...data,
        itinerary: data.itinerary as any,
        images: { create: images },
        schedules: { create: schedules },
      },
    });

    console.log(`Created trip: ${trip.title}`);
  }

  // ========== HERO IMAGES ==========
  const heroImages = [
    {
      url: MAHARASHTRA_MONSOON_IMAGES.seedHeroImages[0],
      title: 'Discover Maharashtra\'s Majestic Forts',
      subtitle: 'Expert-led treks through the Sahyadri mountains with safety, comfort, and unforgettable experiences',
      ctaText: 'Explore Treks',
      ctaLink: '/trips',
      sortOrder: 0,
      isActive: true,
    },
    {
      url: MAHARASHTRA_MONSOON_IMAGES.seedHeroImages[1],
      title: 'Trek Under the Stars',
      subtitle: 'Join our thrilling night treks and witness breathtaking Sahyadri sunrises from ancient fort summits',
      ctaText: 'Night Treks',
      ctaLink: '/trips?category=NIGHT_TREK',
      sortOrder: 1,
      isActive: true,
    },
    {
      url: MAHARASHTRA_MONSOON_IMAGES.seedHeroImages[2],
      title: 'Your Next Adventure Awaits',
      subtitle: 'From easy beginner trails to challenging summit climbs, find the perfect trek for your skill level',
      ctaText: 'Book Now',
      ctaLink: '/trips',
      sortOrder: 2,
      isActive: true,
    },
  ];

  for (const hero of heroImages) {
    await prisma.heroImage.create({ data: hero });
  }
  console.log(`Created ${heroImages.length} hero images.`);

  console.log('\nSeeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
