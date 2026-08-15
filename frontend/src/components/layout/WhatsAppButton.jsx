import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const phoneNumber = "919866074638";

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 sm:bottom-24 sm:right-4 z-50 bg-[#25D366] text-white p-2 sm:p-3 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-[20px] sm:text-[24px]" />

      {/* Tooltip on hover (desktop only) */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#12344D] text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
        Chat with us!
        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
      </span>
    </a>
  );
}
