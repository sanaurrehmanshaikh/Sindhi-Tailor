import { OrderStatus, GarmentType, CollarType, PocketType, DamanType, TailorOrder, ShopSettings } from '../types';

export const STATUS_CONFIG: Record<OrderStatus, { label: string; english: string; bg: string; text: string; border: string }> = {
  new: {
    label: 'نئون آرڊر',
    english: 'New Order',
    bg: 'bg-blue-50 text-blue-800',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  measurements_taken: {
    label: 'ماپ ورتل',
    english: 'Measurements Taken',
    bg: 'bg-purple-50 text-purple-800',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  stitching: {
    label: 'سلائي جاري آهي',
    english: 'Stitching in Progress',
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  ready: {
    label: 'تيار آهي (کڻي وڃو)',
    english: 'Ready for Pickup',
    bg: 'bg-emerald-50 text-emerald-800',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  delivered: {
    label: 'حوالي ڪيو ويو',
    english: 'Delivered',
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
  delayed: {
    label: 'دير ٿيل (ارجنٽ)',
    english: 'Delayed / Urgent',
    bg: 'bg-rose-50 text-rose-800',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  cancelled: {
    label: 'رد ٿيل',
    english: 'Cancelled',
    bg: 'bg-gray-100 text-gray-500',
    text: 'text-gray-500',
    border: 'border-gray-200',
  },
};

export const GARMENT_LABELS: Record<GarmentType, string> = {
  shalwar_qameez: 'شلوار قميص (روايتي سوٽ)',
  kurta_pajama: 'ڪرتو پاجامو',
  waistcoat: 'واسڪٽ / واسڪيٽ',
  sherwani: 'شيرواني / دولھو لباس',
  pant_shirt: 'پينٽ شرٽ',
  safari_suit: 'سفاري سوٽ',
};

export const COLLAR_LABELS: Record<CollarType, string> = {
  simple_ban: 'سادي گول بين (ڪالر)',
  shirt_collar: 'شرٽ ڪالر',
  chinese_ban: 'چائنيز ڪٽ بين',
  open_collar: 'کليل گلو (وي-ڪٽ)',
};

export const POCKET_LABELS: Record<PocketType, string> = {
  one_front_side: 'هڪ سامهون کيسي + ٻه پاسي جون',
  front_only: 'صرف هڪ سامهون کيسي',
  double_front: 'ٻه سامهون کيسيون (فوجي انداز)',
  secret_pocket: 'ڳجهي کيسي (موبائل / واٽر پاڪيٽ)',
};

export const DAMAN_LABELS: Record<DamanType, string> = {
  straight: 'سڌو دامن (چورس ڪنڊون)',
  round: 'گول دامن (سنڌي روايتي)',
};

// Convert English numbers to Eastern Arabic / Sindhi numerals if needed
export function toSindhiDigits(num: number | string): string {
  const sindhiDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => sindhiDigits[+w]);
}

// Format currency in PKR
export function formatPKR(amount: number): string {
  return `${amount.toLocaleString()} رپيا`;
}

// Format date into human readable Sindhi / Hijri / Pakistani format
export function formatSindhiDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const months = [
      'جنوري', 'فيبروري', 'مارچ', 'اپريل', 'مئي', 'جون',
      'جولاءِ', 'آگسٽ', 'سيپٽمبر', 'آڪٽوبر', 'نومبر', 'ڊسمبر'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

// Generate an authentic, professional WhatsApp receipt in full Sindhi
export function generateWhatsAppReceiptText(order: TailorOrder, shop: ShopSettings): string {
  const statusLabel = STATUS_CONFIG[order.status]?.label || order.status;
  const garmentLabel = GARMENT_LABELS[order.garmentType] || order.garmentType;

  return `*بسم الله الرحمن الرحيم*
🧵 *${shop.shopName}*
📍 پتو: ${shop.address}، ${shop.city}
📞 رابطو: ${shop.phone}
----------------------------------------
*درزي آرڊر رسيد (ڊيجيٽل پرچي)*
📋 *پرچي نمبر:* ${order.orderNo}
👤 *محترم گراهڪ:* ${order.customerName}
📱 *موبائل:* ${order.customerPhone}

✂️ *ڪپڙي جا تفصيل:*
• لباس: ${garmentLabel}
• تعداد: ${order.quantity} جوڙا
• ڪپڙو: ${order.clothType} ${order.clothColor ? `(${order.clothColor})` : ''}
• آرڊر جي تاريخ: ${formatSindhiDate(order.orderDate)}
• *پهچائڻ جي تاريخ: ${formatSindhiDate(order.deliveryDate)}*
• موجوده حيثيت: *${statusLabel}*

💰 *حساب ڪتاب جا تفصيل:*
• ڪل رقم: ${order.totalAmount} روپيا
• اڳواٽ ڏنل (ايڊوانس): ${order.advanceAmount} روپيا
• *باقي واجب الادا: ${order.remainingBalance} روپيا*

${order.specialInstructions ? `📌 *خاص نوٽ:* ${order.specialInstructions}\n` : ''}----------------------------------------
⚠️ *نوٽ:* مهرباني ڪري ڪپڙا کڻڻ مهل هي واٽس ايپ ميسيج ڏيکاريو.
${shop.termsAndConditions}

جزاک الله خير! اوهان جو خلوص اسان جو سرمايو آهي.
~ استاد ${shop.ownerName}`;
}

export function openWhatsAppChat(phone: string, text: string) {
  // Clean phone number (e.g. 03001234567 -> 923001234567)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '92' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('92')) {
    cleanPhone = '92' + cleanPhone;
  }
  
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank');
}
