import { motion } from 'framer-motion';
import SummaryCards from '../components/Dashboard/SummaryCards';
import BalanceTrendChart from '../components/Dashboard/BalanceTrendChart';
import SpendingBreakdown from '../components/Dashboard/SpendingBreakdown';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import QuickStats from '../components/Dashboard/QuickStats';
import SpendingGoals from '../components/Dashboard/SpendingGoals';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const { darkMode, role } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-6 space-y-5"
    >
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-5 ${
          darkMode
            ? 'bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-indigo-900/40 border border-violet-500/20'
            : 'bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border border-violet-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back! 👋
            </h2>
            <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {role === 'admin'
                ? "You have full access. Let's check your finances today."
                : "You're in viewer mode. Browse your financial summary below."}
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-5xl hidden sm:block"
          >
            {role === 'admin' ? '👑' : '📊'}
          </motion.div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl" />
        <div className="absolute -right-5 -bottom-8 w-20 h-20 rounded-full bg-purple-500/10 blur-xl" />
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdown />
          
        </div>
        <div>
          <QuickStats />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div className="space-y-5">
          
          <SpendingGoals />
        </div>
      </div>
    </motion.div>
  );
}
