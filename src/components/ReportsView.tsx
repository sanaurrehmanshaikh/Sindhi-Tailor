import React, { useState, useMemo } from 'react';
import { TailorOrder, ShopSettings } from '../types';
import { formatPKR } from '../data/sindhiTranslations';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Wallet, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  Scissors, 
  Printer, 
  FileSpreadsheet, 
  ArrowUpRight,
  Filter,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';

interface ReportsViewProps {
  orders: TailorOrder[];
  shop: ShopSettings;
}

interface MonthlyData {
  monthKey: string;      // e.g. "2026-09"
  monthName: string;     // e.g. "سيپٽمبر 2026"
  shortName: string;     // e.g. "سيپٽمبر"
  year: string;          // e.g. "2026"
  collectedIncome: number; // رقم جيڪا دڪان ۾ وصول ٿي (Advance + Paid amounts)
  pendingBalance: number;  // باقي رقم جيڪا اڃا گراهڪن تي واجب الادا آهي
  totalBooked: number;     // ڪل آرڊر ماليت
  ordersCount: number;     // آرڊرن جو تعداد
  suitsCount: number;      // سوٽن / جوڙن جو تعداد
  collectionRate: number;  // وصولي جو سيڪڙو (%)
}

const SINDHI_MONTHS: Record<string, string> = {
  '01': 'جنوري',
  '02': 'فيبروري',
  '03': 'مارچ',
  '04': 'اپريل',
  '05': 'مئي',
  '06': 'جون',
  '07': 'جولاءِ',
  '08': 'آگسٽ',
  '09': 'سيپٽمبر',
  '10': 'آڪٽوبر',
  '11': 'نومبر',
  '12': 'ڊسمبر',
};

