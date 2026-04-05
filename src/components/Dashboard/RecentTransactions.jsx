import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../data/mockData';
import { format } from 'date-fns';

export default function RecentTransactions() {
  const { transactions, darkMode, setActivePage } = useStore();
  const recent = transactions.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`rounded-2xl border p-5 ${
        darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-base font-bold font-display ₹{darkMode ? 'text-white' : 'text-gray-900'}`}>
            🕐 Recent Activity
          </h3>
          <p className={`text-xs mt-0.5 ₹{darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Latest transactions</p>
        </div>
        <button
          onClick={() => setActivePage('transactions')}
          className={`flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors`}
        >
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="space-y-1">
        {recent.map((tx, idx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07 }}
            className={`flex items-center gap-3 p-2.5 rounded-xl group cursor-pointer transition-all ₹{
              darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}20` }}
            >
              {CATEGORY_ICONS[tx.category] || '💳'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {tx.description}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {tx.category} · {format(new Date(tx.date), 'MMM d')}
              </p>
            </div>

            {/* Status dot */}
            {tx.status === 'pending' && (
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
            )}

            {/* Amount */}
            <div className={`flex items-center gap-1 text-sm font-bold flex-shrink-0 ${
              tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {tx.type === 'income'
                ? <ArrowUpRight size={13} />
                : <ArrowDownRight size={13} />
              }
              ₹{tx.amount.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
