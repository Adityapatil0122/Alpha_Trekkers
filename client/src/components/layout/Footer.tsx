import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChatCircle,
  EnvelopeSimple,
  InstagramLogo,
  MapPinLine,
  PhoneCall,
  YoutubeLogo,
} from '@phosphor-icons/react';

const siteLogo = '/destinations/alogo.png';

const destinations = [
  { label: 'Mahabaleshwar', to: '/tours/mahabaleshwar' },
  { label: 'Alibaug', to: '/tours/alibaug' },
  { label: 'Lonavala & Khandala', to: '/tours/lonavala-khandala' },
  { label: 'Bhimashankar', to: '/tours/bhimashankar' },
  { label: 'Tamhini Ghat', to: '/tours/tamhini-ghat' },
  { label: 'Matheran', to: '/tours/matheran' },
];

const companyLinks = [
  { to: '/about', label: 'Who We Are' },
  { to: '/trips', label: 'One-Day Trips' },
  { to: '/trips#kolad-river-rafting', label: 'Adventure Picks' },
  { to: '/trips#wai', label: 'Spiritual Escapes' },
  { to: '/contact', label: 'Travel Support' },
];

const socialLinks = [
  {
    Icon: InstagramLogo,
    href: 'https://www.instagram.com/alphatrekkersofficial?igsh=MTl4NWVmbXc4NDU1aA==',
    label: 'Instagram',
  },
  {
    Icon: YoutubeLogo,
    href: '#',
    label: 'YouTube',
  },
  {
    Icon: ChatCircle,
    href: '#',
    label: 'Chat',
  },
];

/* ─────────────────────────────────────────────────────────────
   Inline SVG Background – 3 layered mountains + hikers + trees
   ───────────────────────────────────────────────────────────── */

