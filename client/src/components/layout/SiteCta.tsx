import { Link } from 'react-router-dom';
import { Mountains, PaperPlaneTilt } from '@phosphor-icons/react';

export default function SiteCta() {
  return (
    <section className="relative pt-8">
      <div className="mountain-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="h-full w-full">
          <polygon
            points="0,70 80,56 154,66 268,28 346,44 428,12 535,36 640,18 722,42 816,20 922,46 1006,26 1130,44 1236,24 1330,40 1440,22 1440,140 0,140"
            className="mountain-divider__ridge mountain-divider__ridge--back"
          />
          <polygon
            points="0,92 70,84 148,94 256,50 340,74 436,38 550,74 646,28 744,68 846,34 930,66 1048,32 1140,62 1280,40 1366,58 1440,48 1440,140 0,140"
            className="mountain-divider__ridge mountain-divider__ridge--mid"
          />
          <polygon
            points="0,110 82,104 156,110 282,74 360,96 472,64 586,92 690,60 800,94 906,60 1020,96 1132,62 1246,94 1360,74 1440,88 1440,140 0,140"
            className="mountain-divider__ridge mountain-divider__ridge--front"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="cta-banner relative overflow-hidden rounded-[1.65rem] px-8 py-10 sm:px-10 lg:px-12">
          <div className="cta-banner__pattern" aria-hidden="true" />
          <div className="cta-banner__flight" aria-hidden="true">
            <svg viewBox="0 0 420 150" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M14 122 C78 40, 164 24, 198 66 C226 100, 206 118, 228 126 C262 138, 276 104, 290 76 C314 26, 354 22, 406 8"
                className="cta-banner__flight-path"
              />
            </svg>
            <PaperPlaneTilt className="cta-banner__flight-plane h-5 w-5" weight="fill" />
          </div>

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border border-white/18 bg-white/8 text-white">
                <Mountains className="h-11 w-11" weight="regular" />
              </div>
              <div>
                <p className="playful-text text-gold-400">~ adventure awaits ~</p>
                <h2 className="max-w-3xl font-body text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Ready To Trek Through Monsoon Trails?
                </h2>
                <p className="mt-3 max-w-2xl text-lg text-sand-100/72">
                  Book your next Sahyadri monsoon trek with expert guides, rain-ready routes, and
                  views that only the rains can reveal.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="relative z-10 inline-flex min-h-16 items-center justify-center rounded-xl bg-white px-8 text-base font-semibold uppercase tracking-[0.08em] text-forest-500 shadow-[0_18px_36px_rgba(0,0,0,0.12)] transition hover:bg-sand-50"
            >
              LET&apos;S GET STARTED
            </Link>
          </div>

          <svg
            viewBox="0 0 1200 62"
            preserveAspectRatio="none"
            className="cta-banner__edge absolute bottom-0 left-0 h-8 w-full"
            aria-hidden="true"
          >
            <path
              d="M0 22 C26 28, 52 8, 78 18 C104 28, 130 12, 156 20 C182 28, 208 10, 234 18 C260 26, 286 12, 312 20 C338 28, 364 10, 390 16 C416 22, 442 8, 468 18 C494 28, 520 12, 546 20 C572 28, 598 8, 624 18 C650 28, 676 14, 702 20 C728 26, 754 8, 780 18 C806 28, 832 14, 858 20 C884 26, 910 8, 936 18 C962 28, 988 10, 1014 18 C1040 26, 1066 10, 1092 16 C1118 22, 1144 8, 1170 16 C1188 22, 1194 16, 1200 18 L1200 62 L0 62 Z"
              className="cta-banner__edge-fill"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
