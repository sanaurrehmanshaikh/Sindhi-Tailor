import React, { useState } from 'react';
import { ShopSettings } from '../types';
import { X, Store, Check, Phone, MapPin, User } from 'lucide-react';

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: ShopSettings;
  onSave: (updated: ShopSettings) => void;
}

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shop,
  onSave,
}) => {
  const [shopName, setShopName] = useState(shop.shopName);
  const [ownerName, setOwnerName] = useState(shop.ownerName);
  const [phone, setPhone] = useState(shop.phone);
  const [address, setAddress] = useState(shop.address);
  const [city, setCity] = useState(shop.city);
  const [terms, setTerms] = useState(shop.termsAndConditions);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...shop,
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      whatsappNumber: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      termsAndConditions: terms.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden text-right font-sindhi animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">دڪان جا تفصيل ۽ سيٽنگس</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 text-stone-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">دڪان جو نالو:</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">استاد / مالڪ جو نالو:</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">دڪان جو فون / واٽس ايپ:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded-lg font-latin text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">پتو (بازار / روڊ):</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">شهر:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">رسيد جا شرط ۽ ضابطا (پرچي تي ڇپجڻ لاءِ):</label>
            <textarea
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              رد ڪريو
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>محفوظ ڪريو</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
