import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '../../store/useStore';
import { getMonthlyData } from '../../data/mockData';

export default function QuickStats() {
  const { transactions, darkMode } = useStore();
  const monthly = getMonthlyData(transactions);

  const textColor = darkMode ? '#9ca3af' : '#6b7280';
  const barData = monthly.map(m => ({ name: m.monthLabel.split(' ')[0], income: m.income, expenses: m.expenses }));

  const totalTx = transactions.length;
  const avgExpense = (
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) /
    Math.max(transactions.filter(t => t.type === 'expense').length, 1)
  ).toFixed(0);

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className={`rounded-2xl border p-5 ${
        darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="mb-4">
        <h3 className={`text-base font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Monthly Compare
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Income vs Expenses</p>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={barData} barGap={2} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
          <Tooltip
            contentStyle={{
              background: darkMode ? '#111827' : '#fff',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 11,
              color: darkMode ? '#fff' : '#111',
            }}
            formatter={(v, n) => [`₹${v.toLocaleString()}`, n]}
          />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} name="Income" />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={20} name="Expenses" opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>

      <div className={`grid grid-cols-3 gap-3 mt-3 pt-3 border-t ₹{darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        {[
          { label: 'Transactions', value: totalTx, emoji: '🔢' },
          { label: 'Avg Expense', value: `₹${avgExpense}`, emoji: '📉' },
          { label: 'Pending', value: pendingCount, emoji: '⏳' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-base mb-0.5">{stat.emoji}</div>
            <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
