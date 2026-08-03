"use client";

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "971547219791";

/**
 * Fixed bottom-right WhatsApp launcher. Shared so every page gets the same
 * button instead of each page reimplementing its own copy (Home and the
 * quotation page had it; Collections and About didn't).
 */
export default function FloatingWhatsApp({
  message = "Hello, I would like to know more about your curtain collections.",
}) {
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={openWhatsApp}
      className="
        fixed bottom-6 right-6 z-50
        w-16 h-16
        rounded-full
        bg-[#25D366]
        text-white
        flex items-center justify-center
        shadow-2xl
        hover:scale-110
        hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)]
        transition-all duration-300
      "
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </button>
  );
}
