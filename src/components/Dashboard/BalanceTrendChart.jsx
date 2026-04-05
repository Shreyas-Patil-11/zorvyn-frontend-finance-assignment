import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { useStore } from '../../store/useStore';
import { getMonthlyData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-4 shadow-2xl border text-sm ${
          darkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900'
        }`}
      >
        <p className={`font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{entry.name}:</span>
            <span className="font-bold">
              ₹{entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

export default function BalanceTrendChart() {
  const { transactions, darkMode } = useStore();
  const monthly = getMonthlyData(transactions);
  const [activeLines, setActiveLines] = useState({ income: true, expenses: true, balance: true });

  const toggleLine = (key) => setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));

  const gridColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const axisColor = darkMode ? '#4b5563' : '#d1d5db';
  const textColor = darkMode ? '#9ca3af' : '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`rounded-2xl border p-5 ${
        darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className={`text-base font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💹 Balance Trend
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            6-month financial overview
          </p>
        </div>
        {/* toggles */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'income', label: 'Income', color: '#10b981' },
            { key: 'expenses', label: 'Expenses', color: '#ef4444' },
            { key: 'balance', label: 'Balance', color: '#8b5cf6' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => toggleLine(item.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                activeLines[item.key]
                  ? darkMode ? 'border-white/20 text-white bg-white/5' : 'border-gray-200 text-gray-700 bg-gray-50'
                  : darkMode ? 'border-white/5 text-gray-600' : 'border-gray-100 text-gray-400'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeLines[item.key] ? item.color : '#6b7280' }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            width={45}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          {activeLines.income && (
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              name="Income"
              dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          )}
          {activeLines.expenses && (
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              name="Expenses"
              dot={{ fill: '#ef4444', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          )}
          {activeLines.balance && (
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#balanceGrad)"
              name="Balance"
              dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
