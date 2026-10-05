import React, { useState } from 'react';
import { TailorOrder, ShopSettings, OrderStatus } from '../types';
import { formatPKR, formatSindhiDate, openWhatsAppChat } from '../data/sindhiTranslations';
import { 
  Bell, 
  X, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Receipt, 
  ExternalLink,
  Check,
  User,
  Phone
} from 'lucide-react';

interface NotificationCenterProps {
  orders: TailorOrder[];
  shop: ShopSettings;
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: (order: TailorOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  orders,
  shop,
  isOpen,
  onClose,
  onViewReceipt,
  onUpdateOrderStatus,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'today' | 'delayed' | 'ready'>('all');

  // Simulated today date
  const todayStr = '2026-10-05';

  // Compute notifications
  const notifications = orders.filter((o) => {
    if (o.status === 'cancelled' || o.status === 'delivered') return false;
    const isDueToday = o.deliveryDate === todayStr;
    const isOverdue = o.deliveryDate < todayStr;
    const isReady = o.status === 'ready';

    if (filterType === 'today') return isDueToday;
    if (filterType === 'delayed') return isOverdue;
    if (filterType === 'ready') return isReady;

    return isDueToday || isOverdue || isReady;
  });

  const dueTodayCount = orders.filter((o) => o.deliveryDate === todayStr && o.status !== 'delivered').length;
  const overdueCount = orders.filter((o) => o.deliveryDate < todayStr && o.status !== 'delivered' && o.status !== 'ready').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  if (!isOpen) return null;

  const handleSendReadyNotice = (order: TailorOrder) => {
    const text = `*السلام عليڪم ${order.customerName}!*
🧵 *${shop.shopName}* کان اوهان لاءِ نياپو:
اوهان جو آرڊر پرچي نمبر *${order.orderNo}* تيار ٿي چڪو آهي.
ڪپڙو: ${order.clothType} (${order.quantity} جوڙا)
باقي واجب الادا رقم: *${order.remainingBalance} روپيا*
مهرباني ڪري دڪان تان پنهنجا ڪپڙا حاصل ڪري وٺو.
جزاک الله خير! ~ استاد ${shop.ownerName}
📞 رابطو: ${shop.phone}`;

    openWhatsAppChat(order.customerWhatsapp || order.customerPhone, text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm flex justify-start font-sindhi" dir="rtl">
      
      {/* Slide-over panel */}
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
      >
        {/* Panel Header */}
        <div className="p-4 bg-gradient-to-r from-amber-900 to-stone-900 text-white flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-200">
                آرڊرن جا نوٽيفڪيشن ۽ ياد ڏهانيون
              </h3>
              <p className="text-xs text-stone-300">
                ڪل {notifications.length} ضروري آرڊر جن کي سنڀالڻو آهي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
            }`}
          >
            سڀ نوٽيفڪيشن ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('today')}
            className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
              filterType === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            اڄ ڏيڻ وارا ({dueTodayCount})
          </button>
          <button
            onClick={() => setFilterType('delayed')}
            className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
              filterType === 'delayed'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            دير ٿيل ({overdueCount})
          </button>
          <button
            onClick={() => setFilterType('ready')}
            className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
              filterType === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            تيار ڪپڙا ({readyCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-100/50">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-stone-500 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="font-bold text-base text-stone-800">ڪو به التوا هيٺ آرڊر ناهي!</p>
              <p className="text-xs text-stone-400">سڀ آرڊر وقت تي پهچايا ويا آهن.</p>
            </div>
          ) : (
            notifications.map((order) => {
              const isDueToday = order.deliveryDate === todayStr;
              const isOverdue = order.deliveryDate < todayStr;
              const isReady = order.status === 'ready';

              let badgeBg = 'bg-amber-100 text-amber-900 border-amber-200';
              let badgeText = 'ترسيل جي تاريخ ويجهو آهي';

              if (isDueToday) {
                badgeBg = 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
                badgeText = 'اڄ حوالي ڪرڻو آهي!';
              } else if (isOverdue) {
                badgeBg = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
                badgeText = 'تاريخ مٽجي چڪي آهي (ارجنٽ)';
              } else if (isReady) {
                badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                badgeText = 'ڪپڙا بلڪل تيار آهن!';
              }

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-sm space-y-2.5 hover:border-amber-400 transition"
                >
                  {/* Top status indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${badgeBg}`}>
                      {badgeText}
                    </span>
                    <span className="text-xs font-latin font-bold text-stone-700">
                      {order.orderNo}
                    </span>
                  </div>

                  {/* Customer and Suit details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {order.customerName}
                      </span>
                      <span className="text-xs font-latin text-stone-600">
                        {order.customerPhone}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center justify-between">
                      <span>ڪپڙو: {order.clothType} ({order.quantity} جوڙا)</span>
                      <span>باقي: <strong className="text-rose-700 font-latin">{formatPKR(order.remainingBalance)}</strong></span>
                    </div>

                    <div className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>ترسيل تاريخ: {formatSindhiDate(order.deliveryDate)}</span>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleSendReadyNotice(order)}
                      title="واٽس ايپ تي گراهڪ کي نياپو موڪليو"
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>واٽس ايپ ياد ڏياريو</span>
                    </button>

                    <button
                      onClick={() => onViewReceipt(order)}
                      title="پرچي ڏسو"
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>

                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        title="حوالي ڪيو ويو (Mark Delivered)"
                        className="py-1.5 px-2 bg-stone-800 hover:bg-stone-900 text-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>حوالي ٿيو</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          دڪان: {shop.shopName} • {shop.ownerName}
        </div>
      </div>

    </div>
  );
};
