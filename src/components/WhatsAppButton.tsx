import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const phoneNumber = '8801648861141';
  const prefilledMessage = encodeURIComponent(
    "Hello Ismail, I visited your portfolio and I'm interested in discussing an AI UGC video project for my brand."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      {/* Floating Interactive Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#171C19] border border-[#2A332B] rounded-lg shadow-xl text-xs text-[#F5F5F0] animate-fade-in">
          <span>Chat directly with Ismail</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#A0A89F] hover:text-[#F5F5F0]"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 border-2 border-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer group"
        aria-label="Chat on WhatsApp with Ismail Sarder (+8801648861141)"
      >
        <MessageSquare className="w-7 h-7 fill-current transform group-hover:scale-110 transition-transform" />
      </a>
    </aside>
  );
};
