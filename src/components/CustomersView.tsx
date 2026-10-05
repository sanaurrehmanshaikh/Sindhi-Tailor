import React, { useState } from 'react';
import { Customer, MeasurementProfile, TailorOrder, OrderStatus } from '../types';
import { 
  formatPKR, 
  formatSindhiDate, 
  openWhatsAppChat, 
  STATUS_CONFIG, 
  GARMENT_LABELS,
  COLLAR_LABELS,
  POCKET_LABELS,
  DAMAN_LABELS,
  generateWhatsAppReceiptText
} from '../data/sindhiTranslations';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  Ruler, 
  Receipt, 
  UserPlus, 
  Clock, 
  Edit3,
  Calendar,
  ChevronDown,
  ChevronUp,
  History,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Share2,
  FileText,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MeasurementsModal } from './MeasurementsModal';

interface CustomersViewProps {
  customers: Customer[];
  profiles: MeasurementProfile[];
  orders: TailorOrder[];
  shop?: any;
  onAddCustomer: (customer: Customer) => void;
  onSaveProfile: (profile: MeasurementProfile) => void;
  onNewOrderForCustomer: (customerId: string) => void;
  onViewReceipt: (order: TailorOrder) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  profiles,
  orders,
  shop,
  onAddCustomer,
  onSaveProfile,
  onNewOrderForCustomer,
  onViewReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(customers[0]?.id || null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // New Customer Modal
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Measurement Modal
  const [measModalCustomer, setMeasModalCustomer] = useState<Customer | null>(null);
  const [profileToEdit, setProfileToEdit] = useState<MeasurementProfile | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobileNumber.includes(q) ||
      c.whatsappNumber.includes(q) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  const handleShareWhatsApp = (order: TailorOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultShop = shop || {
      shopName: 'سنڌي درزي دڪان',
      ownerName: 'استاد درزي',
      phone: '0300-0000000',
      address: 'سنڌ، پاڪستان',
      city: 'سنڌ',
      termsAndConditions: '30 ڏينهن بعد ڪپڙن جي ذميواري نه هوندي.',
      currency: 'روپيا',
    };
    const message = generateWhatsAppReceiptText(order, defaultShop);
    openWhatsAppChat(order.customerWhatsapp || order.customerPhone, message);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('گراهڪ جو نالو ۽ موبائل نمبر لازمي آهن.');
      return;
    }
    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: name.trim(),
      mobileNumber: mobile.trim(),
      whatsappNumber: whatsapp.trim() || mobile.trim(),
      address: address.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      totalOrdersCount: 0,
    };
    onAddCustomer(newCust);
    setIsNewCustomerOpen(false);
    setName('');
    setMobile('');
    setWhatsapp('');
    setAddress('');
    setNotes('');
    setExpandedCustomerId(newCust.id);
  };

  return (
    <div className="space-y-6 pb-12 font-sindhi">
      
      {/* Top Bar: Search & Add Customer */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="گراهڪ جو نالو، فون يا شهر ڳوليو..."
            className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
          />
        </div>

        <button
          onClick={() => setIsNewCustomerOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ نئون گراهڪ شامل ڪريو</span>
        </button>
      </div>

      {/* Customers List Cards */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-600 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
              <Users className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <p className="text-lg font-bold text-stone-900">
                {customers.length === 0 ? 'توهان جي دڪان ۾ اڃا ڪو به گراهڪ شامل ناهي' : 'ڪو به گراهڪ نه مليو'}
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                {customers.length === 0
                  ? 'سڀ اڳواٽ نالا صاف ٿي چڪا آهن. پنهنجو پهريون اصل گراهڪ ۽ سندس سنڌي درزي ماپون هتي محفوظ ڪريو.'
                  : 'هن ڳولا مطابق ڪو به گراهڪ نه مليو.'}
              </p>
            </div>
            <button
              onClick={() => setIsNewCustomerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl text-sm hover:from-amber-700 hover:to-amber-800 shadow-md transition active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ پهريون اصل گراهڪ شامل ڪريو</span>
            </button>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const custProfiles = profiles.filter((p) => p.customerId === cust.id);
            const custOrders = orders.filter((o) => o.customerId === cust.id);
            const totalRemaining = custOrders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.remainingBalance : sum), 0);
            const isExpanded = expandedCustomerId === cust.id;

            return (
              <div 
                key={cust.id} 
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden transition-all hover:border-amber-300"
              >
                {/* Header Summary Row */}
                <div 
                  onClick={() => setExpandedCustomerId(isExpanded ? null : cust.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-stone-50/40 hover:bg-amber-50/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg border border-amber-200 shrink-0">
                      {cust.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-stone-900">{cust.name}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border">
                          {custOrders.length} آرڊر
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {custProfiles.length} ماپ جا پروفائل
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                        <span className="font-latin text-stone-700">{cust.mobileNumber}</span>
                        {cust.address && <span>• {cust.address}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Balance */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-left font-latin">
                      <span className="text-[10px] text-stone-500 font-sindhi block text-right">ڪل باقي رقم:</span>
                      <span className={`text-sm font-extrabold ${totalRemaining > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {totalRemaining > 0 ? formatPKR(totalRemaining) : '0 صاف'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openWhatsAppChat(cust.whatsappNumber || cust.mobileNumber, `السلام عليڪم ${cust.name}! ${shop?.shopName || 'جينٽس ٽيلرز'} مان حاضر آهيون.`)}
                        title="واٽس ايپ چيٽ"
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <a
                        href={`tel:${cust.mobileNumber}`}
                        title="فون ڪال ڪريو"
                        className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-5 animate-in fade-in duration-150">
                    
                    {cust.notes && (
                      <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900">
                        <strong>خاص نوٽس:</strong> {cust.notes}
                      </div>
                    )}

                    {/* Section 1: Attached Measurement Profiles */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-stone-800">
                          <Ruler className="w-4 h-4 text-amber-700" />
                          <span>محفوظ ڪيل ماپن جا پروفائل ({custProfiles.length})</span>
                        </div>
                        <button
                          onClick={() => {
                            setMeasModalCustomer(cust);
                            setProfileToEdit(null);
                          }}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ نئون ماپ شامل ڪريو</span>
                        </button>
                      </div>

                      {custProfiles.length === 0 ? (
                        <p className="text-xs text-stone-400 bg-white p-3 rounded-lg border text-center">
                          ڪو به ماپ شامل ناهي. مٿي ڏنل بٽڻ سان ماپ شامل ڪريو.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {custProfiles.map((p) => (
                            <div key={p.id} className="bg-white rounded-xl p-3 border border-stone-200 text-xs space-y-2">
                              <div className="flex items-center justify-between border-b pb-1.5">
                                <span className="font-bold text-amber-900">{p.title}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-stone-400 font-latin">{p.updatedAt}</span>
                                  <button
                                    onClick={() => {
                                      setMeasModalCustomer(cust);
                                      setProfileToEdit(p);
                                    }}
                                    className="text-stone-400 hover:text-amber-700 p-1"
                                    title="ماپ ۾ ترميم ڪريو"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-1.5 text-center">
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">ڊگھائي</span>
                                  <span className="font-bold font-latin">{p.qameezLength}"</span>
                                </div>
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">تيرا</span>
                                  <span className="font-bold font-latin">{p.shoulder}"</span>
                                </div>
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">ڇاتي</span>
                                  <span className="font-bold font-latin">{p.chest}"</span>
                                </div>
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">ٻانهن</span>
                                  <span className="font-bold font-latin">{p.sleeve}"</span>
                                </div>
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">ڪالر</span>
                                  <span className="font-bold font-latin">{p.neck}"</span>
                                </div>
                                <div className="bg-stone-50 p-1 rounded">
                                  <span className="block text-[10px] text-stone-500">شلوار</span>
                                  <span className="font-bold font-latin">{p.shalwarLength}"</span>
                                </div>
                              </div>

                              {p.customNotes && (
                                <p className="text-[11px] text-stone-500 italic">
                                  {p.customNotes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 2: Detailed Past Work & Order History for this Specific Customer */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4 text-amber-700" />
                          <h4 className="font-bold text-sm text-stone-900">
                            گذريل ڪم ۽ آرڊرن جي تفصيلي تاريخ (Past Work & Orders History)
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold font-latin">
                            {custOrders.length}
                          </span>
                        </div>

                        <button
                          onClick={() => onNewOrderForCustomer(cust.id)}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>+ هن گراهڪ لاءِ نئون آرڊر لکو</span>
                        </button>
                      </div>

                      {custOrders.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl border border-stone-200 text-center text-stone-400 space-y-2">
                          <History className="w-8 h-8 text-stone-300 mx-auto" />
                          <p className="text-xs font-semibold text-stone-600">هن گراهڪ جو ڪو به اڳوڻو آرڊر رڪارڊ ناهي.</p>
                          <p className="text-[11px] text-stone-400">مٿي ڏنل بٽڻ سان هن گراهڪ جو پهريون سلائي آرڊر شامل ڪريو.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Aggregate stats summary for this specific customer */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-xs">
                            <div className="bg-white p-2 rounded-lg border border-amber-200/60 text-center">
                              <span className="block text-[10px] text-stone-500">ڪل آرڊر</span>
                              <span className="font-bold font-latin text-stone-800 text-sm">{custOrders.length} آرڊر</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-amber-200/60 text-center">
                              <span className="block text-[10px] text-stone-500">سبي ڏنل جوڙا</span>
                              <span className="font-bold font-latin text-amber-900 text-sm">
                                {custOrders.reduce((sum, o) => sum + (o.quantity || 1), 0)} جوڙا
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-amber-200/60 text-center">
                              <span className="block text-[10px] text-stone-500">ڪل بڪنگ رقم</span>
                              <span className="font-bold font-latin text-stone-800 text-sm">
                                {formatPKR(custOrders.reduce((sum, o) => sum + o.totalAmount, 0))}
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-amber-200/60 text-center">
                              <span className="block text-[10px] text-stone-500">باقي رهيل رقم</span>
                              <span className={`font-bold font-latin text-sm ${totalRemaining > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {totalRemaining > 0 ? formatPKR(totalRemaining) : '0 صاف'}
                              </span>
                            </div>
                          </div>

                          {/* Individual detailed order cards */}
                          {custOrders.map((ord) => {
                            const statusInfo = STATUS_CONFIG[ord.status] || STATUS_CONFIG.new;
                            const isOrderExpanded = expandedOrderId === ord.id;
                            const m = ord.measurementSnapshot;

                            return (
                              <div
                                key={ord.id}
                                className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:border-amber-400 transition"
                              >
                                {/* Order Summary Row */}
                                <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50">
                                  <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-950 flex flex-col items-center justify-center font-latin shrink-0 border border-amber-200">
                                      <span className="text-[10px] font-bold text-stone-500">پرچي</span>
                                      <span className="text-xs font-extrabold text-amber-900">
                                        {ord.orderNo.replace('SD-', '#')}
                                      </span>
                                    </div>

                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-stone-900 text-xs sm:text-sm">
                                          {GARMENT_LABELS[ord.garmentType] || ord.garmentType}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border}`}>
                                          {statusInfo.label}
                                        </span>
                                        <span className="text-xs text-stone-500 font-latin">
                                          ({ord.quantity} جوڙا)
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 text-xs text-stone-500 flex-wrap">
                                        <span>ڪپڙو: <strong className="text-stone-700">{ord.clothType}</strong> {ord.clothColor && `(${ord.clothColor})`}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3 text-stone-400" />
                                          <span>ترسيل: {formatSindhiDate(ord.deliveryDate)}</span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Financials & Action Buttons */}
                                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                    <div className="text-left font-latin">
                                      <div className="text-[10px] text-stone-500 font-sindhi">
                                        ڪل: {ord.totalAmount} | ايڊوانس: {ord.advanceAmount}
                                      </div>
                                      <div className="flex items-baseline gap-1 mt-0.5">
                                        <span className="text-[11px] text-stone-600 font-sindhi">باقي:</span>
                                        <span className={`text-sm font-extrabold ${ord.remainingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                          {ord.remainingBalance === 0 ? '0 صاف' : formatPKR(ord.remainingBalance)}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      {/* WhatsApp Receipt Button */}
                                      <button
                                        onClick={(e) => handleShareWhatsApp(ord, e)}
                                        title="واٽس ايپ تي سنڌي پرچي موڪليو"
                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Digital Receipt Slip View */}
                                      <button
                                        onClick={() => onViewReceipt(ord)}
                                        title="پرچي پرنٽ / ڏسو"
                                        className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
                                      >
                                        <Receipt className="w-3.5 h-3.5" />
                                      </button>

                                      {/* Toggle Detail Expansion */}
                                      <button
                                        onClick={() => setExpandedOrderId(isOrderExpanded ? null : ord.id)}
                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium flex items-center gap-1"
                                      >
                                        <span>تفصيل</span>
                                        {isOrderExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Expanded Tailoring Specifications & Measurements for this past work */}
                                {isOrderExpanded && (
                                  <div className="p-3.5 bg-stone-50 border-t border-stone-200 text-xs space-y-3 animate-in fade-in duration-150">
                                    
                                    {/* Tailoring Specs: Collar, Pocket, Daman & Notes */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-stone-200">
                                      <div>
                                        <span className="text-stone-500">ڪالر / بين اسٽائل:</span>{' '}
                                        <strong className="text-stone-800">{m?.collarType ? (COLLAR_LABELS[m.collarType] || m.collarType) : 'سادي بين'}</strong>
                                      </div>
                                      <div>
                                        <span className="text-stone-500">کيسي اسٽائل:</span>{' '}
                                        <strong className="text-stone-800">{m?.pocketType ? (POCKET_LABELS[m.pocketType] || m.pocketType) : 'هڪ سامهون کيسي'}</strong>
                                      </div>
                                      <div>
                                        <span className="text-stone-500">دامن اسٽائل:</span>{' '}
                                        <strong className="text-stone-800">{m?.damanType ? (DAMAN_LABELS[m.damanType] || m.damanType) : 'گول دامن'}</strong>
                                      </div>
                                    </div>

                                    {/* Tailor instructions note */}
                                    {ord.specialInstructions && (
                                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                                        <strong>سلائي جون خاص هدايتون:</strong> {ord.specialInstructions}
                                      </div>
                                    )}

                                    {/* The exact measurements snapshot recorded for this specific suit */}
                                    {m && (
                                      <div className="space-y-1.5">
                                        <span className="font-bold text-stone-700 text-[11px] block">
                                          هن آرڊر ۾ استعمال ٿيل درزي ماپ جا انچ (Measurements):
                                        </span>
                                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center">
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">ڊگھائي</span>
                                            <span className="font-bold font-latin">{m.qameezLength}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">تيرا</span>
                                            <span className="font-bold font-latin">{m.shoulder}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">ڇاتي</span>
                                            <span className="font-bold font-latin">{m.chest}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">پيٽ</span>
                                            <span className="font-bold font-latin">{m.waist}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">ٻانهن</span>
                                            <span className="font-bold font-latin">{m.sleeve}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">ڪالر</span>
                                            <span className="font-bold font-latin">{m.neck}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">شلوار</span>
                                            <span className="font-bold font-latin">{m.shalwarLength}"</span>
                                          </div>
                                          <div className="bg-white p-1 rounded border border-stone-200">
                                            <span className="block text-[9px] text-stone-500">پانچو</span>
                                            <span className="font-bold font-latin">{m.paincha}"</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action to repeat this order */}
                                    <div className="flex justify-end pt-1">
                                      <button
                                        onClick={() => onNewOrderForCustomer(cust.id)}
                                        className="text-xs bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                                      >
                                        <RotateCcw className="w-3 h-3 text-amber-400" />
                                        <span>هن ساڳي ماپ ۽ انداز سان نئون آرڊر درج ڪريو</span>
                                      </button>
                                    </div>

                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Customer Modal */}
      {isNewCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border text-right font-sindhi">
            <h3 className="font-bold text-lg mb-3">نئون گراهڪ شامل ڪريو</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">گراهڪ جو نالو: *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رفيق احمد چنو"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">موبائل نمبر: *</label>
                <input
                  type="tel"
                  required
                  placeholder="0300-1234567"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full p-2 border rounded-lg font-latin text-right"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">واٽس ايپ نمبر:</label>
                <input
                  type="tel"
                  placeholder="ساڳيو يا الڳ واٽس ايپ نمبر"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-2 border rounded-lg font-latin text-right"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">پتو يا شهر:</label>
                <input
                  type="text"
                  placeholder="مثال: پراڻو سکر، يا حيدرآباد"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">نوٽس:</label>
                <textarea
                  rows={2}
                  placeholder="پسند، ناپسند يا سلائي جون عادتون..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  رد ڪريو
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg"
                >
                  محفوظ ڪريو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Measurement Editor Modal */}
      {measModalCustomer && (
        <MeasurementsModal
          isOpen={!!measModalCustomer}
          onClose={() => {
            setMeasModalCustomer(null);
            setProfileToEdit(null);
          }}
          customer={measModalCustomer}
          profileToEdit={profileToEdit}
          onSaveProfile={(prof) => {
            onSaveProfile(prof);
            setMeasModalCustomer(null);
            setProfileToEdit(null);
          }}
        />
      )}

    </div>
  );
};
