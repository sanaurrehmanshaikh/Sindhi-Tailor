import React, { useState } from 'react';
import { ShopSettings } from '../types';
import { Sparkles, Trash2, Store, User, Phone, MapPin, Check, X, Scissors } from 'lucide-react';

interface FreshSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShop: ShopSettings;
  onConfirmFreshStart: (newShop: ShopSettings) => void;
}

export const FreshSetupModal: React.FC<FreshSetupModalProps> = ({
  isOpen,
  onClose,
  currentShop,
  onConfirmFreshStart,
}) => {
  const [shopName, setShopName] = useState(
    currentShop.shopName === 'سنڌ جينٽس ٽيلرز' ? '' : currentShop.shopName
  );
  const [ownerName, setOwnerName] = useState(
    currentShop.ownerName === 'استاد درزي' ? '' : currentShop.ownerName
  );
  const [phone, setPhone] = useState(
    currentShop.phone === '0300-1234567' ? '' : currentShop.phone
  );
  const [city, setCity] = useState(
    currentShop.city.includes('سنڌ') ? '' : currentShop.city
  );
  const [address, setAddress] = useState(
    currentShop.address.includes('مين مارڪيٽ') ? '' : currentShop.address
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const freshShop: ShopSettings = {
      shopName: shopName.trim() || 'منهنجو درزي دڪان',
      ownerName: ownerName.trim() || 'درزي استاد',
      phone: phone.trim() || '',
      whatsappNumber: phone.trim() || '',
      city: city.trim() || 'سنڌ، پاڪستان',
      address: address.trim() || '',
      termsAndConditions: '30 ڏينهن بعد ڪپڙن جي ذميواري نه هوندي. تيار ٿيل ڪپڙا جلد کڻي وڃو.',
      currency: 'روپيا (PKR)',
    };
    onConfirmFreshStart(freshShop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-amber-500 overflow-hidden text-right font-sindhi animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-5 flex items-start justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg font-bold">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-200">
                پنهنجي دڪان جو فريش آغاز (Fresh Start)
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                سڀ اڳواٽ لکيل فرضي نالا ۽ نمونا صاف ڪري پنهنجو نئون رڪارڊ شروع ڪريو.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning / Explanation Alert */}
        <div className="bg-amber-50 p-4 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-950">
          <Trash2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">سڀ اڳواٽ ڊيمو نالا ۽ آرڊر ختم ٿي ويندا:</p>
            <p className="text-amber-900">
              هن بٽڻ سان اڳوڻا سمورا نموني وارا گراهڪ (سومرو، ميمڻ وغيره) صاف ٿي ويندا ۽ توهان جي مرضيءَ سان بلڪل خالي ۽ صاف ايپ شروع ٿيندي جتي توهان سڀ ڪجهه پاڻ لکندئو.
            </p>
          </div>
        </div>

        {/* Shop Setup Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-800 mb-1 text-sm flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-700" />
              <span>توهان جي دڪان جو اصل نالو: *</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: خان ٽيلرز / المدينه درزي دڪان / نئون سنڌ ٽيلرز"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-stone-300 rounded-xl focus:border-amber-600 focus:ring-0 text-sm font-bold bg-stone-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>استاد / مالڪ جو نالو: *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: استاد رشيد احمد"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-amber-500 bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>دڪان جو فون / واٽس ايپ: *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-amber-500 font-latin text-right bg-stone-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>شهر جو نالو: *</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: سکر، لاڙڪاڻو، حيدرآباد، ڪراچي"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-amber-500 bg-stone-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                دڪان جو پتو (بازار / روڊ):
              </label>
              <input
                type="text"
                placeholder="مثال: مين شاهي بازار دڪان نمبر 4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-amber-500 bg-stone-50"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
            >
              رد ڪريو
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>سڀ فرضي نالا صاف ڪريو ۽ فريش دڪان شروع ڪريو</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
