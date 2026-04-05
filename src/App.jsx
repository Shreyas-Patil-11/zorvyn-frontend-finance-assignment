import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import TransactionModal from './components/Modals/TransactionModal';
import Notification from './components/Notification';
import { MOCK_TRANSACTIONS } from './data/mockData';

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  analytics: Analytics,
  insights: Insights,
};

const exportData = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Account', 'Status'];
  const rows = transactions.map(t => [
    t.date, t.description, t.category, t.type, t.amount, t.account, t.status
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finflow-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Background particles
function Particles({ darkMode }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: darkMode
              ? `radial-gradient(circle, ${['rgba(139,92,246,0.04)', 'rgba(59,130,246,0.03)', 'rgba(16,185,129,0.03)'][i % 3]} 0%, transparent 70%)`
              : `radial-gradient(circle, ${['rgba(139,92,246,0.06)', 'rgba(59,130,246,0.04)', 'rgba(16,185,129,0.04)'][i % 3]} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const { activePage, darkMode, transactions, showNotification, sidebarCollapsed } = useStore();

  const PageComponent = PAGES[activePage] || Dashboard;

  const handleExport = useCallback(() => {
    exportData(transactions);
    showNotification('Exported to CSV! 📥', 'success');
  }, [transactions, showNotification]);

  // Apply dark mode to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.backgroundColor = darkMode ? '#070711' : '#f8fafc';
    document.body.style.color = darkMode ? '#f3f4f6' : '#1f2937';
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#070711]' : 'bg-slate-50'}`}>
      <Particles darkMode={darkMode} />

      {/* Sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => useStore.getState().toggleSidebar()}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full z-40 md:hidden flex`}
        initial={{ x: -260 }}
        animate={{ x: sidebarCollapsed ? -260 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
        <Header onExport={handleExport} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <TransactionModal />

      {/* Notifications */}
      <Notification />

      {/* Viewer Banner */}
      <AnimatePresence>
        {useStore((s) => s.role) === 'viewer' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-xl shadow-xl text-sm whitespace-nowrap"
          >
            <span className="text-lg">👁️</span>
            <span className={darkMode ? 'text-amber-300' : 'text-amber-700'}>
              Viewer mode — read only. Switch role in sidebar for full access.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
