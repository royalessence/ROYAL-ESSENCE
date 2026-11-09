import React, { useEffect } from 'react';
import { CustomerNotification } from '../types';
import { Truck, X } from 'lucide-react';

interface CustomerNotificationBannerProps {
  notifications: CustomerNotification[];
  onDismiss: (id: string) => void;
  onViewOrder: (orderId: string) => void;
}

export const CustomerNotificationBanner: React.FC<CustomerNotificationBannerProps> = ({
  notifications,
  onDismiss,
  onViewOrder,
}) => {
  // Only display real, unread notifications
  const unread = notifications.filter((n) => !n.read && n.id !== 'cnotif-init');

  // Auto-dismiss after 6 seconds so customers never have to click X repeatedly
  useEffect(() => {
    if (unread.length === 0) return;
    const timer = setTimeout(() => {
      unread.forEach((n) => onDismiss(n.id));
    }, 6000);
    return () => clearTimeout(timer);
  }, [unread, onDismiss]);

  if (unread.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full space-y-2 pointer-events-none">
      {unread.slice(0, 2).map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto p-3.5 bg-gradient-to-r from-[#0E1217] via-[#14120E] to-[#0A0A0C] border border-[#D4AF37]/60 rounded-t-[14px] rounded-b-xs shadow-[0_10px_35px_rgba(0,0,0,0.95)] animate-in slide-in-from-bottom-3 duration-300 flex items-start gap-3 backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-full bg-[#121217] border border-[#F3CD68] flex items-center justify-center text-[#F3CD68] shrink-0">
            <Truck className="w-4 h-4 text-[#F3CD68]" />
          </div>

          <div className="flex-1 text-left">
            <h4 className="font-serif-royal text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>{notif.title}</span>
            </h4>
            <p className="text-[11px] text-[#EED9C4] mt-0.5 leading-snug">
              {notif.message}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => onViewOrder(notif.orderId)}
                className="text-[10px] font-serif-royal font-bold text-[#F3CD68] hover:underline uppercase tracking-wider"
              >
                Track Order →
              </button>
              <button
                onClick={() => onDismiss(notif.id)}
                className="text-[10px] text-[#EED9C4]/60 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={() => onDismiss(notif.id)}
            className="text-[#EED9C4]/60 hover:text-white p-1"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