function FooterBg() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <svg
      className="footer-bg pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio={isMobile ? 'xMidYMid slice' : 'xMidYMax slice'}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ftSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9f5ec" />
          <stop offset="30%" stopColor="#dceee0" />
          <stop offset="65%" stopColor="#1a4d28" />
          <stop offset="85%" stopColor="#0f3018" />
          <stop offset="100%" stopColor="#0d2614" />
        </linearGradient>

        <radialGradient id="ftSunGlow" cx="0.82" cy="0.11" r="0.2">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="1" />
          <stop offset="30%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="ftMtn1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d4bc" />
          <stop offset="100%" stopColor="#96c09d" />
        </linearGradient>
        <linearGradient id="ftMtn2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78ab80" />
          <stop offset="100%" stopColor="#5a9462" />
        </linearGradient>
        <linearGradient id="ftMtn3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d7845" />
          <stop offset="100%" stopColor="#265a2e" />
        </linearGradient>
        <linearGradient id="ftMtn4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e4d26" />
          <stop offset="60%" stopColor="#112e16" />
          <stop offset="100%" stopColor="#0d2614" />
        </linearGradient>

        <linearGradient id="ftMist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* ── Symbols ── */}
        <symbol id="ftPine" viewBox="0 0 20 44">
          <rect x="8.5" y="30" width="3" height="14" rx="1" fill="#2a5a2a" />
          <polygon points="10,0 2,16 6,16 0,28 5,28 0,38 20,38 15,28 20,28 14,16 18,16" fill="#2d7a3a" />
          <polygon points="10,2 5,12 7,12 3,22 6,22 2,32 18,32 14,22 17,22 13,12 15,12" fill="#3d9a4a" opacity="0.5" />
        </symbol>

        <symbol id="ftBush" viewBox="0 0 30 18">
          <ellipse cx="15" cy="12" rx="14" ry="8" fill="#2a6a32" />
          <ellipse cx="12" cy="10" rx="10" ry="7" fill="#3a8a44" opacity="0.6" />
          <ellipse cx="18" cy="9" rx="7" ry="5" fill="#4a9a54" opacity="0.4" />
        </symbol>

        {/* Hiker 1 – orange jacket, walking right, trekking pole in left hand */}
        <symbol id="ftHiker" viewBox="0 0 28 48">
          {/* Trekking pole – left hand */}
          <line x1="5" y1="17" x2="2" y2="44" stroke="#8a7050" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="2" cy="44.5" r="1" fill="#8a7050" />
          {/* Backpack */}
          <path d="M14 11 Q19 11 19 15 L19 22 Q19 24 17 24 L14 24 Z" fill="#7a5a30" />
          <rect x="15" y="22" width="3.5" height="3" rx="1" fill="#6a4a28" />
          <line x1="16" y1="12" x2="16" y2="11" stroke="#6a4a28" strokeWidth="1.5" strokeLinecap="round" />
          {/* Torso – jacket */}
          <path d="M8 12 Q8 10 12 10 Q14 10 14 12 L14 22 Q14 24 12 24 L10 24 Q8 24 8 22 Z" fill="#d45a28" />
          <path d="M8 12 L9 13 L9 22 L8 22 Z" fill="#ba4e22" opacity="0.5" />
          {/* Collar */}
          <rect x="9" y="10" width="4" height="1.5" rx="0.5" fill="#e86838" />
          {/* Left arm (pole hand) */}
          <path d="M8 13 Q6 15 5 17" stroke="#d45a28" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="5" cy="17" r="1.2" fill="#c89a6a" />
          {/* Right arm (swing) */}
          <path d="M14 13 Q17 16 18 18" stroke="#d45a28" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="18" cy="18" r="1.2" fill="#c89a6a" />
          {/* Legs – hiking pants */}
          <path d="M10 24 Q9 30 7.5 36" stroke="#3a5a7a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M12 24 Q14 30 15.5 36" stroke="#3a5a7a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Knee bend detail */}
          <path d="M10 24 Q8.5 28 8 30" stroke="#2e4e6e" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
          {/* Boots */}
          <path d="M6 35.5 Q6 37.5 5 38 L9 38 Q9 36 7.5 35.5 Z" fill="#3a2a1a" />
          <path d="M14 35.5 Q14.5 37.5 14 38 L18 38 Q17.5 36 15.5 35.5 Z" fill="#3a2a1a" />
          <line x1="5.5" y1="38" x2="8.5" y2="38" stroke="#4a3a2a" strokeWidth="0.8" />
          <line x1="14.5" y1="38" x2="17.5" y2="38" stroke="#4a3a2a" strokeWidth="0.8" />
          {/* Head + neck */}
          <rect x="10" y="8" width="2" height="2" rx="0.5" fill="#c89a6a" />
          <circle cx="11" cy="5.5" r="3" fill="#c89a6a" />
          {/* Hair */}
          <path d="M8 5 Q8 2 11 1.5 Q14 1 14 4" fill="#4a3020" />
          {/* Cap */}
          <path d="M7.5 4.5 Q11 1 14.5 4 L15.5 4 Q15.5 3 14 2 Q11 0 8 2 Q6.5 3 7 4.5 Z" fill="#5a8a3a" />
          <ellipse cx="11" cy="4" rx="5.5" ry="1" fill="#5a8a3a" />
          {/* Face detail */}
          <circle cx="10" cy="5.5" r="0.4" fill="#5a3a2a" />
          <circle cx="12.5" cy="5.5" r="0.4" fill="#5a3a2a" />
        </symbol>

        {/* Hiker 2 – blue jacket, walking right, trekking pole in right hand */}
        <symbol id="ftHiker2" viewBox="0 0 28 48">
          {/* Trekking pole – right hand */}
          <line x1="20" y1="18" x2="23" y2="44" stroke="#8a7050" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="23" cy="44.5" r="1" fill="#8a7050" />
          {/* Backpack */}
          <path d="M7 11 Q5 11 5 15 L5 21 Q5 23 7 23 L9 23 Z" fill="#8a6040" />
          <rect x="5" y="21" width="3" height="2.5" rx="0.8" fill="#7a5038" />
          {/* Water bottle on side */}
          <rect x="4" y="15" width="1.5" height="4" rx="0.7" fill="#6090b0" />
          {/* Torso – jacket */}
          <path d="M9 12 Q9 10 12 10 Q15 10 15 12 L15 22 Q15 24 13 24 L11 24 Q9 24 9 22 Z" fill="#2878a8" />
          <path d="M14 12 L15 13 L15 22 L14 22 Z" fill="#1e6890" opacity="0.5" />
          {/* Collar / zip line */}
          <line x1="12" y1="10" x2="12" y2="16" stroke="#1e6890" strokeWidth="0.6" />
          <rect x="10" y="10" width="4" height="1.5" rx="0.5" fill="#3088b8" />
          {/* Left arm (swing) */}
          <path d="M9 13 Q6 16 5 18" stroke="#2878a8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="5" cy="18" r="1.2" fill="#c89a6a" />
          {/* Right arm (pole hand) */}
          <path d="M15 13 Q18 16 20 18" stroke="#2878a8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="18" r="1.2" fill="#c89a6a" />
          {/* Legs – dark hiking pants */}
          <path d="M11 24 Q9.5 30 8 36" stroke="#3a3a4a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M13 24 Q14.5 30 16 36" stroke="#3a3a4a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Boots */}
          <path d="M6.5 35.5 Q6.5 37.5 6 38 L10 38 Q9.5 36 8 35.5 Z" fill="#3a2a1a" />
          <path d="M14.5 35.5 Q15 37.5 14.5 38 L18.5 38 Q18 36 16 35.5 Z" fill="#3a2a1a" />
          <line x1="6.5" y1="38" x2="9.5" y2="38" stroke="#4a3a2a" strokeWidth="0.8" />
          <line x1="15" y1="38" x2="18" y2="38" stroke="#4a3a2a" strokeWidth="0.8" />
          {/* Head + neck */}
          <rect x="11" y="8" width="2" height="2" rx="0.5" fill="#d4a574" />
          <circle cx="12" cy="5.5" r="3" fill="#d4a574" />
          {/* Hair */}
          <path d="M9 5.5 Q9 2.5 12 2 Q15 2.5 15 5.5" fill="#2a1a0a" />
          {/* Beanie / cap */}
          <path d="M8.5 4.5 Q12 1.5 15.5 4.5" fill="#cc3838" />
          <ellipse cx="12" cy="4.5" rx="5" ry="1" fill="#cc3838" />
          <circle cx="12" cy="1.8" r="0.8" fill="#cc3838" />
          {/* Face detail */}
          <circle cx="10.5" cy="5.5" r="0.4" fill="#4a2a1a" />
          <circle cx="13" cy="5.5" r="0.4" fill="#4a2a1a" />
          <path d="M11 7 Q12 7.6 13 7" stroke="#8a5a3a" strokeWidth="0.4" fill="none" />
        </symbol>

        <symbol id="ftBird" viewBox="0 0 16 6">
          <path d="M0 3 Q4 0 8 2.5 Q12 0 16 3" fill="none" stroke="#6a8a6a" strokeWidth="1" strokeLinecap="round" />
        </symbol>

        <radialGradient id="ftFirefly">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ══ Sky ══ */}
      <rect width="1440" height="900" fill="url(#ftSky)" />

      {/* ══ Sun ══ */}
      <circle cx="1180" cy="100" r="150" fill="url(#ftSunGlow)" />
      <circle cx="1180" cy="100" r="22" fill="#fbbf24" opacity="0.9" className="footer-bg__sun" />
      <circle cx="1180" cy="100" r="15" fill="#fde68a" />
      <circle cx="1180" cy="100" r="9" fill="#fef3c7" opacity="0.6" />
      <g className="footer-bg__rays" opacity="0.3">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
          <line
            key={a}
            x1="1180" y1="100"
            x2={1180 + Math.cos((a * Math.PI) / 180) * 42}
            y2={100 + Math.sin((a * Math.PI) / 180) * 42}
            stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"
          />
        ))}
      </g>

      {/* ══ Clouds ══ */}
      <g className="footer-bg__cloud footer-bg__cloud--1" opacity="0.8">
        <ellipse cx="220" cy="120" rx="50" ry="15" fill="white" />
        <ellipse cx="192" cy="117" rx="30" ry="12" fill="white" />
        <ellipse cx="252" cy="115" rx="34" ry="13" fill="white" />
        <ellipse cx="222" cy="112" rx="36" ry="10" fill="#f4faf5" />
      </g>
      <g className="footer-bg__cloud footer-bg__cloud--2" opacity="0.6">
        <ellipse cx="800" cy="105" rx="40" ry="11" fill="white" />
        <ellipse cx="775" cy="103" rx="25" ry="9" fill="white" />
        <ellipse cx="828" cy="102" rx="28" ry="10" fill="white" />
      </g>
      <g className="footer-bg__cloud footer-bg__cloud--3" opacity="0.5">
        <ellipse cx="1050" cy="150" rx="34" ry="10" fill="white" />
        <ellipse cx="1030" cy="148" rx="22" ry="8" fill="white" />
        <ellipse cx="1072" cy="147" rx="25" ry="9" fill="white" />
      </g>

      {/* ══ Birds ══ */}
      <g className="footer-bg__birds">
        <use href="#ftBird" x="340" y="95" width="14" height="5" opacity="0.5" />
        <use href="#ftBird" x="365" y="88" width="11" height="4" opacity="0.4" />
        <use href="#ftBird" x="900" y="120" width="13" height="5" opacity="0.45" />
        <use href="#ftBird" x="580" y="82" width="12" height="4" opacity="0.4" />
      </g>

      {/* ══ MOUNTAIN LAYER 1 – Far (lightest) ══ */}
      <path
        d="M0 900 L0 280 Q120 220 240 260 Q360 180 480 230 Q560 160 660 200 Q780 130 900 190 Q1020 140 1100 180 Q1200 120 1300 170 Q1380 150 1440 200 L1440 900 Z"
        fill="url(#ftMtn1)" opacity="0.45"
      />
      <path d="M660 200 L648 222 L672 222 Z" fill="white" opacity="0.4" />
      <path d="M900 190 L886 214 L914 214 Z" fill="white" opacity="0.35" />
      <path d="M1300 170 L1286 194 L1314 194 Z" fill="white" opacity="0.35" />

      {/* ══ MOUNTAIN LAYER 2 – Mid ══ */}
      <path
        d="M0 900 L0 360 Q100 310 200 340 Q320 260 440 310 Q520 240 620 280 Q720 210 840 270 Q940 230 1040 260 Q1140 200 1260 250 Q1360 230 1440 280 L1440 900 Z"
        fill="url(#ftMtn2)" opacity="0.7"
      />

      <use href="#ftPine" x="170" y="312" width="14" height="30" opacity="0.5" />
      <use href="#ftPine" x="415" y="282" width="12" height="26" opacity="0.45" />
      <use href="#ftPine" x="600" y="256" width="13" height="28" opacity="0.5" />
      <use href="#ftPine" x="820" y="244" width="12" height="26" opacity="0.45" />
      <use href="#ftPine" x="1020" y="236" width="13" height="28" opacity="0.5" />
      <use href="#ftPine" x="1240" y="224" width="12" height="26" opacity="0.45" />

      <rect x="0" y="290" width="1440" height="40" fill="url(#ftMist)" className="footer-bg__mist" />

      {/* ══ MOUNTAIN LAYER 3 – Front (darker) ══ */}
      <path
        d="M0 900 L0 440 Q80 400 180 420 Q280 350 400 390 Q500 320 600 360 Q680 300 800 350 Q900 310 1000 340 Q1100 280 1220 330 Q1320 310 1440 360 L1440 900 Z"
        fill="url(#ftMtn3)"
      />

      {/* Hikers – positioned along the trail path */}
      {/* Group 1: Lead trekker on trail near left */}
      <g className="footer-bg__hiker footer-bg__hiker--6">
        <use href="#ftHiker" x="160" y="392" width="22" height="40" />
      </g>
      {/* Group 2: Three hikers trekking together mid-left */}
      <g className="footer-bg__hiker footer-bg__hiker--1">
        <use href="#ftHiker" x="480" y="324" width="24" height="42" />
      </g>
      <g className="footer-bg__hiker footer-bg__hiker--2">
        <use href="#ftHiker2" x="510" y="318" width="22" height="38" />
      </g>
      <g className="footer-bg__hiker footer-bg__hiker--3">
        <use href="#ftHiker" x="540" y="322" width="20" height="36" />
      </g>
      {/* Group 3: Pair of trekkers on right ridge */}
      <g className="footer-bg__hiker footer-bg__hiker--4">
        <use href="#ftHiker2" x="1130" y="288" width="22" height="38" />
      </g>
      <g className="footer-bg__hiker footer-bg__hiker--5">
        <use href="#ftHiker" x="1162" y="292" width="20" height="36" />
      </g>


      {/* Front ridge trees */}
      <use href="#ftPine" x="60" y="408" width="18" height="38" opacity="0.75" />
      <use href="#ftPine" x="260" y="368" width="16" height="34" opacity="0.7" />
      <use href="#ftBush" x="340" y="384" width="24" height="14" opacity="0.6" />
      <use href="#ftPine" x="470" y="348" width="17" height="36" opacity="0.75" />
      <use href="#ftBush" x="530" y="354" width="22" height="13" opacity="0.6" />
      <use href="#ftPine" x="680" y="322" width="16" height="34" opacity="0.7" />
      <use href="#ftPine" x="870" y="316" width="18" height="38" opacity="0.75" />
      <use href="#ftBush" x="940" y="330" width="24" height="14" opacity="0.6" />
      <use href="#ftPine" x="1070" y="306" width="16" height="34" opacity="0.7" />
      <use href="#ftPine" x="1300" y="314" width="17" height="36" opacity="0.75" />
      <use href="#ftBush" x="1380" y="338" width="22" height="13" opacity="0.6" />

      {/* ══ FOREGROUND – darkest ══ */}
      <path
        d="M0 900 L0 520 Q60 500 140 510 Q240 470 360 490 Q460 460 560 480 Q660 450 760 470 Q860 440 960 460 Q1060 440 1160 455 Q1260 440 1360 460 Q1400 458 1440 470 L1440 900 Z"
        fill="url(#ftMtn4)"
      />

      {/* Foreground pine silhouettes */}
      <use href="#ftPine" x="30" y="478" width="24" height="50" opacity="0.85" />
      <use href="#ftPine" x="120" y="486" width="20" height="42" opacity="0.8" />
      <use href="#ftBush" x="200" y="494" width="30" height="18" opacity="0.7" />
      <use href="#ftPine" x="320" y="466" width="22" height="46" opacity="0.85" />
      <use href="#ftPine" x="500" y="454" width="20" height="42" opacity="0.8" />
      <use href="#ftBush" x="600" y="462" width="28" height="16" opacity="0.7" />
      <use href="#ftPine" x="730" y="446" width="22" height="46" opacity="0.85" />
      <use href="#ftPine" x="860" y="420" width="24" height="50" opacity="0.85" />
      <use href="#ftBush" x="950" y="438" width="28" height="16" opacity="0.7" />
      <use href="#ftPine" x="1060" y="424" width="20" height="42" opacity="0.8" />
      <use href="#ftPine" x="1180" y="430" width="22" height="46" opacity="0.85" />
      <use href="#ftBush" x="1280" y="438" width="30" height="18" opacity="0.7" />
      <use href="#ftPine" x="1380" y="434" width="20" height="42" opacity="0.8" />

      {/* Fireflies */}
      <circle cx="250" cy="420" r="2.5" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--1" />
      <circle cx="550" cy="380" r="2" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--2" />
      <circle cx="850" cy="360" r="2.5" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--3" />
      <circle cx="1100" cy="390" r="2" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--4" />
      <circle cx="400" cy="450" r="2" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--5" />
      <circle cx="700" cy="410" r="2.5" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--6" />
      <circle cx="1000" cy="370" r="2" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--7" />
      <circle cx="1300" cy="400" r="2.5" fill="url(#ftFirefly)" className="footer-bg__particle footer-bg__particle--8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Footer Component
   ───────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="footer-immersive relative mt-8 overflow-hidden text-sand-100">
      <FooterBg />

      {/* ── Scenic spacer – shows sky + mountains + hikers ── */}
      <div className="relative z-[1] h-[clamp(20rem,36vw,30rem)]" />

      {/* ── Content – gradient top merges with mountain scene ── */}
      <div className="relative z-[2]">
        {/* Gradient overlay that blends into the dark content */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-28 bg-gradient-to-b from-transparent via-[#0d2614]/40 to-[#0d2614]/95" />
        <div className="bg-[#0d2614]/95 backdrop-blur-[2px]">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
          <div className="grid gap-x-6 gap-y-8 border-b border-white/10 pb-6 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1.15fr]">
            {/* Brand column */}
            <div className="pr-4">
              <div className="flex items-start gap-3">
                <img
                  src={siteLogo}
                  alt="Alpha Trekkers logo"
                  className="mt-0.5 h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gold-400">
                    Alpha Trekkers
                  </p>
                  <p className="max-w-xs font-heading text-xl font-semibold leading-snug lg:text-2xl">
                    Monsoon routes, fort trails &amp; weekend getaways.
                  </p>
                </div>
              </div>
              <p className="mt-2 font-accent text-sm text-forest-500/90">
                Trekking through Maharashtra since 2019
              </p>
              <p className="mt-2 max-w-md text-xs leading-5 text-sand-200/70">
                Built for weekend hikers, first-timers, and repeat fort explorers who want strong
                routes, practical planning, and a polished booking flow.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Pune departures', 'Guided trips', 'Monsoon-ready'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-medium text-sand-100/80 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular Escapes */}
            <div>
              <p className="font-heading text-lg font-semibold">Popular Escapes</p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-sand-200/78">
                {destinations.map((place) => (
                  <li key={place.label}>
                    <Link
                      to={place.to}
                      className="group inline-flex items-center gap-1.5 transition-colors hover:text-forest-500"
                    >
                      <span>{place.label}</span>
                      <ArrowRight className="h-3 w-3 text-sand-200/36 transition group-hover:translate-x-0.5 group-hover:text-forest-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Access */}
            <div>
              <p className="font-heading text-lg font-semibold">Quick Access</p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-sand-200/76">
                {companyLinks.map((link) => (
                  <li key={`${link.to}-${link.label}`}>
                    <Link to={link.to} className="transition-colors hover:text-forest-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stay in the Loop */}
            <div>
              <p className="font-heading text-lg font-semibold">Stay in the Loop</p>
              <div className="mt-2.5 space-y-2 text-xs text-sand-200/76">
                <p className="flex items-start gap-2">
                  <MapPinLine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-500" />
                  Pune base, departures across the Sahyadri circuit
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 shrink-0 text-forest-500" />
                  +91 98765 43210
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeSimple className="h-3.5 w-3.5 shrink-0 text-forest-500" />
                  hello@alphatrekkers.com
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sand-100 transition-all duration-300 hover:border-gold-400/40 hover:bg-white/12 hover:text-gold-400 hover:shadow-[0_0_18px_rgba(251,191,36,0.15)]"
                  >
                    <Icon className="h-3.5 w-3.5" weight="fill" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[11px] text-sand-200/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Alpha Trekkers. All rights reserved.</p>
            <p>Monsoon-inspired adventure experiences across Maharashtra.</p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
