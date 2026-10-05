import React, { useState, useMemo } from 'react';
import { 
  Customer, 
  MeasurementProfile, 
  TailorOrder, 
  GarmentType, 
  CollarType, 
  PocketType, 
  DamanType 
} from '../types';
import { 
  GARMENT_LABELS, 
  COLLAR_LABELS, 
  POCKET_LABELS, 
  DAMAN_LABELS, 
  formatPKR 
} from '../data/sindhiTranslations';
import { 
  X, 
  UserPlus, 
  Users, 
  Scissors, 
  Ruler, 
  Calendar, 
  Check, 
  Plus,
  HelpCircle
} from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  profiles: MeasurementProfile[];
  onSaveOrder: (order: TailorOrder, newCustomer?: Customer, newProfile?: MeasurementProfile) => void;
  nextOrderNumber: string;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  customers,
  profiles,
  onSaveOrder,
  nextOrderNumber,
}) => {
  // Mode: Select existing customer or new
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>(
    customers.length > 0 ? 'existing' : 'new'
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  
  React.useEffect(() => {
    if (isOpen && customers.length === 0) {
      setCustomerMode('new');
    }
  }, [isOpen, customers.length]);
  
  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Selected or New Measurement Profile
  const customerProfiles = useMemo(() => {
    return profiles.filter((p) => p.customerId === selectedCustomerId);
  }, [profiles, selectedCustomerId]);

  const [measurementMode, setMeasurementMode] = useState<'existing' | 'new'>('existing');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  // Measurements Form fields (in inches)
  const [measTitle, setMeasTitle] = useState('روايتي سنڌي شلوار قميص');
  const [qameezLength, setQameezLength] = useState<number>(41.0);
  const [shoulder, setShoulder] = useState<number>(18.5);
  const [chest, setChest] = useState<number>(42.0);
  const [waist, setWaist] = useState<number>(40.0);
  const [sleeve, setSleeve] = useState<number>(23.5);
  const [cuff, setCuff] = useState<number>(9.0);
  const [neck, setNeck] = useState<number>(16.0);
  const [shalwarLength, setShalwarLength] = useState<number>(39.0);
  const [paincha, setPaincha] = useState<number>(8.5);
  const [shalwarGhera, setShalwarGhera] = useState<number>(20.0);

  const [collarType, setCollarType] = useState<CollarType>('simple_ban');
  const [pocketType, setPocketType] = useState<PocketType>('one_front_side');
  const [damanType, setDamanType] = useState<DamanType>('round');
  const [measCustomNotes, setMeasCustomNotes] = useState('');

  // Order Details
  const [garmentType, setGarmentType] = useState<GarmentType>('shalwar_qameez');
  const [clothType, setClothType] = useState('ڪاٽن لٺو');
  const [clothColor, setClothColor] = useState('اڇو (سفيد)');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderDate] = useState('2026-10-05');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-12'); // 7 days later
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Financial fields
  const [totalAmount, setTotalAmount] = useState<number>(2000);
  const [advanceAmount, setAdvanceAmount] = useState<number>(1000);

  // Auto calculate remaining balance
  const remainingBalance = useMemo(() => {
    const rem = (totalAmount || 0) - (advanceAmount || 0);
    return rem >= 0 ? rem : 0;
  }, [totalAmount, advanceAmount]);

  // When customer changes, pick first profile if available
  React.useEffect(() => {
    if (customerProfiles.length > 0) {
      setSelectedProfileId(customerProfiles[0].id);
      setMeasurementMode('existing');
    } else {
      setMeasurementMode('new');
    }
  }, [selectedCustomerId, customerProfiles]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCustomerId = selectedCustomerId;
    let createdCustomer: Customer | undefined;
    let createdProfile: MeasurementProfile | undefined;

    // 1. Handle Customer
    if (customerMode === 'new') {
      if (!newName.trim() || !newMobile.trim()) {
        alert('مهرباني ڪري گراهڪ جو نالو ۽ موبائل نمبر درج ڪريو.');
        return;
      }
      finalCustomerId = 'cust-' + Date.now();
      createdCustomer = {
        id: finalCustomerId,
        name: newName.trim(),
        mobileNumber: newMobile.trim(),
        whatsappNumber: newWhatsapp.trim() || newMobile.trim(),
        address: newAddress.trim(),
        notes: newNotes.trim(),
        createdAt: orderDate,
        totalOrdersCount: 1,
      };
    }

    const currentCustomer = createdCustomer || customers.find((c) => c.id === finalCustomerId);
    if (!currentCustomer) {
      alert('گراهڪ چونڊيو.');
      return;
    }

    // 2. Handle Measurement
    let finalProfile: MeasurementProfile;
    if (measurementMode === 'existing' && selectedProfileId) {
      const existing = profiles.find((p) => p.id === selectedProfileId);
      if (existing) {
        finalProfile = existing;
      } else {
        finalProfile = createNewProfileObj(finalCustomerId);
        createdProfile = finalProfile;
      }
    } else {
      finalProfile = createNewProfileObj(finalCustomerId);
      createdProfile = finalProfile;
    }

    function createNewProfileObj(custId: string): MeasurementProfile {
      return {
        id: 'meas-' + Date.now(),
        customerId: custId,
        title: measTitle.trim() || 'نئون ماپ',
        createdAt: orderDate,
        updatedAt: orderDate,
        qameezLength,
        shoulder,
        chest,
        waist,
        sleeve,
        cuff,
        neck,
        shalwarLength,
        paincha,
        shalwarGhera,
        collarType,
        pocketType,
        damanType,
        customNotes: measCustomNotes.trim(),
      };
    }

    // 3. Create Order
    const newOrder: TailorOrder = {
      id: 'ord-' + Date.now(),
      orderNo: nextOrderNumber,
      customerId: finalCustomerId,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.mobileNumber,
      customerWhatsapp: currentCustomer.whatsappNumber || currentCustomer.mobileNumber,
      measurementId: finalProfile.id,
      measurementSnapshot: finalProfile,
      orderDate,
      deliveryDate,
      clothType,
      clothColor,
      garmentType,
      quantity,
      totalAmount,
      advanceAmount,
      remainingBalance,
      status: 'new',
      specialInstructions,
      syncedWithCloud: true,
    };

    onSaveOrder(newOrder, createdCustomer, createdProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-stone-200 overflow-hidden text-right font-sindhi my-8 animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-sindhi">نئون سلائي آرڊر درج ڪريو</h2>
              <p className="text-xs text-stone-300 font-latin">پرچي نمبر: <strong>{nextOrderNumber}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* SECTION 1: گراهڪ جا تفصيل (Customer Selection) */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-700" />
                1. گراهڪ جي چونڊ يا نئون اندراج
              </span>

              {/* Mode Toggle */}
              <div className="flex bg-stone-200 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setCustomerMode('existing')}
                  className={`px-3 py-1 rounded font-medium transition ${
                    customerMode === 'existing'
                      ? 'bg-white text-stone-900 shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  موجوده گراهڪ
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode('new')}
                  className={`px-3 py-1 rounded font-medium transition ${
                    customerMode === 'new'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  + نئون گراهڪ
                </button>
              </div>
            </div>

            {customerMode === 'existing' ? (
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  گراهڪ چونڊيو:
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:ring-2 focus:ring-amber-500 font-sindhi text-sm"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ({c.mobileNumber}) — {c.address || c.notes || 'پتو ناهي'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    گراهڪ جو نالو: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علي محمد چانڊيو"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    موبائل نمبر: *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 font-latin text-right"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    واٽس ايپ نمبر: (رسيد موڪلڻ لاءِ)
                  </label>
                  <input
                    type="tel"
                    placeholder="جيڪڏهن ساڳيو نه هجي ته لکو"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 font-latin text-right"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    پتو / شهر:
                  </label>
                  <input
                    type="text"
                    placeholder="محلو، ڳوٺ يا شهر"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ماپ جو پروفائل (Measurements Section) */}
          <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-700" />
                2. درزي ماپ جا تفصيل (سڀ ماپ انچن ۾)
              </span>

              {customerProfiles.length > 0 && customerMode === 'existing' && (
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const p = profiles.find((x) => x.id === selectedProfileId);
                      if (p) {
                        setQameezLength(p.qameezLength);
                        setShoulder(p.shoulder);
                        setChest(p.chest);
                        setWaist(p.waist);
                        setSleeve(p.sleeve);
                        setCuff(p.cuff);
                        setNeck(p.neck);
                        setShalwarLength(p.shalwarLength);
                        setPaincha(p.paincha);
                        setShalwarGhera(p.shalwarGhera);
                        if (p.collarType) setCollarType(p.collarType);
                        if (p.pocketType) setPocketType(p.pocketType);
                        if (p.damanType) setDamanType(p.damanType);
                        setMeasCustomNotes(p.customNotes || '');
                      }
                      setMeasurementMode('existing');
                    }}
                    className="text-amber-800 underline font-semibold"
                  >
                    پراڻو ماپ لوڊ ڪريو ({customerProfiles.length} پروفائل موجود)
                  </button>
                </div>
              )}
            </div>

            {/* Quick Profile Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ماپ جو عنوان (مثال: ريگولر فٽ / عيد جوڙو / واسڪٽ):
              </label>
              <input
                type="text"
                value={measTitle}
                onChange={(e) => setMeasTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-stone-900 text-xs"
              />
            </div>

            {/* Measurements Grid: In inches */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              
              {/* Qameez Length */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  قميص ڊگھائي (Length)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={qameezLength}
                    onChange={(e) => setQameezLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Shoulder / Teera */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  تيرا / ڪلهو (Shoulder)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={shoulder}
                    onChange={(e) => setShoulder(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Chest */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  ڇاتي (Chest)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={chest}
                    onChange={(e) => setChest(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Waist / Ghera */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  پيٽ / ڪمر (Waist)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={waist}
                    onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Sleeve */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  ٻانهن / بازو (Sleeve)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={sleeve}
                    onChange={(e) => setSleeve(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Cuff */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  ڪف / مڱو (Cuff)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={cuff}
                    onChange={(e) => setCuff(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Neck / Collar */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  گلو / ڪالر (Neck)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={neck}
                    onChange={(e) => setNeck(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Shalwar Length */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  شلوار ڊگھائي (Length)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={shalwarLength}
                    onChange={(e) => setShalwarLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Paincha */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  پانچو (Paincha)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={paincha}
                    onChange={(e) => setPaincha(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

              {/* Shalwar Ghera */}
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <label className="block font-bold text-stone-700 mb-1">
                  شلوار جو گهيرو / آسن
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.25"
                    value={shalwarGhera}
                    onChange={(e) => setShalwarGhera(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border rounded text-stone-900 font-latin text-center font-bold text-sm"
                  />
                  <span className="text-[10px] text-stone-400">انچ</span>
                </div>
              </div>

            </div>

            {/* Design styles (Collar, Pocket, Daman) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">ڪالر / بين اسٽائل:</label>
                <select
                  value={collarType}
                  onChange={(e) => setCollarType(e.target.value as CollarType)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {(Object.keys(COLLAR_LABELS) as CollarType[]).map((k) => (
                    <option key={k} value={k}>{COLLAR_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">کيسي اسٽائل:</label>
                <select
                  value={pocketType}
                  onChange={(e) => setPocketType(e.target.value as PocketType)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {(Object.keys(POCKET_LABELS) as PocketType[]).map((k) => (
                    <option key={k} value={k}>{POCKET_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">دامن اسٽائل:</label>
                <select
                  value={damanType}
                  onChange={(e) => setDamanType(e.target.value as DamanType)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {(Object.keys(DAMAN_LABELS) as DamanType[]).map((k) => (
                    <option key={k} value={k}>{DAMAN_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: ڪپڙي ۽ ترسيل جا تفصيل (Order & Cloth details) */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
            <span className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              3. ڪپڙي، تعداد ۽ پهچائڻ (Delivery) جا تفصيل
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">لباس جو قسم:</label>
                <select
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value as GarmentType)}
                  className="w-full p-2 border rounded-lg bg-white font-sindhi"
                >
                  {(Object.keys(GARMENT_LABELS) as GarmentType[]).map((g) => (
                    <option key={g} value={g}>{GARMENT_LABELS[g]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ڪپڙي جو قسم / برانڊ:</label>
                <input
                  type="text"
                  placeholder="مثال: لٺو، کاڌي، ڪاٽن، واش اينڊ ويئر"
                  value={clothType}
                  onChange={(e) => setClothType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">ڪپڙي جو رنگ:</label>
                <input
                  type="text"
                  placeholder="مثال: اڇو، بادامي، نيرو"
                  value={clothColor}
                  onChange={(e) => setClothColor(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">جوڙن جو تعداد:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border rounded-lg font-latin text-center font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">پهچائڻ جي تاريخ (Delivery Date):</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2 border rounded-lg font-latin"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">خاص هدايتون (سلائي وغيره):</label>
                <input
                  type="text"
                  placeholder="مثال: بٽڻ سونھري هجن، ڊبل سلائي"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: مالي حساب ڪتاب (Financials: Total, Advance, Balance) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-300/80 space-y-3">
            <span className="font-bold text-amber-950 text-sm flex items-center gap-2">
              4. رقم جو حساب ڪتاب (پيمنٽ ۽ ايڊوانس)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  ڪل سلائي رقم (Total):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-lg font-bold font-latin text-stone-900 bg-white"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-sindhi">روپيا</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  اڳواٽ مليل رقم (Advance):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-lg font-bold font-latin text-emerald-800 bg-white"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-sindhi">روپيا</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-dashed border-amber-400 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-semibold text-stone-600">باقي واجب الادا رقم:</span>
                <span className={`text-xl font-extrabold font-latin ${remainingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatPKR(remainingBalance)}
                </span>
                <span className="text-[10px] text-stone-400 font-sindhi">ڪپڙا کڻڻ وقت وصول ڪرڻي</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-medium text-sm transition"
            >
              رد ڪريو
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>آرڊر محفوظ ڪريو</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
