export type OrderStatus = 
  | 'new'                   // نئون آرڊر
  | 'measurements_taken'    // ماپ ورتل
  | 'stitching'             // سلائي جاري
  | 'ready'                 // تيار ڪپڙا
  | 'delivered'             // حوالي ٿيل (پهچايو ويو)
  | 'delayed'               // دير ٿيل
  | 'cancelled';            // رد ٿيل

export type GarmentType = 
  | 'shalwar_qameez'        // شلوار قميص
  | 'kurta_pajama'          // ڪرتو پاجامو
  | 'waistcoat'             // واسڪٽ
  | 'sherwani'              // شيرواني
  | 'pant_shirt'            // پينٽ شرٽ
  | 'safari_suit';          // سفاري سوٽ

export type CollarType = 
  | 'simple_ban'            // سادي بين (ڪالر)
  | 'shirt_collar'          // شرٽ ڪالر
  | 'chinese_ban'           // چائنيز بين
  | 'open_collar';          // کليل گلو

export type PocketType = 
  | 'one_front_side'        // هڪ سامهون ۽ پاسي جون کيسيون
  | 'front_only'            // صرف سامهون کيسي
  | 'double_front'          // ٻٽي سامهون کيسي
  | 'secret_pocket';        // ڳجهي کيسي (واٽر پاڪيٽ)

export type DamanType = 
  | 'straight'              // سڌو دامن (چورس)
  | 'round';                // گول دامن

export interface MeasurementProfile {
  id: string;
  customerId: string;
  title: string;             // مثال: "سادي شلوار قميص", "عيد اسپيشل", "واسڪٽ"
  createdAt: string;
  updatedAt: string;
  
  // قميص جا ماپ (سڀ ماپ انچن ۾)
  qameezLength: number;      // ڊگھائي (Length)
  shoulder: number;          // تيرا / ڪلهو (Shoulder)
  chest: number;             // ڇاتي (Chest)
  waist: number;             // پيٽ / گهيرو (Waist/Stomach)
  hip?: number;              // هپ (Hip)
  sleeve: number;            // ٻانهن / آستين (Sleeve)
  cuff: number;              // ڪف / ٻانهن جو مڱو (Cuff)
  neck: number;              // گلو / ڪالر (Neck/Collar)
  
  // شلوار / پاجامي جا ماپ
  shalwarLength: number;     // شلوار ڊگھائي (Shalwar Length)
  paincha: number;           // پانچو (Paincha)
  shalwarGhera: number;      // شلوار جو گهيرو / آسن (Seat/Ghera)
  
  // انداز ۽ ڊزائن
  collarType?: CollarType;
  pocketType?: PocketType;
  damanType?: DamanType;
  customNotes?: string;      // خاص هدايتون (Special instructions)
}

export interface Customer {
  id: string;
  name: string;              // گراهڪ جو پورو نالو
  mobileNumber: string;      // موبائل نمبر (ڪال لاءِ)
  whatsappNumber: string;    // واٽس ايپ نمبر (رسيد موڪلڻ لاءِ)
  address?: string;          // ڳوٺ / شهر جو پتو
  notes?: string;            // نوٽس
  createdAt: string;
  totalOrdersCount: number;
}

export interface TailorOrder {
  id: string;
  orderNo: string;           // آرڊر / پرچي نمبر (مثال: SD-1082)
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  measurementId: string;
  measurementSnapshot: MeasurementProfile; // محفوظ ڪيل ماپ
  
  orderDate: string;         // تاريخ آرڊر
  deliveryDate: string;      // تاريخ پهچائڻ (تيار ٿيڻ جي تاريخ)
  clothType: string;         // ڪپڙي جو قسم (مثال: لٺو، کاڌي، واش اينڊ ويئر، ڪاٽن)
  clothColor?: string;       // ڪپڙي جو رنگ
  garmentType: GarmentType;  // لباس جو قسم
  quantity: number;          // جوڙن جو تعداد
  
  totalAmount: number;       // ڪل رقم (روپيا)
  advanceAmount: number;     // اڳواٽ ڏنل رقم (ايڊوانس)
  remainingBalance: number;  // باقي رقم
  
  status: OrderStatus;
  specialInstructions?: string; // اضافي هدايتون (سئي ڌاڳو، ڊبل سلائي، بٽڻ وغيره)
  syncedWithCloud?: boolean; // آف لائن ڪيش مان سرور سان سنڪ ٿيل؟
}

export interface ShopSettings {
  shopName: string;          // دڪان جو نالو (مثال: سنڌ جينٽس ٽيلرز)
  ownerName: string;         // مالڪ / درزي جو نالو (مثال: استاد درزي)
  phone: string;             // دڪان جو فون
  whatsappNumber: string;    // واٽس ايپ
  address: string;           // پتو (مثال: شاهي بازار، سکر)
  city: string;              // شهر
  termsAndConditions: string;// شرط ۽ ضابطا (مثال: 30 ڏينهن بعد ڪپڙن جي ذميواري نه هوندي)
  currency: string;          // ڪرنسي (روپيا / PKR)
}

export interface TailorUser {
  id: string;
  name: string;
  phone: string;
  role: 'master' | 'tailor'; // استاد يا ڪاريگر
  pin: string;
}

export interface DeliveryNotification {
  id: string;
  orderId: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  clothType: string;
  garmentType: GarmentType;
  deliveryDate: string;
  remainingBalance: number;
  type: 'due_today' | 'delayed' | 'ready_for_pickup';
  title: string;
  message: string;
  isRead?: boolean;
}

