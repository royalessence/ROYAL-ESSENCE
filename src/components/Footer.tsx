import React from 'react';
import { RoyalLogo } from './RoyalLogo';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { FragranceCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: FragranceCategory) => void;
  onOpenScentFinder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenScentFinder }) => {
  return (
    <footer className="bg-gradient-to-b from-[#0A0A0C] via-[#0E0E12] to-[#070709] border-t border-[#D4AF37]/30 text-[#FAF6F0] pt-12 sm:pt-16 pb-12 sm:pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-girih opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#D4AF37]/20">
          {/* Column 1: Brand & Manifesto (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <RoyalLogo size="lg" showTagline={true} />
            <p className="font-editorial text-sm sm:text-base text-[#D4C3B3] italic leading-relaxed pt-2">
              ROYAL ESSENCE — Experience the Royal Fragrance. Featuring our signature collection: OSCAR, Reef 21,
              and Reef 33. Each fragrance arrives with its original presentation bottle and packaging for ৳300 BDT.
            </p>
            <div className="pt-2 text-xs text-[#D4AF37] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F3CD68]" />
              <span>100% Authentic with Original Presentation Boxes</span>
            </div>
          </div>

          {/* Column 2: Fragrances (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-royal text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Our Fragrances (৳300)
            </h4>
            <ul className="space-y-2 text-xs font-sans-body text-[#D4C3B3]/85">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#F3CD68] transition-colors"
                >
                  OSCAR (Gold Flacon & Crystal Crown) — ৳300
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#F3CD68] transition-colors"
                >
                  Reef 21 (Black Bottle with Pom-Pom) — ৳300
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#F3CD68] transition-colors"
                >
                  Reef 33 (Emerald Calligraphy Box) — ৳300
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenScentFinder}
                  className="hover:text-[#FFF2D6] transition-colors text-left text-[#D4AF37]"
                >
                  Fragrance Selection Advisor
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Delivery in Bangladesh (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif-royal text-xs font-bold uppercase tracking-[0.22em] text-[#D4AF37]">
              Order & Delivery (Bangladesh)
            </h4>
            <div className="space-y-3 text-xs font-sans-body text-[#D4C3B3]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#FAF6F0] block font-serif-royal">Dhaka Distribution Hub</strong>
                  <span>Gulshan & Banani, Dhaka, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+880 1711 000 777 (Royal Customer Support)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>orders@royalessence.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans-body text-[#D4C3B3]/70">
          <div>
            <p>
              © 2026 <strong className="text-[#D4AF37] font-serif-royal">ROYAL ESSENCE</strong>. Experience the Royal Fragrance. All Rights Reserved.
            </p>
          </div>

          {/* Accepted Bangladesh Payment Options */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#AA8435] uppercase tracking-wider font-serif-royal font-bold">
              Payment in Bangladesh:
            </span>
            <div className="flex items-center gap-2 text-[10px] text-[#FAF6F0]">
              <span className="bg-[#121217] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-xs">bKash</span>
              <span className="bg-[#121217] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-xs">Nagad</span>
              <span className="bg-[#121217] border border-[#D4AF37]/35 px-2.5 py-0.5 rounded-xs">Rocket</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
