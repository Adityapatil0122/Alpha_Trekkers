import { ArrowRight } from '@phosphor-icons/react';

export default function SiteCta() {
  return (
    <section className="bg-white px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12 xl:px-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-dark-900 py-14 lg:py-16">
        <img
          src="/destinations/rajgad.png"
          alt="Adventure camp in the hills"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.9),rgba(15,23,42,0.72),rgba(15,23,42,0.38))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.26),rgba(15,23,42,0.12),rgba(15,23,42,0.42))]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="max-w-3xl">
              <p className="playful-text text-xl text-primary-400">Explore the world</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight !text-white sm:text-4xl lg:text-[2.75rem]">
                Ready To Travel With Real Adventure &amp; Enjoy Natural
              </h2>
              <a
                href="mailto:contact@alphatrekkers.com"
                className="mt-6 inline-flex items-center gap-3 py-2.5 text-sm font-medium text-white transition hover:text-primary-300"
              >
                <span>Contact us</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </div>

            <div className="relative hidden min-h-[18rem] lg:block">
              <div className="absolute left-10 top-0 h-24 w-24 overflow-hidden rounded-full border-2 border-white/50 shadow-xl">
                <img
                  src="/destinations/torna.png"
                  alt="Camp view"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute right-8 top-0 h-28 w-28 overflow-hidden rounded-full border-2 border-white/50 shadow-xl">
                <img
                  src="/destinations/lohagad.png"
                  alt="Fort summit"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-1/2 top-10 h-[13rem] w-[10.5rem] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-white/40 shadow-2xl">
                <img
                  src="/destinations/rajmachi.png"
                  alt="Hiker in the valley"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-6 h-24 w-24 overflow-hidden rounded-[1.4rem] border border-white/30 shadow-xl">
                <img
                  src="/destinations/kalsubai.png"
                  alt="Tent at sunrise"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute left-[54%] top-3 h-32 w-44 -translate-x-1/2 opacity-80">
                <svg viewBox="0 0 180 130" className="h-full w-full">
                  <path
                    d="M16 118 C24 68, 72 28, 112 46 C136 58, 126 88, 138 100 C150 112, 162 100, 166 74"
                    fill="none"
                    stroke="rgba(255,255,255,0.62)"
                    strokeWidth="2"
                    strokeDasharray="5 6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-white">
                ✈
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
