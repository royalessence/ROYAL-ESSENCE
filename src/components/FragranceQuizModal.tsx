import React, { useState } from 'react';
import { Perfume, VolumeOption } from '../types';
import { X, Compass, Sparkles, ArrowRight, RotateCcw, ShoppingBag, Check } from 'lucide-react';
import { FragranceDetailsSection } from './FragranceDetailsSection';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface FragranceQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onAddToCart: (perfume: Perfume, volume: VolumeOption) => void;
  onBuyNow: (perfume: Perfume, volume: VolumeOption) => void;
}

export const FragranceQuizModal: React.FC<FragranceQuizModalProps> = ({
  isOpen,
  onClose,
  perfumes,
  onAddToCart,
  onBuyNow,
}) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [scentMood, setScentMood] = useState<'amber' | 'bold' | 'fresh'>('amber');
  const [matchedPerfume, setMatchedPerfume] = useState<Perfume | null>(null);

  if (!isOpen) return null;

  const handleCompleteQuiz = () => {
    let match = perfumes.find((p) => {
      const id = p.id.toLowerCase();
      const name = p.name.toLowerCase();
      if (scentMood === 'fresh') return id === 'oscar' || id === 'osama-woody-f' || name.includes('oscar');
      if (scentMood === 'bold') return id === 'reef-21' || name.includes('21');
      return id === 'reef-33' || name.includes('33') || id === 'reef-2';
    });

    if (!match) {
      match = perfumes[0];
    }

    setMatchedPerfume(match);
    setStep(3); // Results step
  };

  const handleReset = () => {
    setStep(1);
    setMatchedPerfume(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-[#0C0B08] border border-[#D4AF37]/50 max-w-xl w-full p-6 sm:p-8 rounded-xs shadow-[0_20px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F5EBDD]/60 hover:text-[#D4AF37] p-1.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#151410] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-serif-royal text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]">
            ROYAL ESSENCE Concierge
          </span>
          <h3 className="font-serif-royal text-xl sm:text-2xl font-bold text-[#FFFFFF] mt-1">
            Discover Your Signature Fragrance
          </h3>
          {step <= 2 && (
            <p className="text-xs text-[#F5EBDD]/60 mt-1">
              Step {step} of 2 · Quick 30-Second Advisor
            </p>
          )}
        </div>

        {/* Step 1: Preferred Style */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-editorial italic text-center text-[#F5EBDD]/90">
              Select your preferred scent profile:
            </p>
            <div className="space-y-2.5">
              {[
                { key: 'amber', label: 'Warm Royal Emerald Oud & Saffron (Reef 33)', desc: 'Sensual, aged Cambodian oud, sweet saffron, and warm royal amber' },
                { key: 'bold', label: 'Dark Woods & Smoky Leather (Reef 21)', desc: 'Bold, masculine, confident, and deeply magnetic with black velvet tassel' },
                { key: 'fresh', label: 'Sculpted Golden Amber & Bergamot (Oscar)', desc: 'Radiant Italian citrus, golden amber, tonka bean, and fine cashmere' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setScentMood(opt.key as any)}
                  className={`w-full p-3.5 text-left border rounded-xs transition-all ${
                    scentMood === opt.key
                      ? 'bg-[#181610] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#11100C] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-royal text-sm font-bold text-[#FFFFFF]">
                      {opt.label}
                    </span>
                    {scentMood === opt.key && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <p className="text-xs text-[#F5EBDD]/60 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#050505] font-serif-royal font-bold text-xs uppercase tracking-wider py-3 rounded-xs flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Occasion */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-editorial italic text-center text-[#F5EBDD]/90">
              For which occasion?
            </p>
            <div className="space-y-2.5">
              {[
                { key: 'unisex', label: 'All-Day Signature Wear', desc: 'Versatile, compliment-pulling, long-lasting performance' },
                { key: 'men', label: 'Evening & Night Out', desc: 'Commanding projection and intense sillage' },
                { key: 'women', label: 'Daily Office & Casual Elegance', desc: 'Fresh, balanced, uplifting throughout the day' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setRecipient(opt.key as any)}
                  className={`w-full p-3.5 text-left border rounded-xs transition-all ${
                    recipient === opt.key
                      ? 'bg-[#181610] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-[#11100C] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-royal text-sm font-bold text-[#FFFFFF]">
                      {opt.label}
                    </span>
                    {recipient === opt.key && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </div>
                  <p className="text-xs text-[#F5EBDD]/60 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 border border-[#D4AF37]/40 text-[#F5EBDD] font-serif-royal text-xs uppercase rounded-xs"
              >
                Back
              </button>
              <button
                onClick={handleCompleteQuiz}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] font-serif-royal font-bold text-xs uppercase tracking-wider py-3 rounded-xs flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,55,0.4)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Show My Match</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && matchedPerfume && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="p-4 bg-[#14120D] border border-[#D4AF37]/40 rounded-xs flex gap-4 items-center">
              {matchedPerfume.image && matchedPerfume.image.trim() !== '' ? (
                <img
                  src={matchedPerfume.image}
                  alt={matchedPerfume.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 object-contain rounded-xs border border-[#D4AF37]/30 shrink-0 bg-[#070604] p-1"
                />
              ) : (
                <div className="w-24 h-24 shrink-0">
                  <ProductImagePlaceholder name={matchedPerfume.name} size="sm" className="w-full h-full p-1" />
                </div>
              )}
              <div>
                <span className="text-[10px] text-[#D4AF37] font-serif-royal uppercase tracking-wider">
                  Top Recommended Fragrance
                </span>
                <h4 className="font-serif-royal text-lg font-bold text-[#FFFFFF]">
                  {matchedPerfume.name}
                </h4>
                <p className="text-xs text-[#F5EBDD]/70 italic line-clamp-1">
                  {matchedPerfume.subtitle}
                </p>
                <div className="mt-2 text-base font-serif-royal font-bold text-[#D4AF37] tabular-nums">
                  ৳{matchedPerfume.prices['100 ML'] || 300} BDT
                </div>
              </div>
            </div>

            <p className="text-xs text-[#F5EBDD]/80 leading-relaxed font-sans-body">
              {matchedPerfume.description}
            </p>

            {/* Universal Fragrance Profile Details */}
            <FragranceDetailsSection product={matchedPerfume} compact={true} />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onAddToCart(matchedPerfume, '100 ML');
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-3 bg-[#181610] border border-[#D4AF37] text-[#D4AF37] font-serif-royal text-xs font-bold uppercase rounded-xs hover:bg-[#221F16]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add 100 ML · ৳{matchedPerfume.prices['100 ML'] || 300}</span>
              </button>

              <button
                onClick={() => {
                  onBuyNow(matchedPerfume, '100 ML');
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA8435] text-[#050505] font-serif-royal text-xs font-bold uppercase rounded-xs shadow-[0_4px_15px_rgba(212,175,55,0.4)]"
              >
                <span>Instant Buy Now</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full text-center text-[11px] text-[#F5EBDD]/50 hover:text-[#D4AF37] flex items-center justify-center gap-1.5 pt-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retake Advisor</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
