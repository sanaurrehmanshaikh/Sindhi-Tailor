import React from 'react';
import { ShopSettings, TailorUser } from '../types';
import { 
  Scissors, 
  PlusCircle, 
  Wifi, 
  WifiOff, 
  Code2, 
  RotateCw, 
  Users, 
  LayoutDashboard, 
  Store,
  BarChart3,
  Sparkles,
  Bell,
  LogOut,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  shop: ShopSettings;
  activeTab: 'dashboard' | 'reports' | 'customers' | 'flutter_studio';
  setActiveTab: (tab: 'dashboard' | 'reports' | 'customers' | 'flutter_studio') => void;
  onNewOrder: () => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  unsyncedCount: number;
  onSyncNow: () => void;
  onOpenShopSettings: () => void;
  onOpenFreshSetup: () => void;
  currentUser: TailorUser | null;
  onLogout: () => void;
  onOpenNotifications: () => void;
  urgentNotificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  shop,
  activeTab,
  setActiveTab,
  onNewOrder,
  isOnline,
  setIsOnline,
  unsyncedCount,
  onSyncNow,
  onOpenShopSettings,
  onOpenFreshSetup,
  currentUser,
  onLogout,
  onOpenNotifications,
  urgentNotificationCount,
}) => {
  return (
    <header className="sticky top-0 z-30 shadow-md bg-stone-900 border-b-4 border-amber-600 text-stone-100">
      {/* Top Decorative Ajrak / Sindhi Border Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-amber-500 to-red-800" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          
          {/* Shop Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-red-800 flex items-center justify-center text-white shadow-inner border border-amber-400/40">
              <Scissors className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-sindhi tracking-wide text-amber-200">
                  {shop.shopName}
                </h1>
                <button 
                  onClick={onOpenShopSettings}
                  title="دڪان جا تفصيل ۽ سيٽنگس"
                  className="text-stone-400 hover:text-amber-300 transition-colors p-1 rounded hover:bg-stone-800"
                >
                  <Store className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-stone-300 font-sindhi flex items-center gap-2">
                <span>{shop.ownerName}</span>
                <span>•</span>
                <span className="text-amber-400/90">{shop.city}</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 bg-stone-800/80 p-1 rounded-xl border border-stone-700/80 text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ڊيش بورڊ</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'reports'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>رپورٽس ۽ آمدني</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>گراهڪ ۽ ماپون</span>
            </button>
            <button
              onClick={() => setActiveTab('flutter_studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'flutter_studio'
                  ? 'bg-cyan-600 text-white shadow ring-2 ring-cyan-400/50'
                  : 'text-cyan-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>فلٽر آرڪيٽيڪچر (Flutter Code)</span>
            </button>
          </div>

          {/* Controls: Fresh Start, Notifications, Offline/Online Toggle, User & New Order Button */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Delivery Notifications Bell with Badge */}
            <button
              onClick={onOpenNotifications}
              title="آرڊرن جا نوٽيفڪيشن ۽ ياد ڏهانيون"
              className="relative p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition active:scale-95"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              {urgentNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-latin shadow animate-pulse">
                  {urgentNotificationCount}
                </span>
              )}
            </button>

            {/* Fresh Start Clean Slate Button */}
            <button
              onClick={onOpenFreshSetup}
              title="سڀ اڳواٽ فرضي نالا صاف ڪريو ۽ پنهنجو نئون دڪان شروع ڪريو"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 text-amber-200 border border-red-700/60 text-xs font-bold font-sindhi transition active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              <span>فريش آغاز</span>
            </button>

            {/* Offline-First Simulation Toggle */}
            <div className="flex items-center bg-stone-800 border border-stone-700 rounded-lg p-1 text-xs">
              <button
                onClick={() => setIsOnline(!isOnline)}
                title={isOnline ? 'آن لائن موڊ (فائر اسٽور سان ڳنڍيل)' : 'آف لائن موڊ (ڊرفٽ لوڪل ڪيش چالو)'}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                  isOnline 
                    ? 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50' 
                    : 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/50'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="hidden lg:inline font-sindhi">آن لائن</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden lg:inline font-sindhi">آف لائن</span>
                  </>
                )}
              </button>

              {unsyncedCount > 0 && (
                <button
                  onClick={onSyncNow}
                  title="ڪلڊ سان سنڪ ڪريو"
                  className="flex items-center gap-1 text-amber-300 bg-amber-900/50 px-2 py-1 rounded ml-1 hover:bg-amber-800 transition"
                >
                  <RotateCw className="w-3 h-3 animate-spin" />
                  <span className="font-bold">{unsyncedCount}</span>
                </button>
              )}
            </div>

            {/* Quick Create Order */}
            <button
              onClick={onNewOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-lg shadow-md active:scale-95 transition-all text-xs sm:text-sm font-sindhi"
            >
              <PlusCircle className="w-4 h-4 text-stone-900 stroke-[2.5]" />
              <span>نئون آرڊر</span>
            </button>

            {/* Logged in User & Logout button */}
            {currentUser && (
              <div className="flex items-center bg-stone-800/90 border border-stone-700 rounded-lg p-1 text-xs">
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-stone-300 font-sindhi">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[85px] truncate font-medium">{currentUser.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="لاگ آئوٽ ڪريو"
                  className="flex items-center gap-1 px-2 py-1 rounded bg-stone-900 hover:bg-red-950 text-stone-300 hover:text-rose-300 transition text-xs font-sindhi"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">لاگ آئوٽ</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
