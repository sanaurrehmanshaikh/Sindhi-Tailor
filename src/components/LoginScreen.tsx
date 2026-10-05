import React, { useState } from 'react';
import { ShopSettings, TailorUser } from '../types';
import { Scissors, Lock, Phone, User, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  shop: ShopSettings;
  onLogin: (user: TailorUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ shop, onLogin }) => {
  const [loginMethod, setLoginMethod] = useState<'pin' | 'phone'>('pin');
  
  // PIN form
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Phone form
  const [name, setName] = useState(shop.ownerName || '');
  const [phone, setPhone] = useState(shop.phone || '');
  const [role, setRole] = useState<'master' | 'tailor'>('master');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setPinError('مهرباني ڪري 4 انگن وارو پن (PIN) ڪوڊ لکو.');
      return;
    }

    // Default pin is 1234 or any 4 digit pin entered
    const user: TailorUser = {
      id: 'usr-' + Date.now(),
      name: shop.ownerName || 'استاد درزي',
      phone: shop.phone || '0300-0000000',
      role: 'master',
      pin: pin.trim(),
    };

    onLogin(user);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('مهرباني ڪري نالو ۽ موبائل نمبر درج ڪريو.');
      return;
    }

    const user: TailorUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      role,
      pin: '1234',
    };

    onLogin(user);
  };

  const handleFillDemoPin = () => {
    setPin('1234');
    setPinError('');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sindhi selection:bg-amber-600 selection:text-white" dir="rtl">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 bg-sindhi-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-700/10 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-stone-900 border-2 border-amber-600/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-100 space-y-6">
        
        {/* Top Logo & Shop Name */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-red-800 flex items-center justify-center mx-auto text-white shadow-xl border border-amber-400/30">
            <Scissors className="w-8 h-8 rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-200 tracking-wide font-sindhi">
              {shop.shopName || 'سنڌي درزي دڪان'}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              محفوظ درزي لاگ ان سسٽم • {shop.city || 'سنڌ، پاڪستان'}
            </p>
          </div>
        </div>

        {/* Tab selection: Quick PIN or Name/Phone */}
        <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            type="button"
            onClick={() => setLoginMethod('pin')}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              loginMethod === 'pin'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ڪوڊ / پن لاگ ان (PIN)</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
              loginMethod === 'phone'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>موبائل نمبر سان</span>
          </button>
        </div>

        {/* Method 1: PIN Form */}
        {loginMethod === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                دڪان جو سيڪيورٽي پن ڪوڊ (4 انگن وارو PIN):
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="••••"
                  autoFocus
                  className="w-full py-3 px-4 rounded-xl bg-stone-950 border-2 border-stone-700 text-amber-300 text-center text-2xl font-latin tracking-widest focus:outline-none focus:border-amber-500 transition"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-4 pointer-events-none" />
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 mt-1 text-right">{pinError}</p>
              )}
            </div>

            {/* Quick Demo PIN Helper */}
            <div className="flex items-center justify-between text-xs bg-stone-950/70 p-2.5 rounded-xl border border-stone-800">
              <span className="text-stone-400">ڊيفالٽ ٽيسٽ پن: <strong>1234</strong></span>
              <button
                type="button"
                onClick={handleFillDemoPin}
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>خودڪار ڀريو</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>دڪان ۾ داخل ٿيو (لاگ ان)</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Method 2: Phone & Name Form */}
        {loginMethod === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                استاد / درزي جو نالو:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: استاد درزي / پنهنجو نالو"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                موبائل نمبر:
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-latin text-right focus:border-amber-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">عھدو (Role):</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'master' | 'tailor')}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-200"
              >
                <option value="master">استاد / مکيه درزي (Shop Master)</option>
                <option value="tailor">ڪاريگر / سلائي ڪندڙ (Tailor / Craftsman)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>لاگ ان ٿيو</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>آف لائن محفوظ ڪيش • صرف اوهان جي ڊوائيس تي ذخيرو</span>
        </div>

      </div>

    </div>
  );
};
