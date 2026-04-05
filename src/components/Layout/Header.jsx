import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Download, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';

const PAGE_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: 'Your financial overview', emoji: '🏠' },
  transactions: { title: 'Transactions', subtitle: 'Track your money flow', emoji: '💳' },
  analytics: { title: 'Analytics', subtitle: 'Deep dive into your data', emoji: '📊' },
  insights: { title: 'Insights', subtitle: 'Smart financial observations', emoji: '💡' },
};

export default function Header({ onExport }) {
  const { activePage, darkMode, role, openModal, toggleSidebar, transactions } = useStore();
  const page = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const notifications = [
    { id: 1, msg: 'Your savings rate this month is 23%! 🎉', time: '2m ago', type: 'success' },
    { id: 2, msg: `${pendingCount} pending transactions need attention`, time: '1h ago', type: 'warning' },
    { id: 3, msg: 'Monthly report is ready to download', time: '3h ago', type: 'info' },
  ];

  return (
    <header className={`sticky top-0 z-10 px-4 md:px-6 py-3 flex items-center justify-between border-b transition-colors duration-300 ${
      darkMode
        ? 'bg-gray-950/80 border-white/5 backdrop-blur-xl'
        : 'bg-white/80 border-gray-100 backdrop-blur-xl shadow-sm'
    }`}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{page.emoji}</span>
            <h2 className={`text-lg font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {page.title}
            </h2>
          </div>
          <p className={`text-xs hidden sm:block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · {page.subtitle}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExport}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            darkMode
              ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Download size={13} />
          Export
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-all ${
              darkMode ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Bell size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden z-50 border ${
                  darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'
                }`}
              >
                <div className={`px-4 py-3 flex items-center justify-between border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</p>
                  <button onClick={() => setShowNotifications(false)}>
                    <X size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`px-4 py-3 flex gap-3 border-b last:border-0 cursor-pointer transition-colors ${
                      darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'success' ? 'bg-green-400' : n.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{n.msg}</p>
                      <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{n.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Transaction - Admin Only */}
        {role === 'admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal('addTransaction')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        )}
      </div>
    </header>
  );
}
