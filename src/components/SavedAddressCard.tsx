import React from 'react';
import { SavedAddress, AddressLabel } from '../types';
import { Home, Building2, MapPin, Check, Star, Edit3, Trash2, Phone, Compass } from 'lucide-react';

interface SavedAddressCardProps {
  address: SavedAddress;
  isSelected?: boolean;
  onSelect?: (address: SavedAddress) => void;
  onEdit?: (address: SavedAddress) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const SavedAddressCard: React.FC<SavedAddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  showActions = true,
  compact = false,
}) => {
  const getLabelIcon = (label: AddressLabel) => {
    switch (label) {
      case 'Home':
        return <Home className="w-3.5 h-3.5 text-[#F3CD68]" />;
      case 'Office':
        return <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'Other':
      default:
        return <MapPin className="w-3.5 h-3.5 text-[#A7F3D0]" />;
    }
  };

  const getLabelBadgeStyle = (label: AddressLabel) => {
    switch (label) {
      case 'Home':
        return 'bg-[#2A1806] border-[#D4AF37]/50 text-[#F3CD68]';
      case 'Office':
        return 'bg-[#081F30] border-[#38BDF8]/40 text-[#7DD3FC]';
      case 'Other':
      default:
        return 'bg-[#0A261E] border-[#10B981]/40 text-[#6EE7B7]';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(address)}
      className={`relative rounded-xs border transition-all duration-200 select-none ${
        compact ? 'p-3' : 'p-4'
      } ${
        isSelected
          ? 'bg-gradient-to-br from-[#0F281E] via-[#0A1D36] to-[#1E0E1B] border-[#F3CD68] shadow-[0_0_25px_rgba(243,205,104,0.3)] ring-1 ring-[#F3CD68]'
          : 'bg-[#0A1420]/80 hover:bg-[#0D1929] border-[#D4AF37]/30 hover:border-[#D4AF37]/70 shadow-md'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Top Header: Label Badge, Default Badge & Selection Radio */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-2xs text-[10px] font-serif-royal font-bold uppercase tracking-wider border ${getLabelBadgeStyle(
              address.label
            )}`}
          >
            {getLabelIcon(address.label)}
            <span>{address.customLabel || address.label}</span>
          </span>

          {address.isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-2xs text-[9px] font-serif-royal font-bold uppercase tracking-wider bg-[#2B1F08] border border-[#F3CD68]/60 text-[#F3CD68]">
              <Star className="w-2.5 h-2.5 fill-[#F3CD68]" />
              <span>Default Address</span>
            </span>
          )}
        </div>

        {/* Selection indicator */}
        {onSelect && (
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] border-white text-black shadow-sm'
                : 'border-[#D4AF37]/40 bg-[#030910]'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-black" />}
          </div>
        )}
      </div>

      {/* Customer Name & Phone */}
      <div className="mb-2">
        <h4 className="font-serif-royal font-bold text-sm text-[#FFFFFF] tracking-wide flex items-center gap-2">
          <span>{address.fullName}</span>
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-[#EED9C4]/80 font-mono mt-0.5">
          <Phone className="w-3 h-3 text-[#AA8435]" />
          <span>{address.phone}</span>
        </div>
      </div>

      {/* Full Delivery Address Details */}
      <div className="space-y-1 text-xs text-[#F5EBDD]/90 font-sans-body mb-3">
        <p className="font-medium text-white line-clamp-2">{address.roadVillageHouse}</p>

        {address.area && (
          <p className="text-[11px] text-[#EED9C4]/70">Area: {address.area}</p>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-[#34D399] font-medium">
          <Compass className="w-3 h-3 text-[#34D399]" />
          <span>
            {address.upazila}, {address.district}
            {address.postalCode ? ` (Post: ${address.postalCode})` : ''}
          </span>
        </div>

        {address.instructions && (
          <p className="text-[10px] text-[#EED9C4]/60 italic pt-1 border-t border-[#D4AF37]/15">
            Note: {address.instructions}
          </p>
        )}
      </div>

      {/* Actions / "Use This Address" Button */}
      {showActions && (
        <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between gap-2 flex-wrap">
          {onSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(address);
              }}
              className={`px-3 py-1.5 rounded-2xs font-serif-royal font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#10B981] text-black hover:bg-[#059669]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black hover:from-[#F3CD68] hover:to-[#C2983E] shadow-sm'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSelected ? 'Selected Address' : 'Use This Address'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {!address.isDefault && onSetDefault && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetDefault(address.id);
                }}
                className="px-2 py-1 text-[10px] text-[#F3CD68]/80 hover:text-[#F3CD68] font-serif-royal uppercase border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xs transition-colors"
                title="Set as Default Address"
              >
                Set Default
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="p-1.5 text-[#EED9C4]/70 hover:text-[#F3CD68] border border-[#D4AF37]/25 hover:border-[#F3CD68] rounded-2xs transition-colors"
                title="Edit Address"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(address.id);
                }}
                className="p-1.5 text-red-400/70 hover:text-red-400 border border-red-500/25 hover:border-red-500/60 rounded-2xs transition-colors"
                title="Delete Address"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
