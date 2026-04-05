import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, CreditCard, BarChart3, Lightbulb,
  ChevronLeft, ChevronRight, Moon, Sun, Shield, Eye, LogOut, Wallet
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
  { id: 'transactions', label: 'Transactions', icon: CreditCard, emoji: '💳' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, emoji: '📊' },
  { id: 'insights', label: 'Insights', icon: Lightbulb, emoji: '💡' },
];

export default function Sidebar() {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole, sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`relative flex flex-col h-full z-20 ${
        darkMode
          ? 'bg-gray-900/95 border-r border-white/5'
          : 'bg-white border-r border-gray-100 shadow-sm'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 pt-5 mb-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <motion.div
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-lg">💰</span>
        </motion.div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className={`text-lg font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                FinFlow
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Smart Finance</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Button */}
      <button
    onClick={toggleSidebar}
    className={`absolute top-5 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs z-30 shadow-md border transition-all duration-200 ${
          darkMode
            ? 'bg-gray-800 border-white/10 text-gray-400 hover:text-white'
            : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
        }`}
  >
    {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
  </button>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                sidebarCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? darkMode
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'bg-violet-50 text-violet-600'
                  : darkMode
                  ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-500 rounded-full"
                />
              )}
              <span className="text-base flex-shrink-0">{item.emoji}</span>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {sidebarCollapsed && (
                <div className={`absolute left-full ml-3 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
                }`}>
                  {item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className={`mx-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`} />

      {/* Role Switch */}
      <div className={`p-3 space-y-1 ${sidebarCollapsed ? 'px-2' : ''}`}>
        {!sidebarCollapsed && (
          <p className={`text-xs font-medium px-2 mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>ROLE</p>
        )}
        {['admin', 'viewer'].map((r) => (
          <motion.button
            key={r}
            onClick={() => setRole(r)}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center' : ''
            } ${
              role === r
                ? r === 'admin'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : darkMode
                ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {r === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="capitalize"
                >
                  {r === 'admin' ? '👑 Admin' : '👁️ Viewer'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 mt-1 ${
            sidebarCollapsed ? 'justify-center' : ''
          } ${
            darkMode
              ? 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* User Avatar */}
      <div className={`p-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">
            {role === 'admin' ? '👑' : '👤'}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {role === 'admin' ? 'Alex Admin' : 'Sam Viewer'}
                </p>
                <p className={`text-xs capitalize ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
