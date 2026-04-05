import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getSummary, getMonthlyData } from '../../data/mockData';
import { format } from 'date-fns';

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function AnimatedNumber({ value, prefix = '₹' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="tabular-nums"
    >
      {formatCurrency(value)}
    </motion.span>
  );
}

const CardMascot = ({ type }) => {
  const mascots = {
    balance: (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="text-3xl select-none"
      >
        🏦
      </motion.div>
    ),
    income: (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-3xl select-none"
      >
        💵
      </motion.div>
    ),
    expenses: (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="text-3xl select-none"
      >
        🛒
      </motion.div>
    ),
    savings: (
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        className="text-3xl select-none"
      >
        🪙
      </motion.div>
    ),
  };
  return mascots[type] || null;
};

export default function SummaryCards() {
  const { transactions, darkMode } = useStore();
  const summary = getSummary(transactions);
  const monthly = getMonthlyData(transactions);
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const incomeChange = prevMonth
    ? (((lastMonth?.income - prevMonth?.income) / prevMonth?.income) * 100).toFixed(1)
    : 0;
  const expenseChange = prevMonth
    ? (((lastMonth?.expenses - prevMonth?.expenses) / prevMonth?.expenses) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      id: 'balance',
      title: 'Total Balance',
      value: summary.balance,
      subtitle: 'Net worth',
      change: null,
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      bgLight: 'from-violet-50 to-purple-50',
      accent: 'text-violet-400',
      border: 'border-violet-500/20',
      glow: 'shadow-violet-500/20',
      icon: <Wallet size={18} />,
    },
    {
      id: 'income',
      title: 'Total Income',
      value: summary.income,
      subtitle: `This month: ${formatCurrency(lastMonth?.income || 0)}`,
      change: parseFloat(incomeChange),
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      bgLight: 'from-emerald-50 to-green-50',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/20',
      icon: <TrendingUp size={18} />,
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: summary.expenses,
      subtitle: `This month: ${formatCurrency(lastMonth?.expenses || 0)}`,
      change: parseFloat(expenseChange),
      gradient: 'from-rose-500 via-red-500 to-pink-500',
      bgLight: 'from-rose-50 to-red-50',
      accent: 'text-rose-400',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/20',
      icon: <TrendingDown size={18} />,
      invertChange: true,
    },
    {
      id: 'savings',
      title: 'Savings Rate',
      value: null,
      rawValue: `${summary.savingsRate}%`,
      subtitle: 'Of total income saved',
      change: null,
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      bgLight: 'from-amber-50 to-orange-50',
      accent: 'text-amber-400',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/20',
      icon: <PiggyBank size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`relative overflow-hidden rounded-2xl border p-5 cursor-pointer group shadow-lg ${card.glow} ${
            darkMode
              ? `bg-gray-900/80 ${card.border}`
              : `bg-gradient-to-br ${card.bgLight} border-white shadow-sm`
          }`}
        >
          {/* Gradient Background Blob */}
          <div
            className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
          />

          {/* Top Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {card.title}
              </p>
              <div className={`text-2xl font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {card.value !== null
                  ? <AnimatedNumber value={card.value} />
                  : (
                    <motion.span
                      key={card.rawValue}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {card.rawValue}
                    </motion.span>
                  )
                }
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <CardMascot type={card.id} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{card.subtitle}</p>
            {card.change !== null && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                (card.invertChange ? card.change < 0 : card.change >= 0)
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {(card.invertChange ? card.change < 0 : card.change >= 0)
                  ? <ArrowUpRight size={11} />
                  : <ArrowDownRight size={11} />
                }
                {Math.abs(card.change)}%
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {card.id === 'savings' && (
            <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-white/60'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(parseFloat(summary.savingsRate), 100)}%` }}
                transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full`}
              />
            </div>
          )}

          {/* Decorative line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
          />
        </motion.div>
      ))}
    </div>
  );
}
