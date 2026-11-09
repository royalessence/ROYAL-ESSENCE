import React, { useState } from 'react';
import { SavedAddress, AddressLabel, CustomerAccount } from '../types';
import { SavedAddressCard } from './SavedAddressCard';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import {
  X,
  Plus,
  MapPin,
  Home,
  Building2,
  Check,
  ShieldCheck,
  User,
  Star,
  Search,
  Sparkles,
} from 'lucide-react';
import { RoyalLogo } from './RoyalLogo';

interface SavedAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddresses: SavedAddress[];
  onSaveAddress: (address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onSelectAddress?: (address: SavedAddress) => void;
  selectedAddressId?: string;
  customer: CustomerAccount;
  onOpenAccountModal?: () => void;
}

export const SavedAddressesModal: React.FC<SavedAddressesModalProps> = ({
  isOpen,
  onClose,
  savedAddresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onSelectAddress,
  selectedAddressId,
  customer,
  onOpenAccountModal,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTabLabel, setActiveTabLabel] = useState<'ALL' | AddressLabel>('ALL');

  // Form Fields
  const [formLabel, setFormLabel] = useState<AddressLabel>('Home');
  const [formCustomLabel, setFormCustomLabel] = useState('');
  const [formFullName, setFormFullName] = useState(customer.name || '');
  const [formPhone, setFormPhone] = useState(customer.phone || '');
  const [formDivision, setFormDivision] = useState('Dhaka');
  const [formDistrict, setFormDistrict] = useState('Dhaka');
  const [formUpazila, setFormUpazila] = useState('Banani');
  const [formArea, setFormArea] = useState('');
  const [formRoadVillageHouse, setFormRoadVillageHouse] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('1213');
  const [formInstructions, setFormInstructions] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const currentDivData =
    BANGLADESH_LOCATIONS.divisions[formDivision] || BANGLADESH_LOCATIONS.divisions['Dhaka'];
  const districtList = currentDivData ? Object.keys(currentDivData.districts) : [];
  const currentDistData = currentDivData
    ? currentDivData.districts[formDistrict] || currentDivData.districts[districtList[0]]
    : undefined;
  const upazilaList = currentDistData?.upazilas || [];

  const handleStartAdd = () => {
    setEditingAddress(null);
    setFormLabel('Home');
    setFormCustomLabel('');
    setFormFullName(customer.name || '');
    setFormPhone(customer.phone || '');
    setFormDivision('Dhaka');
    setFormDistrict('Dhaka');
    setFormUpazila('Banani');
    setFormArea('');
    setFormRoadVillageHouse('');
    setFormPostalCode('1213');
    setFormInstructions('');
    setFormIsDefault(savedAddresses.length === 0);
    setPhoneError('');
    setIsFormOpen(true);
  };

  const handleStartEdit = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setFormLabel(addr.label);
    setFormCustomLabel(addr.customLabel || '');
    setFormFullName(addr.fullName);
    setFormPhone(addr.phone);
    setFormDivision(addr.division);
    setFormDistrict(addr.district);
    setFormUpazila(addr.upazila);
    setFormArea(addr.area || '');
    setFormRoadVillageHouse(addr.roadVillageHouse);
    setFormPostalCode(addr.postalCode);
    setFormInstructions(addr.instructions || '');
    setFormIsDefault(!!addr.isDefault);
    setPhoneError('');
    setIsFormOpen(true);
  };

  const handleDivisionChange = (newDiv: string) => {
    setFormDivision(newDiv);
    const newDivData = BANGLADESH_LOCATIONS.divisions[newDiv];
    if (newDivData) {
      const firstDist = Object.keys(newDivData.districts)[0] || 'Dhaka';
      setFormDistrict(firstDist);
      const firstUpazila = newDivData.districts[firstDist]?.upazilas[0] || 'Sadar';
      setFormUpazila(firstUpazila);
      setFormPostalCode(newDivData.districts[firstDist]?.defaultPostalCode || '1000');
    }
  };

  const handleDistrictChange = (newDist: string) => {
    setFormDistrict(newDist);
    const distData = currentDivData?.districts[newDist];
    if (distData) {
      setFormUpazila(distData.upazilas[0] || 'Sadar');
      setFormPostalCode(distData.defaultPostalCode || '1000');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    const cleaned = formPhone.replace(/[^0-9]/g, '');
    if (cleaned.length !== 11 || !cleaned.startsWith('01')) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    if (!formFullName.trim() || !formRoadVillageHouse.trim()) {
      return;
    }

    onSaveAddress(
      {
        customerId: customer.id,
        label: formLabel,
        customLabel: formLabel === 'Other' && formCustomLabel.trim() ? formCustomLabel.trim() : undefined,
        fullName: formFullName.trim(),
        phone: cleaned,
        division: formDivision,
        district: formDistrict,
        upazila: formUpazila,
        area: formArea.trim() || undefined,
        roadVillageHouse: formRoadVillageHouse.trim(),
        postalCode: formPostalCode.trim(),
        instructions: formInstructions.trim() || undefined,
        isDefault: formIsDefault,
      },
      editingAddress ? editingAddress.id : undefined
    );

    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const filteredAddresses = savedAddresses.filter((a) => {
    if (activeTabLabel !== 'ALL' && a.label !== activeTabLabel) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      a.fullName.toLowerCase().includes(q) ||
      a.phone.includes(q) ||
      a.district.toLowerCase().includes(q) ||
      a.upazila.toLowerCase().includes(q) ||
      a.roadVillageHouse.toLowerCase().includes(q) ||
      (a.area && a.area.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#070709]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#0A0A0C] border border-[#D4AF37]/50 rounded-t-[32px] rounded-b-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#AA8435] via-[#F3CD68] to-[#D4AF37]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#D4AF37]/25 flex items-center justify-between bg-[#0E0E12]/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1A120E] border border-[#D4AF37]/45 rounded-xs text-[#F3CD68]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-royal font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                MY SAVED ADDRESSES
              </h2>
              <span className="text-xs text-[#EED9C4]/80 block font-sans-body">
                Manage Delivery Locations & Select in One Click at Checkout
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#EED9C4]/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Account & Sync Status Bar */}
        <div className="px-5 py-2.5 bg-[#04121F] border-b border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#EED9C4]">
              Account: <strong className="text-white">{customer.name}</strong> ({customer.phone})
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-2xs font-mono">
              ✓ Synced
            </span>
          </div>

          {onOpenAccountModal && (
            <button
              onClick={onOpenAccountModal}
              className="text-[11px] text-[#F3CD68] hover:underline font-serif-royal uppercase font-semibold"
            >
              Switch Account / Login →
            </button>
          )}
        </div>

        {/* Sub-Header: Search, Filter Tabs & "+ Add New Address" Button */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/20 bg-[#081524]/60 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search addresses by district, thana or address..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#030910] border border-[#D4AF37]/35 text-xs text-white pl-9 pr-3 py-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
              />
            </div>

            {/* "+ Add New Address" Button */}
            <button
              type="button"
              onClick={handleStartAdd}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-102 transition-all shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Label Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pt-1">
            {(['ALL', 'Home', 'Office', 'Other'] as const).map((lbl) => (
              <button
                key={lbl}
                onClick={() => setActiveTabLabel(lbl)}
                className={`px-3 py-1 text-[11px] font-serif-royal uppercase font-bold rounded-2xs transition-colors whitespace-nowrap ${
                  activeTabLabel === lbl
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#030E18] text-[#EED9C4]/70 border border-[#D4AF37]/25 hover:text-white'
                }`}
              >
                {lbl === 'ALL' ? `All Addresses (${savedAddresses.length})` : lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Addresses Grid or Add/Edit Form */}
        <div className="p-5 flex-1 overflow-y-auto">
          {isFormOpen ? (
            /* Address Creation / Editing Form */
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/30">
                <h3 className="font-serif-royal font-bold text-sm text-[#F3CD68] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{editingAddress ? 'Edit Saved Address' : 'Add New Delivery Address'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-[#EED9C4]/60 hover:text-white uppercase"
                >
                  Cancel
                </button>
              </div>

              {/* Address Label Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1.5 font-serif-royal font-bold">
                  Address Label *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormLabel(lbl)}
                      className={`p-2.5 rounded-xs border text-xs font-serif-royal font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        formLabel === lbl
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black border-white shadow-sm'
                          : 'bg-[#030E18] border-[#D4AF37]/30 text-[#EED9C4] hover:border-[#D4AF37]'
                      }`}
                    >
                      {lbl === 'Home' && <Home className="w-3.5 h-3.5" />}
                      {lbl === 'Office' && <Building2 className="w-3.5 h-3.5" />}
                      {lbl === 'Other' && <MapPin className="w-3.5 h-3.5" />}
                      <span>{lbl}</span>
                    </button>
                  ))}
                </div>

                {formLabel === 'Other' && (
                  <input
                    type="text"
                    placeholder="Custom Label Name (e.g. Vacation Villa, Parents' House)"
                    value={formCustomLabel}
                    onChange={(e) => setFormCustomLabel(e.target.value)}
                    className="w-full mt-2 bg-[#030E18] border border-[#D4AF37]/35 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                )}
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rafiqul Islam"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full bg-[#030E18] border border-[#D4AF37]/35 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                    Mobile Number (11 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01711223344"
                    value={formPhone}
                    onChange={(e) => {
                      setFormPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    className={`w-full bg-[#030E18] border text-xs text-white p-2.5 rounded-xs focus:outline-none ${
                      phoneError ? 'border-red-500' : 'border-[#D4AF37]/35 focus:border-[#F3CD68]'
                    }`}
                  />
                  {phoneError && <p className="text-[10px] text-red-400 mt-1">{phoneError}</p>}
                </div>
              </div>

              {/* Bangladesh Cascading Locations */}
              <div className="p-3.5 bg-[#030910] border border-[#D4AF37]/30 rounded-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Division *
                    </label>
                    <select
                      value={formDivision}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {Object.keys(BANGLADESH_LOCATIONS.divisions).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      District *
                    </label>
                    <select
                      value={formDistrict}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {districtList.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Upazila / Thana *
                    </label>
                    <select
                      value={formUpazila}
                      onChange={(e) => setFormUpazila(e.target.value)}
                      className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                    >
                      {upazilaList.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1213"
                      value={formPostalCode}
                      onChange={(e) => setFormPostalCode(e.target.value)}
                      className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs font-mono focus:outline-none focus:border-[#F3CD68]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal font-semibold">
                    Area / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block C, Road 11 / Near City Bank"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                    Full Delivery Address (House / Road / Village) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 14, Road 7, Flat 4A"
                    value={formRoadVillageHouse}
                    onChange={(e) => setFormRoadVillageHouse(e.target.value)}
                    className="w-full bg-[#04121F] border border-[#D4AF37]/40 text-xs text-white p-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#EED9C4]/70 mb-1 font-serif-royal">
                    Delivery Instructions / Courier Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, fragile fragrance flacon"
                    value={formInstructions}
                    onChange={(e) => setFormInstructions(e.target.value)}
                    className="w-full bg-[#04121F] border border-[#D4AF37]/25 text-xs text-white p-2 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                  />
                </div>
              </div>

              {/* Set as Default Address Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formIsDefault}
                  onChange={(e) => setFormIsDefault(e.target.checked)}
                  className="rounded border-[#D4AF37] text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-[#EED9C4]">
                  Set as my <strong>Default Delivery Address</strong>
                </span>
              </label>

              <div className="flex gap-2 justify-end pt-3 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-600 text-[#EED9C4] text-xs font-serif-royal uppercase rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs shadow-md"
                >
                  {editingAddress ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          ) : filteredAddresses.length === 0 ? (
            /* Empty State */
            <div className="py-14 text-center space-y-3">
              <MapPin className="w-12 h-12 text-[#AA8435]/40 mx-auto" />
              <h4 className="font-serif-royal text-base font-bold text-white">
                No Saved Addresses Found
              </h4>
              <p className="text-xs text-[#EED9C4]/70 max-w-md mx-auto">
                {searchFilter
                  ? 'No addresses match your search criteria. Try a different term.'
                  : 'You have not added any delivery addresses yet. Save an address once to enjoy instant 1-click checkout for all future orders!'}
              </p>
              <button
                type="button"
                onClick={handleStartAdd}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Address</span>
              </button>
            </div>
          ) : (
            /* Grid of Address Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAddresses.map((addr) => (
                <SavedAddressCard
                  key={addr.id}
                  address={addr}
                  isSelected={selectedAddressId === addr.id}
                  onSelect={
                    onSelectAddress
                      ? (a) => {
                          onSelectAddress(a);
                          onClose();
                        }
                      : undefined
                  }
                  onEdit={handleStartEdit}
                  onDelete={(id) => {
                    if (window.confirm('Are you sure you want to delete this saved address?')) {
                      onDeleteAddress(id);
                    }
                  }}
                  onSetDefault={onSetDefaultAddress}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4AF37]/20 bg-[#040E1B] flex items-center justify-between text-xs text-[#EED9C4]/70">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted customer address vault · Private to your account</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-[#D4AF37]/35 text-white font-serif-royal text-xs uppercase rounded-xs hover:border-[#D4AF37]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