export const ReportsView: React.FC<ReportsViewProps> = ({ orders, shop }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [chartViewMode, setChartViewMode] = useState<'both' | 'income' | 'balance'>('both');

  // Available years in dataset
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    orders.forEach((o) => {
      if (o.orderDate) {
        years.add(o.orderDate.substring(0, 4));
      }
    });
    return Array.from(years).sort().reverse();
  }, [orders]);

  // Aggregate monthly data
  const monthlyAggregates = useMemo(() => {
    const map = new Map<string, MonthlyData>();

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;

      const dateStr = order.orderDate || '2026-10-01';
      const year = dateStr.substring(0, 4);
      const monthPart = dateStr.substring(5, 7);
      const monthKey = `${year}-${monthPart}`;

      if (selectedYear !== 'all' && year !== selectedYear) {
        return;
      }

      // Calculate collected money:
      // Total amount minus whatever is currently still remaining
      const collected = Math.max(0, order.totalAmount - order.remainingBalance);
      const pending = order.remainingBalance;

      if (!map.has(monthKey)) {
        const sMonth = SINDHI_MONTHS[monthPart] || monthPart;
        map.set(monthKey, {
          monthKey,
          monthName: `${sMonth} ${year}`,
          shortName: sMonth,
          year,
          collectedIncome: 0,
          pendingBalance: 0,
          totalBooked: 0,
          ordersCount: 0,
          suitsCount: 0,
          collectionRate: 0,
        });
      }

      const item = map.get(monthKey)!;
      item.collectedIncome += collected;
      item.pendingBalance += pending;
      item.totalBooked += order.totalAmount;
      item.ordersCount += 1;
      item.suitsCount += order.quantity || 1;
    });

    // Sort by chronological order
    const list = Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    // Calculate collection rates
    list.forEach((item) => {
      item.collectionRate = item.totalBooked > 0 
        ? Math.round((item.collectedIncome / item.totalBooked) * 100) 
        : 100;
    });

    return list;
  }, [orders, selectedYear]);

  // Global Totals across selected period
  const overallMetrics = useMemo(() => {
    let totalIncome = 0;
    let totalPending = 0;
    let totalBooked = 0;
    let totalSuits = 0;
    let totalOrders = 0;

    monthlyAggregates.forEach((m) => {
      totalIncome += m.collectedIncome;
      totalPending += m.pendingBalance;
      totalBooked += m.totalBooked;
      totalSuits += m.suitsCount;
      totalOrders += m.ordersCount;
    });

    const overallRate = totalBooked > 0 ? Math.round((totalIncome / totalBooked) * 100) : 100;
    const avgPerSuit = totalSuits > 0 ? Math.round(totalBooked / totalSuits) : 0;

    return {
      totalIncome,
      totalPending,
      totalBooked,
      totalSuits,
      totalOrders,
      overallRate,
      avgPerSuit,
    };
  }, [monthlyAggregates]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 font-sindhi" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 rounded-2xl p-5 border border-amber-700/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              ايڊمن ڪاروباري رپورٽس (Admin Dashboard Reports)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            ماهوار آمدني ۽ باقي واجب الادا رقم جو تجزيو
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            دڪان جي ڪل آمدني، اڳواٽ ڏنل پيمينٽس، ۽ گراهڪن تي باقي رهيل ادائيگين جو مهيني وار گراف ۽ چارٽ.
          </p>
        </div>

        {/* Controls: Year Filter & Print */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year selector */}
          <div className="flex items-center bg-stone-800 border border-stone-700 rounded-xl p-1 text-xs">
            <span className="px-2 text-stone-400">سال:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-stone-900 text-amber-300 rounded-lg px-2.5 py-1 font-latin border-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">سڀ سال (All)</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition print:hidden"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>رپورٽ پرنٽ ڪريو</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Total Income Collected */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-600">ڪل وصول ٿيل آمدني</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-latin">
            {formatPKR(overallMetrics.totalIncome)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>نقد مليل ايڊوانس ۽ ادايون</span>
          </p>
        </div>

        {/* 2. Total Pending Balance */}
        <div className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-600">باقي رهيل واجب الادا</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-800 font-latin">
            {formatPKR(overallMetrics.totalPending)}
          </div>
          <p className="text-[11px] text-rose-600 mt-1">
            گراهڪن کان هٿ ڪرڻ واري رقم
          </p>
        </div>

        {/* 3. Total Bookings */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-600">مجموعي آرڊر ماليت</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-latin">
            {formatPKR(overallMetrics.totalBooked)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            ڪل {overallMetrics.totalOrders} آرڊر ({overallMetrics.totalSuits} جوڙا)
          </p>
        </div>

        {/* 4. Recovery Rate */}
        <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-2xl p-4 border border-amber-800/40 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-200">وصولي جي شرح (Recovery)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-latin font-bold text-xs">
              %
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-latin">
            {overallMetrics.overallRate}%
          </div>
          <p className="text-[11px] text-stone-300 mt-1">
            اوسط في جوڙو: {overallMetrics.avgPerSuit} روپيا
          </p>
        </div>

      </div>

      {/* Main Bar Chart Section Visualizing Monthly Income & Pending Balances */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        
        {/* Chart Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                ماهوار آمدني بمقابله باقي رقم (Monthly Income vs Pending Balance)
              </h3>
              <p className="text-xs text-stone-500">
                هر مهيني جي وصول ٿيل ڪيش ۽ اڃا رهيل رقمن جو تقابلي بار چارٽ
              </p>
            </div>
          </div>

          {/* Toggle between Both, Income Only, Balance Only */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setChartViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                chartViewMode === 'both' ? 'bg-white text-stone-900 shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ٻئي ڏسو (آمدني ۽ باقي)
            </button>
            <button
              onClick={() => setChartViewMode('income')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                chartViewMode === 'income' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              صرف وصول ٿيل آمدني
            </button>
            <button
              onClick={() => setChartViewMode('balance')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                chartViewMode === 'balance' ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              صرف باقي رقم
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="w-full h-80 pt-4" dir="ltr">
          {monthlyAggregates.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-400 text-sm font-sindhi">
              هن چونڊيل عرصي لاءِ ڪو به آرڊر ڊيٽا ناهي.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyAggregates}
                margin={{ top: 20, right: 25, left: 10, bottom: 20 }}
                barGap={8}
                barCategoryGap="25%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="shortName" 
                  stroke="#64748B" 
                  fontSize={12}
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as MonthlyData;
                      return (
                        <div className="bg-stone-900 text-stone-100 p-3.5 rounded-xl shadow-xl border border-stone-700 text-right font-sindhi text-xs space-y-1.5 min-w-[200px]" dir="rtl">
                          <p className="font-bold text-amber-300 text-sm border-b border-stone-700 pb-1">
                            {data.monthName}
                          </p>
                          <div className="flex justify-between items-center text-stone-300">
                            <span>ڪل آرڊر تعداد:</span>
                            <span className="font-latin font-bold">{data.ordersCount} ({data.suitsCount} جوڙا)</span>
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>وصول ٿيل آمدني:</span>
                            <span className="font-latin font-bold">{formatPKR(data.collectedIncome)}</span>
                          </div>
                          <div className="flex justify-between items-center text-rose-400">
                            <span>باقي رهيل رقم:</span>
                            <span className="font-latin font-bold">{formatPKR(data.pendingBalance)}</span>
                          </div>
                          <div className="flex justify-between items-center text-stone-400 pt-1 border-t border-stone-800">
                            <span>ڪل ماليت:</span>
                            <span className="font-latin font-semibold">{formatPKR(data.totalBooked)}</span>
                          </div>
                          <div className="flex justify-between items-center text-amber-400">
                            <span>وصولي سيڪڙو:</span>
                            <span className="font-latin font-bold">{data.collectionRate}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                  formatter={(value) => {
                    if (value === 'collectedIncome') return 'وصول ٿيل آمدني (Collected Income)';
                    if (value === 'pendingBalance') return 'باقي واجب الادا رقم (Pending Balance)';
                    return value;
                  }}
                />
                
                {(chartViewMode === 'both' || chartViewMode === 'income') && (
                  <Bar 
                    dataKey="collectedIncome" 
                    name="collectedIncome" 
                    fill="#059669" 
                    radius={[6, 6, 0, 0]} 
                  />
                )}

                {(chartViewMode === 'both' || chartViewMode === 'balance') && (
                  <Bar 
                    dataKey="pendingBalance" 
                    name="pendingBalance" 
                    fill="#E11D48" 
                    radius={[6, 6, 0, 0]} 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend notes */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>ساوا بار: دڪان کي موصول ٿيل حقيقي آمدني (روپيا)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-600 inline-block" />
              <span>ڳاڙها بار: گراهڪن تي اڃا رهيل باقي پيمينٽ</span>
            </span>
          </div>
          <span className="font-latin text-[11px] text-stone-400">
            {shop.shopName} • {shop.city}
          </span>
        </div>

      </div>

      {/* Detailed Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-800" />
            <h3 className="font-bold text-stone-900 text-sm">
              ماهوار مالي خلاصي جي تفصيلي جدول (Monthly Breakdown Table)
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            ڪل {monthlyAggregates.length} مهينن جو رڪارڊ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-100/75 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="p-3.5">مهينو (Month)</th>
                <th className="p-3.5 text-center">آرڊر / جوڙا</th>
                <th className="p-3.5">ڪل بڪنگ رقم</th>
                <th className="p-3.5 text-emerald-800">وصول ٿيل آمدني</th>
                <th className="p-3.5 text-rose-800">باقي رقم (Pending)</th>
                <th className="p-3.5 text-center">وصولي شرح</th>
                <th className="p-3.5 text-center">حالت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {monthlyAggregates.map((m) => (
                <tr key={m.monthKey} className="hover:bg-amber-50/20 transition-colors">
                  <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{m.monthName}</span>
                  </td>
                  <td className="p-3.5 text-center font-latin text-stone-600">
                    <span className="font-bold">{m.ordersCount}</span> آرڊر ({m.suitsCount} جوڙا)
                  </td>
                  <td className="p-3.5 font-latin font-bold text-stone-800">
                    {formatPKR(m.totalBooked)}
                  </td>
                  <td className="p-3.5 font-latin font-extrabold text-emerald-700">
                    {formatPKR(m.collectedIncome)}
                  </td>
                  <td className="p-3.5 font-latin font-extrabold text-rose-700">
                    {m.pendingBalance === 0 ? '0 (صاف)' : formatPKR(m.pendingBalance)}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-latin">
                      <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full" 
                          style={{ width: `${m.collectionRate}%` }} 
                        />
                      </div>
                      <span className="text-[11px] font-bold text-stone-700">{m.collectionRate}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    {m.pendingBalance === 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        مڪمل وصول
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        باقي واجب الادا
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot className="bg-stone-100/90 font-bold border-t-2 border-stone-300 text-stone-900">
              <tr>
                <td className="p-3.5">ڪل مجموعو (Total):</td>
                <td className="p-3.5 text-center font-latin">
                  {overallMetrics.totalOrders} آرڊر ({overallMetrics.totalSuits} جوڙا)
                </td>
                <td className="p-3.5 font-latin">
                  {formatPKR(overallMetrics.totalBooked)}
                </td>
                <td className="p-3.5 font-latin text-emerald-800 font-extrabold">
                  {formatPKR(overallMetrics.totalIncome)}
                </td>
                <td className="p-3.5 font-latin text-rose-800 font-extrabold">
                  {formatPKR(overallMetrics.totalPending)}
                </td>
                <td className="p-3.5 text-center font-latin text-emerald-800 font-extrabold">
                  {overallMetrics.overallRate}%
                </td>
                <td className="p-3.5 text-center font-sindhi text-stone-500">
                  خلاصو
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
