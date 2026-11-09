import React, { useState } from 'react';
import { Crown, Check, Mail, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-r from-[#0E0E12] via-[#1A120E] to-[#0A0A0C] border-t border-b border-[#D4AF37]/30">
      {/* Background ambient lighting & Islamic Girih */}
      <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/12 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#121217] border-2 border-[#D4AF37] flex items-center justify-center text-[#F3CD68] shadow-[0_0_25px_rgba(212,175,55,0.35)]">
          <Crown className="w-7 h-7" />
        </div>

        <span className="font-serif-royal text-xs uppercase tracking-[0.3em] text-[#F3CD68] block mb-2 font-bold">
          The Arabian Royal Inner Sanctum
        </span>

        <h2 className="font-serif-royal text-3xl sm:text-5xl text-[#FAF6F0] font-bold tracking-wide mb-4">
          <span className="text-gold-gradient">Join the Royal Connoisseurs Circle</span>
        </h2>

        <p className="font-editorial text-lg sm:text-xl text-[#E2D6C9] italic max-w-xl mx-auto mb-8">
          Subscribe to receive private Arabian oud reserve allocations, welcoming voucher, and invitations to secret fragrance salons.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto p-4 bg-[#121217] border border-[#D4AF37]/60 rounded-xs text-[#D4AF37] flex items-center justify-center gap-3">
            <Check className="w-5 h-5 text-[#D4AF37]" />
            <div className="text-left">
              <p className="font-serif-royal font-bold text-xs uppercase tracking-wider">
                Welcome to Royalty
              </p>
              <p className="text-[11px] text-[#FAF6F0]/85">
                Your 10% voucher code <strong className="text-[#F3CD68]">ROYAL10</strong> is active for your order!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-[#D4AF37]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your royal email..."
                className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] pl-10 pr-4 py-3.5 rounded-xs focus:outline-none focus:border-[#D4AF37] placeholder-[#AA8435]/60"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] font-serif-royal font-bold text-xs uppercase tracking-[0.2em] px-6 py-3.5 rounded-xs hover:shadow-[0_4px_18px_rgba(212,175,55,0.4)] transition-all whitespace-nowrap"
            >
              Enlist
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-6 mt-6 text-[11px] text-[#D4C3B3]/60 font-sans-body">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> No Spam, Only Pure Luxury
          </span>
          <span>·</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </section>
  );
};
