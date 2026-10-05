import React, { useState, useMemo } from 'react';
import { TailorOrder, OrderStatus, ShopSettings } from '../types';
import { 
  STATUS_CONFIG, 
  GARMENT_LABELS, 
  formatPKR, 
  formatSindhiDate, 
  generateWhatsAppReceiptText, 
  openWhatsAppChat 
} from '../data/sindhiTranslations';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wallet, 
  Search, 
  Share2, 
  Receipt, 
  Phone, 
  User, 
  Sparkles,
  ChevronDown,
  Layers,
  Filter,
  Check,
  Scissors,
  Bell
} from 'lucide-react';

interface DashboardViewProps {
  orders: TailorOrder[];
  shop: ShopSettings;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onViewReceipt: (order: TailorOrder) => void;
  onNewOrder: () => void;
  onViewReports?: () => void;
  onOpenNotifications?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  shop,
  onUpdateOrderStatus,
  onViewReceipt,
  onNewOrder,
  onViewReports,
  onOpenNotifications,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [statusMenuOpenFor, setStatusMenuOpenFor] = useState<string | null>(null);

  // Today's date comparison (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    // Return simulated today date matching our data (2026-10-05) or actual current date
    return '2026-10-05';
  }, []);

  // Compute 5 Key Summary Metrics specified in prompt:
  // 1. Today's Deliveries (اڄ جون ترسيلون)
  // 2. Ready Orders (تيار ڪپڙا)
  // 3. In-Shop Orders (دڪان ۾ جاري آرڊر)
  // 4. Delayed Orders (دير ٿيل آرڊر)
  // 5. Remaining Balance (باقي واجب الادا رقم)
  const metrics = useMemo(() => {
    let todayDeliveries = 0;
    let readyOrders = 0;
    let inShopOrders = 0;
    let delayedOrders = 0;
    let totalRemainingBalance = 0;

    orders.forEach((order) => {
      // Exclude cancelled orders from metrics
      if (order.status === 'cancelled') return;

      // Remaining balance sum for all non-cancelled, non-delivered or unpaid orders
      if (order.status !== 'delivered' || order.remainingBalance > 0) {
        totalRemainingBalance += order.remainingBalance;
      }

      // 1. Today's deliveries: deliveryDate == today and not delivered
      if (order.deliveryDate === todayStr && order.status !== 'delivered') {
        todayDeliveries += 1;
      }

      // 2. Ready orders: status is 'ready'
      if (order.status === 'ready') {
        readyOrders += 1;
      }

      // 3. In-shop stitching / active: status is 'stitching' or 'measurements_taken' or 'new'
      if (order.status === 'stitching' || order.status === 'measurements_taken' || order.status === 'new') {
        inShopOrders += 1;
      }

      // 4. Delayed orders: status is 'delayed' or (deliveryDate < today and status not in ['delivered', 'ready'])
      if (order.status === 'delayed' || (order.deliveryDate < todayStr && order.status !== 'delivered' && order.status !== 'ready')) {
        delayedOrders += 1;
      }
    });

    return {
      todayDeliveries,
      readyOrders,
      inShopOrders,
      delayedOrders,
      totalRemainingBalance,
    };
  }, [orders, todayStr]);

  // Filter orders based on search (Name, Phone, Receipt/Order Number) & status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNo.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.clothType.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedStatusFilter === 'all') return true;
      if (selectedStatusFilter === 'today') return order.deliveryDate === todayStr;
      if (selectedStatusFilter === 'ready') return order.status === 'ready';
      if (selectedStatusFilter === 'stitching') return order.status === 'stitching';
      if (selectedStatusFilter === 'delayed') {
        return order.status === 'delayed' || (order.deliveryDate < todayStr && order.status !== 'delivered');
      }
      if (selectedStatusFilter === 'delivered') return order.status === 'delivered';

      return order.status === selectedStatusFilter;
    });
  }, [orders, searchTerm, selectedStatusFilter, todayStr]);

  const handleShareWhatsApp = (order: TailorOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = generateWhatsAppReceiptText(order, shop);
    openWhatsAppChat(order.customerWhatsapp || order.customerPhone, message);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Notice for Local Sindhi Tailors */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-100 rounded-2xl p-4 sm:p-5 shadow-lg border border-amber-700/40 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-amber-500/10 skew-x-12 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                درزي اسسٽنٽ
              </span>
              <span className="text-xs text-amber-200/80 font-sindhi">
                اڄ جي تاريخ: {formatSindhiDate(todayStr)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sindhi text-white">
              ڀلي ڪري آيا، {shop.ownerName}!
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-sm text-stone-300 font-sindhi">
                {orders.length === 0 
                  ? 'سڀ پراڻا نموني وارا آرڊر ختم ڪيا ويا آهن. هاڻي پنهنجو نئون اصل آرڊر پاڻ لکو.'
                  : `اڄ دڪان ۾ ${metrics.todayDeliveries} آرڊر حوالي ڪرڻا آهن ۽ ${metrics.readyOrders} سوٽ گراهڪن جي اچڻ لاءِ تيار آهن.`}
              </p>
              {(metrics.todayDeliveries > 0 || metrics.delayedOrders > 0) && onOpenNotifications && (
                <button
                  onClick={onOpenNotifications}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold font-sindhi transition animate-bounce shadow"
                >
                  <Bell className="w-3 h-3 text-white" />
                  <span>{metrics.todayDeliveries + metrics.delayedOrders} نوٽيفڪيشن ڏسو</span>
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={onNewOrder}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold rounded-xl shadow-lg transition-all active:scale-95 text-sm font-sindhi shrink-0"
          >
            <Scissors className="w-4 h-4 stroke-[2.5]" />
            <span>{orders.length === 0 ? '+ پنهنجو نئون آرڊر لکو' : 'نئون آرڊر درج ڪريو'}</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Cards required by prompt */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. Today's Deliveries */}
        <div 
          onClick={() => setSelectedStatusFilter('today')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
            selectedStatusFilter === 'today'
              ? 'ring-2 ring-blue-500 bg-blue-50/80 border-blue-300 shadow-md'
              : 'bg-white hover:bg-blue-50/40 border-stone-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600 font-sindhi">اڄ جون ترسيلون</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-latin">
            {metrics.todayDeliveries}
          </div>
          <p className="text-[11px] text-blue-600 font-sindhi mt-1">اڄ حوالي ڪرڻ وارا سوٽ</p>
        </div>

        {/* 2. Ready Orders */}
        <div 
          onClick={() => setSelectedStatusFilter('ready')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
            selectedStatusFilter === 'ready'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/80 border-emerald-300 shadow-md'
              : 'bg-white hover:bg-emerald-50/40 border-stone-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600 font-sindhi">تيار ڪپڙا</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-latin">
            {metrics.readyOrders}
          </div>
          <p className="text-[11px] text-emerald-600 font-sindhi mt-1">کڻڻ لاءِ بلڪل تيار</p>
        </div>

        {/* 3. In-Shop Orders */}
        <div 
          onClick={() => setSelectedStatusFilter('stitching')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
            selectedStatusFilter === 'stitching'
              ? 'ring-2 ring-amber-500 bg-amber-50/80 border-amber-300 shadow-md'
              : 'bg-white hover:bg-amber-50/40 border-stone-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600 font-sindhi">دڪان ۾ جاري</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-latin">
            {metrics.inShopOrders}
          </div>
          <p className="text-[11px] text-amber-700 font-sindhi mt-1">سلائي واري مرحلي ۾</p>
        </div>

        {/* 4. Delayed Orders */}
        <div 
          onClick={() => setSelectedStatusFilter('delayed')}
          className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
            selectedStatusFilter === 'delayed'
              ? 'ring-2 ring-rose-500 bg-rose-50/80 border-rose-300 shadow-md'
              : 'bg-white hover:bg-rose-50/40 border-stone-200/80 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600 font-sindhi">دير ٿيل آرڊر</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 font-latin">
            {metrics.delayedOrders}
          </div>
          <p className="text-[11px] text-rose-600 font-sindhi mt-1">تاريخ کان مٿي (ارجنٽ)</p>
        </div>

        {/* 5. Remaining Balance to collect */}
        <div 
          onClick={onViewReports}
          className="col-span-2 lg:col-span-1 rounded-xl p-4 bg-gradient-to-br from-amber-900 to-stone-900 text-amber-100 border border-amber-700/50 shadow-md cursor-pointer hover:border-amber-400 transition-all group"
          title="ماهوار آمدني ۽ باقي رقم جا چارٽس ڏسو"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-200 font-sindhi">ڪل باقي رقم</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-latin tracking-tight">
            {formatPKR(metrics.totalRemainingBalance)}
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-stone-300 font-sindhi">گراهڪن کان وصول ڪرڻي</p>
            {onViewReports && (
              <span className="text-[10px] text-amber-300 underline font-sindhi font-bold">
                چارٽ ڏسو ←
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search by Name, Phone, or Receipt/Order Number */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="گراهڪ جو نالو، موبائل نمبر، يا پرچي نمبر (مثال: SD-101)..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-sindhi bg-stone-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-stone-400 hover:text-stone-600 font-sans"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-sindhi">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedStatusFilter === 'all'
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              سڀ ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('ready')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedStatusFilter === 'ready'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              تيار ({orders.filter(o => o.status === 'ready').length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('stitching')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedStatusFilter === 'stitching'
                  ? 'bg-amber-700 text-white font-bold'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              سلائي جاري ({orders.filter(o => o.status === 'stitching').length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('delayed')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedStatusFilter === 'delayed'
                  ? 'bg-rose-700 text-white font-bold'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              دير ٿيل ({orders.filter(o => o.status === 'delayed' || (o.deliveryDate < todayStr && o.status !== 'delivered')).length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedStatusFilter === 'delivered'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              پهچايو ويو ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-stone-800 font-sindhi">
              آرڊرن جي فهرست ({filteredOrders.length})
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-sindhi">
            واٽس ايپ بٽڻ تي ڪلڪ ڪري گراهڪ کي سڌي سنڌي پرچي موڪليو
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-600 space-y-4 font-sindhi">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
              <Scissors className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <p className="text-lg font-bold text-stone-900">
                {orders.length === 0 ? 'توهان جو دڪان بلڪل فريش ۽ تيار آهي!' : 'ڪو به آرڊر نه مليو'}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                {orders.length === 0 
                  ? 'هن وقت سڀ فرضي نالا صاف آهن. هاڻي پنهنجي اصل گراهڪ جو نالو، ماپ ۽ نئون آرڊر پاڻ شامل ڪريو.'
                  : 'توهان جي ڳولا مطابق ڪو آرڊر نه مليو. فلٽر چيڪ ڪريو يا نئون آرڊر لکو.'}
              </p>
            </div>
            <button
              onClick={onNewOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl text-sm hover:from-amber-700 hover:to-amber-800 shadow-md transition active:scale-95"
            >
              <Scissors className="w-4 h-4" />
              <span>+ پنهنجو پهريون آرڊر درج ڪريو</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredOrders.map((order) => {
              const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;
              const isOverdue = order.deliveryDate < todayStr && order.status !== 'delivered' && order.status !== 'ready';
              const isDeliveryToday = order.deliveryDate === todayStr && order.status !== 'delivered';

              return (
                <div
                  key={order.id}
                  className={`p-4 transition-colors hover:bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isOverdue ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Left Column: Order No, Customer, Cloth Details */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Order Badge */}
                    <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-stone-500">پرچي</span>
                      <span className="text-sm font-extrabold text-amber-900 font-latin leading-none mt-0.5">
                        {order.orderNo.replace('SD-', '#')}
                      </span>
                      <span className="text-[9px] text-stone-500 font-latin mt-0.5">
                        {order.quantity} جوڙا
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-stone-900 font-sindhi flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          {order.customerName}
                        </span>

                        {/* Status Badge with drop down trigger */}
                        <div className="relative inline-block">
                          <button
                            onClick={() => setStatusMenuOpenFor(statusMenuOpenFor === order.id ? null : order.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.border}`}
                          >
                            <span>{statusInfo.label}</span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                          </button>

                          {/* Quick Status Dropdown Menu */}
                          {statusMenuOpenFor === order.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setStatusMenuOpenFor(null)} 
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-200 z-50 py-1.5 text-xs font-sindhi">
                                <div className="px-3 py-1 font-bold text-stone-400 border-b border-stone-100">
                                  حيثيت تبديل ڪريو:
                                </div>
                                {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => {
                                      onUpdateOrderStatus(order.id, st);
                                      setStatusMenuOpenFor(null);
                                    }}
                                    className={`w-full text-right px-3 py-1.5 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                                      order.status === st ? 'font-bold text-amber-700 bg-amber-50/50' : 'text-stone-700'
                                    }`}
                                  >
                                    <span>{STATUS_CONFIG[st].label}</span>
                                    {order.status === st && <Check className="w-3.5 h-3.5 text-amber-600" />}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Today or Overdue Indicators */}
                        {isDeliveryToday && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold animate-pulse font-sindhi">
                            اڄ پهچائڻو آهي!
                          </span>
                        )}
                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold font-sindhi">
                            تاريخ مٽجي وئي!
                          </span>
                        )}
                      </div>

                      {/* Contact & Garment Details */}
                      <div className="flex items-center gap-3 text-xs text-stone-600 font-sindhi flex-wrap">
                        <span className="flex items-center gap-1 text-stone-500">
                          <Phone className="w-3 h-3" />
                          <span className="font-latin">{order.customerPhone}</span>
                        </span>
                        <span>•</span>
                        <span className="text-amber-900 font-medium">
                          {GARMENT_LABELS[order.garmentType]}
                        </span>
                        <span>•</span>
                        <span className="text-stone-500">
                          {order.clothType} {order.clothColor && `(${order.clothColor})`}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="text-xs text-stone-500 font-sindhi flex items-center gap-2">
                        <span>ترسيل جي تاريخ: <strong className="text-stone-800">{formatSindhiDate(order.deliveryDate)}</strong></span>
                        {order.specialInstructions && (
                          <span className="text-stone-400 italic">
                            ({order.specialInstructions})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial Amounts & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                    {/* Amount details */}
                    <div className="text-left font-latin">
                      <div className="text-xs text-stone-500 font-sindhi">
                        ڪل: <span className="font-latin font-semibold">{order.totalAmount}</span> | ايڊوانس: <span className="font-latin">{order.advanceAmount}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs text-stone-600 font-sindhi">باقي:</span>
                        <span className={`text-base font-extrabold ${order.remainingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {order.remainingBalance === 0 ? 'صاف (0)' : formatPKR(order.remainingBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* View / Print Receipt */}
                      <button
                        onClick={() => onViewReceipt(order)}
                        title="ڊجيٽل سنڌي پرچي ڏسو / پرنٽ ڪريو"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>

                      {/* WhatsApp Direct Share Button (Requested Key Feature) */}
                      <button
                        onClick={(e) => handleShareWhatsApp(order, e)}
                        title="واٽس ايپ تي مڪمل سنڌي رسيد موڪليو"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition active:scale-95 font-sindhi"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">واٽس ايپ</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
