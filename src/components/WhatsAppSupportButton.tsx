import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Sparkles } from 'lucide-react';

interface WhatsAppSupportButtonProps {
  whatsappNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppSupportButton: React.FC<WhatsAppSupportButtonProps> = ({
  whatsappNumber = '01741129399',
  defaultMessage = 'Hello ROYAL ESSENCE! I need assistance with your perfume collection.',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize WhatsApp number for international wa.me standard
  // e.g. "01741129399" -> "8801741129399"
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
  const formattedNumber = cleanNumber.startsWith('880')
    ? cleanNumber
    : cleanNumber.startsWith('0')
    ? `88${cleanNumber}`
    : `880${cleanNumber}`;

  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Expanded Quick Message Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-gradient-to-b from-[#062419] via-[#0A1A2E] to-[#140812] border border-[#D4AF37]/60 rounded-t-[20px] rounded-b-xs p-4 shadow-[0_15px_45px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#D4AF37]/25">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981]">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="font-serif-royal font-bold text-xs text-white uppercase tracking-wider">
                  Royal Concierge
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-[#34D399]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Online · WhatsApp Help</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#EED9C4]/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body message preview */}
          <div className="py-3">
            <p className="text-[11px] text-[#EED9C4]/90 font-sans-body leading-relaxed bg-[#03100B]/80 p-2.5 rounded-xs border border-[#10B981]/30">
              Assalamu Alaikum! Have questions regarding <strong className="text-[#F3CD68]">OSCAR</strong>, <strong className="text-[#F3CD68]">Reef 21</strong>, or <strong className="text-[#F3CD68]">Reef 33</strong>? Our fragrance concierges are ready on WhatsApp.
            </p>
            <div className="mt-2 text-[10px] text-[#AA8435] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Official Support: +88 {whatsappNumber}</span>
            </div>
          </div>

          {/* Action button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] hover:from-[#34D399] hover:to-[#059669] text-white font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs shadow-[0_4px_15px_rgba(16,185,129,0.35)] transition-all"
          >
            <span>Start WhatsApp Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        {/* Pulsing Emerald/Gold Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-[#10B981] opacity-75 blur-sm group-hover:opacity-100 animate-pulse transition duration-500" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat with ROYAL ESSENCE on WhatsApp"
          className="relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#062419] to-[#041410] border-2 border-[#D4AF37] text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md">
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F3CD68] border border-black animate-ping" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="font-serif-royal font-black text-xs text-white uppercase tracking-wider leading-none">
              WhatsApp Help
            </span>
            <span className="text-[10px] text-[#F3CD68] font-mono leading-tight mt-0.5">
              {whatsappNumber}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
