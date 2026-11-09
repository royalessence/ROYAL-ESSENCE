import React, { useState } from 'react';
import { CustomerAccount } from '../types';
import { X, User, Phone, Mail, ShieldCheck, Check, Sparkles, LogOut, Smartphone, RefreshCw } from 'lucide-react';
import { RoyalLogo } from './RoyalLogo';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerAccount;
  onUpdateCustomer: (customer: CustomerAccount) => void;
  savedAddressesCount: number;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  customer,
  onUpdateCustomer,
  savedAddressesCount,
}) => {
  const [nameInput, setNameInput] = useState(customer.name || '');
  const [phoneInput, setPhoneInput] = useState(customer.phone || '');
  const [emailInput, setEmailInput] = useState(customer.email || '');
  const [phoneError, setPhoneError] = useState('');
  const [isSuccessNotice, setIsSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneInput.replace(/[^0-9]/g, '');
    if (cleaned.length !== 11 || !cleaned.startsWith('01')) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }

    const updated: CustomerAccount = {
      id: `cust-${cleaned}`,
      name: nameInput.trim() || 'Valued Customer',
      phone: cleaned,
      email: emailInput.trim() || undefined,
      isLoggedIn: true,
    };

    onUpdateCustomer(updated);
    setIsSuccessNotice(true);
    setTimeout(() => {
      setIsSuccessNotice(false);
      onClose();
    }, 1500);
  };

  const handleSwitchToGuest = () => {
    const guestAccount: CustomerAccount = {
      id: 'cust-guest',
      name: 'Guest Customer',
      phone: '',
      isLoggedIn: false,
    };
    onUpdateCustomer(guestAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-[#030810]/95 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#07241A] via-[#0A1D36] to-[#1C0816] border-2 border-[#D4AF37]/60 rounded-t-[32px] rounded-b-xs shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-6">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#AA8435] via-[#F3CD68] to-[#D4AF37]" />

        {/* Header */}
        <div className="p-5 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#051A13]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#092B20] border border-[#D4AF37]/50 rounded-xs text-[#F3CD68]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-royal font-bold text-base text-white uppercase tracking-wider">
                ROYAL CUSTOMER ACCOUNT
              </h3>
              <span className="text-xs text-[#EED9C4]/80 block">
                Manage Identity, Saved Addresses & Cross-Device Sync
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#EED9C4]/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Active Status Badge */}
          <div className="p-4 bg-[#04121F] border border-[#D4AF37]/30 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    customer.isLoggedIn ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="font-serif-royal text-xs font-bold uppercase text-white tracking-wider">
                  {customer.isLoggedIn ? 'Authenticated Member' : 'Guest Shopping Session'}
                </span>
              </div>
              <span className="text-[10px] text-[#F3CD68] bg-[#221609] border border-[#D4AF37]/40 px-2 py-0.5 rounded-2xs font-mono">
                {savedAddressesCount} Saved {savedAddressesCount === 1 ? 'Address' : 'Addresses'}
              </span>
            </div>

            {customer.isLoggedIn ? (
              <p className="text-xs text-[#EED9C4]/90 font-sans-body">
                Signed in as <strong className="text-white">{customer.name}</strong> ({customer.phone}).
                Your addresses and order history are securely linked to your account.
              </p>
            ) : (
              <p className="text-xs text-[#EED9C4]/80 font-sans-body">
                Shopping as Guest. Enter your name and mobile number below to save addresses across all your devices.
              </p>
            )}
          </div>

          {/* Sign In / Update Profile Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                Customer Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rafiqul Islam"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#030910] border border-[#D4AF37]/35 text-xs text-white pl-9 pr-3 py-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F3CD68] mb-1 font-serif-royal font-bold">
                Mobile Number (11-Digit Account Key) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full bg-[#030910] border text-xs text-white pl-9 pr-3 py-2.5 rounded-xs focus:outline-none ${
                    phoneError ? 'border-red-500' : 'border-[#D4AF37]/35 focus:border-[#F3CD68]'
                  }`}
                />
              </div>
              {phoneError && <p className="text-[10px] text-red-400 mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#EED9C4] mb-1 font-serif-royal">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#AA8435] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. customer@royalessence.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#030910] border border-[#D4AF37]/25 text-xs text-white pl-9 pr-3 py-2.5 rounded-xs focus:outline-none focus:border-[#F3CD68]"
                />
              </div>
            </div>

            {isSuccessNotice && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-600/50 text-emerald-400 text-xs flex items-center gap-2 rounded-xs">
                <Check className="w-4 h-4" />
                <span>Account synced! Your delivery addresses are available.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-black font-serif-royal font-bold text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{customer.isLoggedIn ? 'Update Account & Sync Vault' : 'Sign In & Restore My Addresses'}</span>
            </button>
          </form>

          {/* Privacy & Cross-Device Sync Guarantee */}
          <div className="p-3 bg-[#030E18] border border-[#D4AF37]/20 rounded-xs text-[11px] text-[#EED9C4]/70 space-y-1">
            <p className="flex items-center gap-1.5 text-white font-medium">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cross-Device Address Sync</span>
            </p>
            <p>
              Your delivery addresses are uniquely locked to your verified Bangladeshi mobile number.
              When switching between phone and laptop, simply sign in to retrieve all saved addresses in 1 click.
            </p>
          </div>

          {customer.isLoggedIn && (
            <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-xs">
              <span className="text-[#EED9C4]/60">Need to shop privately?</span>
              <button
                type="button"
                onClick={handleSwitchToGuest}
                className="text-red-400/80 hover:text-red-300 flex items-center gap-1 font-serif-royal uppercase text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch to Guest Mode</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
