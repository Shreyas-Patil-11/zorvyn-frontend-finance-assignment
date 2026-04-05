import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PolarRadiusAxis, Cell
} from 'recharts';
import { useStore } from '../store/useStore';
import { getMonthlyData, getCategoryBreakdown, CATEGORY_COLORS, CATEGORY_ICONS } from '../data/mockData';
import { format, subDays } from 'date-fns';

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-xl p-3 shadow-xl border text-xs ${
        darkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900'
      }`}>
        <p className="font-semibold mb-1.5">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{entry.name}:</span>
            <span className="font-bold">₹{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { transactions, darkMode } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const monthly = getMonthlyData(transactions);
  const expenseBreakdown = getCategoryBreakdown(transactions, 'expense');
  const incomeBreakdown = getCategoryBreakdown(transactions, 'income');

  // Day of week analysis
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayData = days.map(day => {
    const dayTx = transactions.filter(t => {
      const d = new Date(t.date);
      return days[d.getDay()] === day;
    });
    return {
      day,
      spending: dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      count: dayTx.length,
    };
  });

  // Radar data - spending vs budget across categories
  const radarData = expenseBreakdown.slice(0, 6).map(item => ({
    category: item.category.split(' ')[0],
    spending: item.amount,
    avg: item.amount * 0.8,
  }));

  const textColor = darkMode ? '#9ca3af' : '#6b7280';
  const gridColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const tabs = [
    { id: 'overview', label: 'Overview', emoji: '📊' },
    { id: 'categories', label: 'Categories', emoji: '🏷️' },
    { id: 'trends', label: 'Trends', emoji: '📈' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-5"
    >
      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-2xl ${darkMode ? 'bg-gray-900/80 border border-white/5' : 'bg-white border border-gray-100 shadow-sm'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Monthly Bar Chart */}
          <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`text-base font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📊 Monthly Income vs Expenses
            </h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>6-month comparison</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} width={45} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" maxBarSize={36} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" maxBarSize={36} opacity={0.8} />
                <Bar dataKey="balance" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Balance" maxBarSize={36} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Day of Week + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Day of Week Spending */}
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`text-base font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                📅 Spending by Day of Week
              </h3>
              <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>When you spend the most</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#111827' : '#fff',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                      borderRadius: 12, fontSize: 11
                    }}
                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Spending']}
                  />
                  <Bar dataKey="spending" radius={[6, 6, 0, 0]} name="Spending" maxBarSize={30}>
                    {dayData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.spending === Math.max(...dayData.map(d => d.spending)) ? '#8b5cf6' : '#6366f1'}
                        opacity={entry.spending === Math.max(...dayData.map(d => d.spending)) ? 1 : 0.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`text-base font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🕸️ Spending Radar
              </h3>
              <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Top categories overview</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: textColor }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: textColor }} tickFormatter={v => `₹${v}`} />
                  <Radar name="Spending" dataKey="spending" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#111827' : '#fff',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                      borderRadius: 12, fontSize: 11
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Expense Categories */}
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`text-base font-bold font-display mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🔴 Expense Categories
              </h3>
              <div className="space-y-3">
                {expenseBreakdown.map((item, idx) => {
                  const total = expenseBreakdown.reduce((s, i) => s + i.amount, 0);
                  const pct = (item.amount / total * 100).toFixed(1);
                  return (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-base w-6 text-center">{CATEGORY_ICONS[item.category] || '📊'}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.category}</span>
                          <span className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹{item.amount.toLocaleString()}</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs w-10 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pct}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Income Categories */}
            <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h3 className={`text-base font-bold font-display mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                🟢 Income Categories
              </h3>
              <div className="space-y-3">
                {incomeBreakdown.map((item, idx) => {
                  const total = incomeBreakdown.reduce((s, i) => s + i.amount, 0);
                  const pct = (item.amount / total * 100).toFixed(1);
                  return (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-base w-6 text-center">{CATEGORY_ICONS[item.category] || '📊'}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.category}</span>
                          <span className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹{item.amount.toLocaleString()}</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs w-10 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pct}%</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`text-base font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📈 Savings Rate Trend
            </h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>How much you saved each month (%)</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthly.map(m => ({ ...m, savingsRate: ((m.balance / m.income) * 100).toFixed(1) }))} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={40} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#111827' : '#fff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                    borderRadius: 12, fontSize: 11
                  }}
                  formatter={v => [`${v}%`, 'Savings Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="savingsRate"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: darkMode ? '#111827' : '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                  name="Savings Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Balance */}
          <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h3 className={`text-base font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💰 Net Balance Growth
            </h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Monthly net (income - expenses)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} width={45} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#111827' : '#fff',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                    borderRadius: 12, fontSize: 11
                  }}
                  formatter={v => [`₹${v.toLocaleString()}`, 'Balance']}
                />
                <Bar dataKey="balance" radius={[6, 6, 0, 0]} name="Balance" maxBarSize={40}>
                  {monthly.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.balance >= 0 ? '#10b981' : '#ef4444'}
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
