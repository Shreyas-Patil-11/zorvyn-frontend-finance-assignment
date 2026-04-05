import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { getCategoryBreakdown } from '../../data/mockData';

const GOALS = [
  { category: 'Food & Dining', budget: 500, emoji: '🍔', color: '#ef4444' },
  { category: 'Entertainment', budget: 200, emoji: '🎬', color: '#a855f7' },
  { category: 'Shopping', budget: 400, emoji: '🛍️', color: '#ec4899' },
  { category: 'Transport', budget: 250, emoji: '🚗', color: '#f97316' },
];

export default function SpendingGoals() {
  const { transactions, darkMode } = useStore();
  const breakdown = getCategoryBreakdown(transactions, 'expense');

  // Only look at current month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTx = transactions.filter(t => t.date.startsWith(currentMonth) && t.type === 'expense');
  const monthBreakdown = {};
  monthTx.forEach(t => {
    monthBreakdown[t.category] = (monthBreakdown[t.category] || 0) + t.amount;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className={`rounded-2xl border p-5 ${
        darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-base font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Monthly Budget
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Spending vs budget goals
          </p>
        </div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl"
        >
          📊
        </motion.div>
      </div>

      <div className="space-y-3">
        {GOALS.map((goal, idx) => {
          const spent = monthBreakdown[goal.category] || 0;
          const pct = Math.min((spent / goal.budget) * 100, 100);
          const isOver = spent > goal.budget;
          const remaining = goal.budget - spent;

          return (
            <motion.div
              key={goal.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 + 0.6 }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{goal.emoji}</span>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {goal.category.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    ₹{spent.toFixed(0)}/₹{goal.budget}
                  </span>
                  {isOver ? (
                    <span className="text-xs bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-md font-medium">Over!</span>
                  ) : (
                    <span className="text-xs bg-green-500/15 text-green-400 px-1.5 py-0.5 rounded-md font-medium">
                      ₹{remaining.toFixed(0)} left
                    </span>
                  )}
                </div>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ₹{darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `₹{pct}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.1 + 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full transition-all"
                  style={{
                    background: isOver
                      ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                      : pct > 75
                      ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                      : `linear-gradient(90deg, ₹{goal.color}99, ₹{goal.color})`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={`mt-4 pt-3 border-t ₹{darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <p className={`text-xs text-center ₹{darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          💡 Budget goals reset every month
        </p>
      </div>
    </motion.div>
  );
}
