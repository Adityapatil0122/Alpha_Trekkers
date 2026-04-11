import { ArrowRight } from '@phosphor-icons/react';

const siteCtaImage = `/destinations/${encodeURIComponent('Exploring ancient forts in the sunshine.png')}`;

export default function SiteCta() {
  return (
    <section className="bg-white px-4 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-12 xl:px-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-dark-900 py-8 lg:py-9">
        <img
          src="/destinations/rajgad.png"
          alt="Adventure camp in the hills"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,24,0.9),rgba(8,12,24,0.76),rgba(8,12,24,0.48))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,24,0.42),rgba(8,12,24,0.2),rgba(8,12,24,0.58))]" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="max-w-3xl">
              <p className="playful-text text-xl text-primary-400">Explore the world</p>
              <h2 className="mt-3 text-[1.75rem] font-extrabold leading-tight !text-white sm:text-[2.2rem] lg:text-[2.5rem]">
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

            <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
              <div className="absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-full bg-white/12 blur-3xl" />
              <img
                src={siteCtaImage}
                alt="Explorer standing beside an ancient fort"
                className="relative z-10 w-full object-contain drop-shadow-[0_22px_44px_rgba(0,0,0,0.28)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
