/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Customer, MeasurementProfile, OrderStatus, ShopSettings, TailorOrder, TailorUser } from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CustomersView } from './components/CustomersView';
import { ReportsView } from './components/ReportsView';
import { FlutterCodeStudio } from './components/FlutterCodeStudio';
import { NewOrderModal } from './components/NewOrderModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ShopSettingsModal } from './components/ShopSettingsModal';
import { FreshSetupModal } from './components/FreshSetupModal';
import { LoginScreen } from './components/LoginScreen';
import { NotificationCenter } from './components/NotificationCenter';
import { RotateCcw, Sparkles, Bell } from 'lucide-react';

export default function App() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<TailorUser | null>(() => StorageService.getUserSession());

  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'customers' | 'flutter_studio'>('dashboard');

  // Persistence States
  const [shop, setShop] = useState<ShopSettings>(() => StorageService.getSettings());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [profiles, setProfiles] = useState<MeasurementProfile[]>(() => StorageService.getProfiles());
  const [orders, setOrders] = useState<TailorOrder[]>(() => StorageService.getOrders());

  // Offline Simulation State
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modals & Panels
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<TailorOrder | null>(null);
  const [isShopSettingsOpen, setIsShopSettingsOpen] = useState(false);
  const [isFreshSetupOpen, setIsFreshSetupOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Unsynced counter
  const unsyncedCount = useMemo(() => {
    return orders.filter((o) => !o.syncedWithCloud).length;
  }, [orders]);

  // Next order number (e.g. SD-101)
  const nextOrderNumber = useMemo(() => {
    if (orders.length === 0) return 'SD-101';
    const maxNum = orders.reduce((max, o) => {
      const match = o.orderNo.match(/\d+/);
      if (match) {
        const n = parseInt(match[0], 10);
        return n > max ? n : max;
      }
      return max;
    }, 100);
    return `SD-${maxNum + 1}`;
  }, [orders]);

  // Handlers
  const handleSaveOrder = (
    newOrder: TailorOrder,
    createdCustomer?: Customer,
    createdProfile?: MeasurementProfile
  ) => {
    if (createdCustomer) {
      StorageService.addCustomer(createdCustomer);
      setCustomers(StorageService.getCustomers());
    }
    if (createdProfile) {
      StorageService.addProfile(createdProfile);
      setProfiles(StorageService.getProfiles());
    }

    const saved = StorageService.addOrder(newOrder, isOnline);
    setOrders(StorageService.getOrders());
    setReceiptOrder(saved); // Immediately show printable / WhatsApp receipt
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = StorageService.updateOrderStatus(orderId, status, isOnline);
    setOrders(updated);
  };

  const handleAddCustomer = (customer: Customer) => {
    StorageService.addCustomer(customer);
    setCustomers(StorageService.getCustomers());
  };

  const handleSaveProfile = (profile: MeasurementProfile) => {
    StorageService.updateProfile(profile);
    setProfiles(StorageService.getProfiles());
  };

  const handleSaveShopSettings = (updated: ShopSettings) => {
    StorageService.saveSettings(updated);
    setShop(updated);
  };

  const handleSyncNow = () => {
    const synced = StorageService.syncAllUnsynced();
    setOrders(synced);
  };

  const handleLogin = (user: TailorUser) => {
    StorageService.setUserSession(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    StorageService.setUserSession(null);
    setCurrentUser(null);
  };

  const handleConfirmFreshStart = (newShop: ShopSettings) => {
    StorageService.clearAllToFresh(newShop);
    setShop(newShop);
    setCustomers([]);
    setProfiles([]);
    setOrders([]);
    setActiveTab('dashboard');
  };

  const handleResetData = () => {
    if (window.confirm('ڇا توهان نموني جي اصلي ڊيٽا ٻيهر لوڊ ڪرڻ چاهيو ٿا؟')) {
      StorageService.resetSampleData();
      setShop(StorageService.getSettings());
      setCustomers(StorageService.getCustomers());
      setProfiles(StorageService.getProfiles());
      setOrders(StorageService.getOrders());
    }
  };

  const todayStr = '2026-10-05';
  const urgentNotificationCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status !== 'delivered' &&
        o.status !== 'cancelled' &&
        (o.deliveryDate <= todayStr || o.status === 'ready')
    ).length;
  }, [orders]);

  // Whether the app is currently showing the initial demo/dummy dataset
  const isShowingSampleData = shop.shopName === 'سنڌ جينٽس ٽيلرز' && customers.length > 0;

  // If not logged in, show authentic login screen
  if (!currentUser) {
    return <LoginScreen shop={shop} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sindhi antialiased" dir="rtl">
      {/* Top Header */}
      <Header
        shop={shop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewOrder={() => setIsNewOrderOpen(true)}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        unsyncedCount={unsyncedCount}
        onSyncNow={handleSyncNow}
        onOpenShopSettings={() => setIsShopSettingsOpen(true)}
        onOpenFreshSetup={() => setIsFreshSetupOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        urgentNotificationCount={urgentNotificationCount}
      />

      {/* Fresh Start Suggestion Banner if Sample Data is active */}
      {isShowingSampleData && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-stone-950 px-4 py-2.5 text-xs font-sindhi border-b border-amber-500 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="text-white font-medium">
                <strong>ڌيان ڏيو:</strong> هي في الحال ڊيمو نالن سان هلي رهيو آهي. توهان سڀ فرضي نالا صاف ڪري پنهنجي اصل دڪان جو نالو ۽ پنهنجا نوان گراهڪ شامل ڪري سگهو ٿا!
              </span>
            </div>
            <button
              onClick={() => setIsFreshSetupOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold transition active:scale-95 shrink-0 shadow-md border border-amber-400/40"
            >
              صاف ڪريو ۽ فريش آغاز ڪريو (Fresh Start)
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            orders={orders}
            shop={shop}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onViewReceipt={(order) => setReceiptOrder(order)}
            onNewOrder={() => setIsNewOrderOpen(true)}
            onViewReports={() => setActiveTab('reports')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            orders={orders}
            shop={shop}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersView
            customers={customers}
            profiles={profiles}
            orders={orders}
            shop={shop}
            onAddCustomer={handleAddCustomer}
            onSaveProfile={handleSaveProfile}
            onNewOrderForCustomer={(custId) => {
              setIsNewOrderOpen(true);
            }}
            onViewReceipt={(order) => setReceiptOrder(order)}
          />
        )}

        {activeTab === 'flutter_studio' && <FlutterCodeStudio />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-5 px-4 font-sindhi">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div>
            <span className="text-stone-300 font-bold">سنڌي درزي مينيجمينٽ ايپليڪيشن</span>
            <span className="mx-2">•</span>
            <span>سنڌ جي مقامي درزين لاءِ خاص تيار ڪيل</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="نموني جي ڊيٽا ٻيهر لوڊ ڪريو"
              className="flex items-center gap-1 text-stone-400 hover:text-amber-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ڊيمو ري سيٽ</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('flutter_studio')}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              فلٽر ڪوڊ سينٽر
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        customers={customers}
        profiles={profiles}
        onSaveOrder={handleSaveOrder}
        nextOrderNumber={nextOrderNumber}
      />

      <ReceiptModal
        order={receiptOrder}
        shop={shop}
        onClose={() => setReceiptOrder(null)}
      />

      <ShopSettingsModal
        isOpen={isShopSettingsOpen}
        onClose={() => setIsShopSettingsOpen(false)}
        shop={shop}
        onSave={handleSaveShopSettings}
      />

      <FreshSetupModal
        isOpen={isFreshSetupOpen}
        onClose={() => setIsFreshSetupOpen(false)}
        currentShop={shop}
        onConfirmFreshStart={handleConfirmFreshStart}
      />

      <NotificationCenter
        orders={orders}
        shop={shop}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onViewReceipt={(order) => setReceiptOrder(order)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
