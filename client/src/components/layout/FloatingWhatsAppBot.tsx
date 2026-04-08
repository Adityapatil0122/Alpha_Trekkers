import { useMemo } from 'react';
import { WhatsappLogo } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

const whatsappNumber = '919876543210';

const pageTopics: Record<string, string> = {
  '/': 'Hi Alpha Trekkers, I am exploring trips on your website.',
  '/trips': 'Hi Alpha Trekkers, I want help choosing the right trek.',
  '/about': 'Hi Alpha Trekkers, I want to know more about Alpha Trekkers.',
  '/contact': 'Hi Alpha Trekkers, I want to plan my trek on WhatsApp.',
};

export default function FloatingWhatsAppBot() {
  const location = useLocation();

  const whatsappHref = useMemo(() => {
    const text = pageTopics[location.pathname] ?? 'Hi Alpha Trekkers, I would like help planning my next trek.';
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  }, [location.pathname]);

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition hover:-translate-y-1 hover:bg-[#1fbe5b]"
        aria-label="Chat on WhatsApp"
      >
        <WhatsappLogo className="h-7 w-7" weight="fill" />
      </a>
    </div>
  );
}
