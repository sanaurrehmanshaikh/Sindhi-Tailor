import React from 'react';
import { TailorOrder, ShopSettings } from '../types';
import { 
  GARMENT_LABELS, 
  STATUS_CONFIG, 
  formatPKR, 
  formatSindhiDate, 
  generateWhatsAppReceiptText, 
  openWhatsAppChat,
  COLLAR_LABELS,
  POCKET_LABELS,
  DAMAN_LABELS
} from '../data/sindhiTranslations';
import { 
  X, 
  Printer, 
  Share2, 
  Scissors, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Receipt as ReceiptIcon 
} from 'lucide-react';

interface ReceiptModalProps {
  order: TailorOrder | null;
  shop: ShopSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, shop, onClose }) => {
  if (!order) return null;

  const m = order.measurementSnapshot;
  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.new;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const text = generateWhatsAppReceiptText(order, shop);
    openWhatsAppChat(order.customerWhatsapp || order.customerPhone, text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden text-right font-sindhi my-6 animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Modal Top Actions */}
        <div className="bg-stone-900 text-stone-100 p-3.5 px-5 flex items-center justify-between border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">ڊجيٽل درزي رسيد (پرچي)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واٽس ايپ تي موڪليو</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٽ</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-8 bg-amber-50/20 text-stone-900 space-y-5 print:p-0 print:bg-white" id="printable-receipt">
          
          {/* Shop Header */}
          <div className="text-center border-b-2 border-stone-800 pb-4 space-y-1">
            <p className="text-xs text-stone-600 font-serif">بسم الله الرحمن الرحيم</p>
            <div className="flex items-center justify-center gap-2">
              <Scissors className="w-5 h-5 text-amber-800 rotate-45" />
              <h2 className="text-2xl sm:text-3xl font-bold font-lateef text-stone-950">
                {shop.shopName}
              </h2>
            </div>
            <p className="text-xs text-stone-600 font-sindhi">
              مالڪ: {shop.ownerName}
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-stone-500 font-sindhi flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {shop.address}، {shop.city}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-latin">
                <Phone className="w-3 h-3" />
                {shop.phone}
              </span>
            </div>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block">پرچي / آرڊر نمبر:</span>
              <span className="font-extrabold text-base font-latin text-amber-900">
                {order.orderNo}
              </span>
            </div>
            <div className="text-left font-latin">
              <span className="text-stone-500 block font-sindhi text-right">آرڊر تاريخ:</span>
              <span className="font-bold text-stone-800 font-sindhi">
                {formatSindhiDate(order.orderDate)}
              </span>
            </div>

            <div>
              <span className="text-stone-500 block">محترم گراهڪ:</span>
              <span className="font-bold text-sm text-stone-900">
                {order.customerName}
              </span>
            </div>
            <div className="text-left font-latin">
              <span className="text-stone-500 block font-sindhi text-right">موبائل نمبر:</span>
              <span className="font-semibold text-stone-800">
                {order.customerPhone}
              </span>
            </div>

            <div className="col-span-2 pt-1 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-stone-500">حوالي ڪرڻ (Delivery) جي تاريخ:</span>{' '}
                <strong className="text-stone-950 text-sm">{formatSindhiDate(order.deliveryDate)}</strong>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusInfo.bg}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Suit & Cloth Details */}
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-stone-100 p-2 font-bold text-stone-800 border-b border-stone-200">
              ڪپڙي ۽ سلائي جو قسم
            </div>
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-stone-500">لباس:</span>{' '}
                <strong>{GARMENT_LABELS[order.garmentType]}</strong>
              </div>
              <div>
                <span className="text-stone-500">ڪپڙو:</span>{' '}
                <strong>{order.clothType}</strong>
              </div>
              <div>
                <span className="text-stone-500">رنگ:</span>{' '}
                <strong>{order.clothColor || 'سادو'}</strong>
              </div>
              <div>
                <span className="text-stone-500">تعداد:</span>{' '}
                <strong className="font-latin">{order.quantity} جوڙا</strong>
              </div>
              {m.collarType && (
                <div>
                  <span className="text-stone-500">ڪالر:</span>{' '}
                  <span>{COLLAR_LABELS[m.collarType]}</span>
                </div>
              )}
              {m.damanType && (
                <div>
                  <span className="text-stone-500">دامن:</span>{' '}
                  <span>{DAMAN_LABELS[m.damanType]}</span>
                </div>
              )}
            </div>
          </div>

          {/* Complete Measurements Grid Snapshot */}
          <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-950 border-b border-amber-200/80 pb-1.5">
              <span>ماپ جا تفصيل (انچن ۾)</span>
              <span className="text-[11px] font-normal text-amber-800">{m.title}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center">
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">ڊگھائي</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.qameezLength}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">تيرا</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.shoulder}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">ڇاتي</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.chest}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">پيٽ / ڪمر</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.waist}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">ٻانهن</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.sleeve}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">ڪف</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.cuff}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">گلو / ڪالر</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.neck}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">شلوار ڊگھائي</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.shalwarLength}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">پانچو</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.paincha}"</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-stone-200">
                <span className="block text-[10px] text-stone-500">گهيرو</span>
                <span className="font-bold text-sm font-latin text-stone-900">{m.shalwarGhera}"</span>
              </div>
            </div>

            {m.customNotes && (
              <p className="text-[11px] text-stone-600 pt-1">
                <strong>خاص نوٽ:</strong> {m.customNotes}
              </p>
            )}
          </div>

          {/* Payment Breakdown Box */}
          <div className="border-2 border-stone-800 rounded-xl p-4 space-y-2 bg-white">
            <div className="flex justify-between items-center text-sm font-sindhi">
              <span>ڪل سلائي اجورو (Total):</span>
              <span className="font-bold font-latin">{formatPKR(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-sindhi text-stone-600">
              <span>اڳواٽ ڏنل رقم (Advance):</span>
              <span className="font-bold font-latin text-emerald-700">{formatPKR(order.advanceAmount)}</span>
            </div>
            <div className="border-t-2 border-stone-800 pt-2 flex justify-between items-center text-base font-bold font-sindhi">
              <span>باقي واجب الادا رقم (Balance):</span>
              <span className={`font-latin text-xl font-extrabold ${order.remainingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {order.remainingBalance === 0 ? 'سڀ ادا ٿيل (0)' : formatPKR(order.remainingBalance)}
              </span>
            </div>
          </div>

          {/* Terms & Footer Note */}
          <div className="text-[11px] text-stone-500 text-center space-y-1 border-t border-stone-200 pt-3">
            <p className="font-semibold text-stone-700">{shop.termsAndConditions}</p>
            <p>ڪپڙا کڻڻ وقت هي رسيد پيش ڪرڻ لازمي آهي.</p>
            <p className="text-amber-900 font-bold">مهرباني! اوهان جي تشريف آوريءَ جا شڪر گذار آهيون.</p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold"
          >
            بند ڪريو
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition"
          >
            <Share2 className="w-4 h-4" />
            <span>گراهڪ کي واٽس ايپ رسيد موڪليو</span>
          </button>
        </div>

      </div>
    </div>
  );
};
