import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Star, Zap, Target, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getInsights, getCategoryBreakdown, getMonthlyData, CATEGORY_ICONS } from '../data/mockData';

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

function InsightCard({ insight, idx, darkMode }) {
  const colorMap = {
    positive: { bg: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-500/20', badge: 'bg-emerald-500/15 text-emerald-400', icon: '✅' },
    negative: { bg: 'from-rose-500/10 to-red-500/10', border: 'border-rose-500/20', badge: 'bg-rose-500/15 text-rose-400', icon: '⚠️' },
    neutral: { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/20', badge: 'bg-violet-500/15 text-violet-400', icon: '💡' },
    warning: { bg: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-500/20', badge: 'bg-amber-500/15 text-amber-400', icon: '🔔' },
  };
  const colors = colorMap[insight.type] || colorMap.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br ${colors.bg} ${colors.border}`}
    >
      {/* Decoration */}
      <div className="absolute -top-4 -right-4 text-5xl opacity-10 select-none">{insight.emoji}</div>

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${colors.badge}`}>
          {insight.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{insight.tag}</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{insight.description}</p>
          {insight.value && (
            <p className={`text-xl font-bold font-display mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {insight.value}
            </p>
          )}
        </div>
      </div>

      {/* Progress if available */}
      {insight.progress !== undefined && (
        <div className={`mt-3 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${insight.progress}%` }}
            transition={{ duration: 1.5, delay: idx * 0.1 + 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
          />
        </div>
      )}
    </motion.div>
  );
}

export default function Insights() {
  const { transactions, darkMode } = useStore();
  const insights = getInsights(transactions);
  const monthlyData = getMonthlyData(transactions);
  const expenseBreak = getCategoryBreakdown(transactions, 'expense');

  const lastMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];

  const insightCards = [
    {
      emoji: '🏆',
      title: 'Top Spending Category',
      tag: 'Category',
      type: 'neutral',
      description: `Your biggest expense is "${insights.topCategory?.category}" with ${insights.topCategory?.count} transactions.`,
      value: formatCurrency(insights.topCategory?.amount || 0),
    },
    {
      emoji: insights.expenseChange > 0 ? '📈' : '📉',
      title: 'Monthly Expense Change',
      tag: 'Comparison',
      type: insights.expenseChange > 0 ? 'negative' : 'positive',
      description: insights.expenseChange > 0
        ? `Expenses increased by ${Math.abs(insights.expenseChange)}% compared to last month. Watch your spending!`
        : `Great job! Expenses decreased by ${Math.abs(insights.expenseChange)}% vs last month.`,
      value: `${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange}%`,
    },
    {
      emoji: '💰',
      title: 'Savings Rate This Month',
      tag: 'Savings',
      type: parseFloat(insights.savingsRate) > 20 ? 'positive' : parseFloat(insights.savingsRate) > 10 ? 'neutral' : 'warning',
      description: parseFloat(insights.savingsRate) > 20
        ? 'Excellent! You\'re saving more than 20% of your income this month.'
        : parseFloat(insights.savingsRate) > 10
        ? 'Decent savings rate. Try to push it above 20% for financial security.'
        : 'Your savings rate is low. Consider reducing discretionary spending.',
      value: `${insights.savingsRate}%`,
      progress: Math.min(parseFloat(insights.savingsRate), 100),
    },
    {
      emoji: '📅',
      title: 'Busiest Spending Day',
      tag: 'Behavior',
      type: 'neutral',
      description: `You tend to spend the most on ${insights.busiestDay}s. Consider planning your budget around this.`,
      value: insights.busiestDay,
    },
    {
      emoji: insights.incomeChange > 0 ? '🚀' : '😟',
      title: 'Income Trend',
      tag: 'Income',
      type: insights.incomeChange > 0 ? 'positive' : 'negative',
      description: insights.incomeChange > 0
        ? `Income grew by ${Math.abs(insights.incomeChange)}% this month. Keep it up!`
        : `Income dropped by ${Math.abs(insights.incomeChange)}% this month. Look for additional sources.`,
      value: `${insights.incomeChange > 0 ? '+' : ''}${insights.incomeChange}%`,
    },
    {
      emoji: '🎯',
      title: 'Financial Health Score',
      tag: 'Health',
      type: parseFloat(insights.savingsRate) > 15 ? 'positive' : 'warning',
      description: 'Based on your savings rate and spending patterns.',
      value: `${Math.min(Math.round(parseFloat(insights.savingsRate) * 3 + 40), 100)}/100`,
      progress: Math.min(parseFloat(insights.savingsRate) * 3 + 40, 100),
    },
  ];

  // Monthly comparison table data
  const comparisonRows = [
    { label: 'Total Income', lastVal: lastMonth?.income, prevVal: prevMonth?.income, emoji: '💵' },
    { label: 'Total Expenses', lastVal: lastMonth?.expenses, prevVal: prevMonth?.expenses, emoji: '💸' },
    { label: 'Net Balance', lastVal: lastMonth?.balance, prevVal: prevMonth?.balance, emoji: '💰' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-6"
    >
      {/* Header Mascot */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 border ${
          darkMode
            ? 'bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-indigo-900/30 border-violet-500/20'
            : 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-100'
        }`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="text-5xl flex-shrink-0"
          >
            🧠
          </motion.div>
          <div>
            <h2 className={`text-xl font-bold font-display mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Smart Financial Insights
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              AI-powered observations from your {transactions.length} transactions across {monthlyData.length} months.
            </p>
          </div>
        </div>
        <div className="absolute -right-5 -top-5 text-8xl opacity-5 select-none">💡</div>
      </motion.div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {insightCards.map((card, idx) => (
          <InsightCard key={idx} insight={card} idx={idx} darkMode={darkMode} />
        ))}
      </div>

      {/* Monthly Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <h3 className={`text-base font-bold font-display mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Month-over-Month Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-xs font-medium uppercase tracking-wider ${darkMode ? 'border-white/5 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
                <th className="py-2 text-left">Metric</th>
                <th className="py-2 text-right">{prevMonth?.monthLabel || 'Prev Month'}</th>
                <th className="py-2 text-right">{lastMonth?.monthLabel || 'This Month'}</th>
                <th className="py-2 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => {
                const change = row.prevVal > 0 ? (((row.lastVal - row.prevVal) / row.prevVal) * 100).toFixed(1) : 0;
                const isPositive = (row.label === 'Total Expenses') ? parseFloat(change) < 0 : parseFloat(change) >= 0;
                return (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.6 }}
                    className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-50'}`}
                  >
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        <span>{row.emoji}</span>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{row.label}</span>
                      </span>
                    </td>
                    <td className={`py-3 text-right ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatCurrency(row.prevVal || 0)}
                    </td>
                    <td className={`py-3 text-right font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(row.lastVal || 0)}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(parseFloat(change))}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <h3 className={`text-base font-bold font-display mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏅 Top Spending Categories Ranked
        </h3>
        <div className="space-y-3">
          {expenseBreak.slice(0, 5).map((item, idx) => {
            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            const total = expenseBreak.reduce((s, i) => s + i.amount, 0);
            const pct = (item.amount / total * 100).toFixed(1);
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 + 0.8 }}
                className={`flex items-center gap-4 p-3 rounded-xl ${darkMode ? 'bg-white/3' : 'bg-gray-50'}`}
              >
                <span className="text-xl">{medals[idx]}</span>
                <span className="text-lg">{CATEGORY_ICONS[item.category] || '📊'}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.category}</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(item.amount)}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: idx * 0.1 + 0.9 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium w-10 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pct}%</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
