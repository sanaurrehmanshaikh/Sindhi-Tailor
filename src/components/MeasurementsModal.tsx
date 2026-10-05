import React, { useState } from 'react';
import { Customer, MeasurementProfile, CollarType, PocketType, DamanType } from '../types';
import { COLLAR_LABELS, POCKET_LABELS, DAMAN_LABELS } from '../data/sindhiTranslations';
import { X, Ruler, Check, Save } from 'lucide-react';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  profileToEdit?: MeasurementProfile | null;
  onSaveProfile: (profile: MeasurementProfile) => void;
}

export const MeasurementsModal: React.FC<MeasurementsModalProps> = ({
  isOpen,
  onClose,
  customer,
  profileToEdit,
  onSaveProfile,
}) => {
  const [title, setTitle] = useState(profileToEdit?.title || 'روايتي سنڌي شلوار قميص');
  const [qameezLength, setQameezLength] = useState<number>(profileToEdit?.qameezLength || 41.5);
  const [shoulder, setShoulder] = useState<number>(profileToEdit?.shoulder || 18.5);
  const [chest, setChest] = useState<number>(profileToEdit?.chest || 42.0);
  const [waist, setWaist] = useState<number>(profileToEdit?.waist || 40.0);
  const [hip, setHip] = useState<number>(profileToEdit?.hip || 44.0);
  const [sleeve, setSleeve] = useState<number>(profileToEdit?.sleeve || 24.0);
  const [cuff, setCuff] = useState<number>(profileToEdit?.cuff || 9.0);
  const [neck, setNeck] = useState<number>(profileToEdit?.neck || 16.0);
  const [shalwarLength, setShalwarLength] = useState<number>(profileToEdit?.shalwarLength || 39.5);
  const [paincha, setPaincha] = useState<number>(profileToEdit?.paincha || 8.5);
  const [shalwarGhera, setShalwarGhera] = useState<number>(profileToEdit?.shalwarGhera || 21.0);

  const [collarType, setCollarType] = useState<CollarType>(profileToEdit?.collarType || 'simple_ban');
  const [pocketType, setPocketType] = useState<PocketType>(profileToEdit?.pocketType || 'one_front_side');
  const [damanType, setDamanType] = useState<DamanType>(profileToEdit?.damanType || 'round');
  const [customNotes, setCustomNotes] = useState(profileToEdit?.customNotes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: MeasurementProfile = {
      id: profileToEdit?.id || 'meas-' + Date.now(),
      customerId: customer.id,
      title: title.trim() || 'سنڌي سوٽ ماپ',
      createdAt: profileToEdit?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      qameezLength,
      shoulder,
      chest,
      waist,
      hip,
      sleeve,
      cuff,
      neck,
      shalwarLength,
      paincha,
      shalwarGhera,
      collarType,
      pocketType,
      damanType,
      customNotes: customNotes.trim(),
    };

    onSaveProfile(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden text-right font-sindhi my-6 animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-amber-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base">ماپ جو پروفائل محفوظ ڪريو</h3>
              <p className="text-xs text-amber-200">گراهڪ: {customer.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-amber-800 text-stone-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ماپ جو عنوان (پروفائل نالو):
            </label>
            <input
              type="text"
              required
              placeholder="مثال: عيد اسپيشل / ريگولر فٽ / واسڪٽ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 space-y-3">
            <span className="font-bold text-xs text-stone-800">قميص جا ماپ (انچن ۾):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-stone-600 mb-0.5">قميص ڊگھائي:</label>
                <input
                  type="number"
                  step="0.25"
                  value={qameezLength}
                  onChange={(e) => setQameezLength(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">تيرا (Shoulder):</label>
                <input
                  type="number"
                  step="0.25"
                  value={shoulder}
                  onChange={(e) => setShoulder(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">ڇاتي (Chest):</label>
                <input
                  type="number"
                  step="0.25"
                  value={chest}
                  onChange={(e) => setChest(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">پيٽ (Waist):</label>
                <input
                  type="number"
                  step="0.25"
                  value={waist}
                  onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">ٻانهن (Sleeve):</label>
                <input
                  type="number"
                  step="0.25"
                  value={sleeve}
                  onChange={(e) => setSleeve(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">ڪف (Cuff):</label>
                <input
                  type="number"
                  step="0.25"
                  value={cuff}
                  onChange={(e) => setCuff(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">گلو / ڪالر:</label>
                <input
                  type="number"
                  step="0.25"
                  value={neck}
                  onChange={(e) => setNeck(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 space-y-3">
            <span className="font-bold text-xs text-stone-800">شلوار جا ماپ (انچن ۾):</span>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-stone-600 mb-0.5">شلوار ڊگھائي:</label>
                <input
                  type="number"
                  step="0.25"
                  value={shalwarLength}
                  onChange={(e) => setShalwarLength(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">پانچو (Paincha):</label>
                <input
                  type="number"
                  step="0.25"
                  value={paincha}
                  onChange={(e) => setPaincha(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-0.5">گهيرو / آسن:</label>
                <input
                  type="number"
                  step="0.25"
                  value={shalwarGhera}
                  onChange={(e) => setShalwarGhera(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border rounded bg-white font-latin font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 mb-1">ڪالر اسٽائل:</label>
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
              <label className="block text-stone-700 mb-1">کيسي اسٽائل:</label>
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
              <label className="block text-stone-700 mb-1">دامن اسٽائل:</label>
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              خاص نوٽس ۽ هدايتون:
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="مثال: ٻانهن ۾ هلڪي پليٽس، موبائل لاءِ اندروني کيسي..."
              className="w-full p-2 border rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-xs"
            >
              رد ڪريو
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ماپ محفوظ ڪريو</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
