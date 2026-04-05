import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Notification() {
  const { notification, darkMode } = useStore();

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400" />,
    error: <AlertCircle size={16} className="text-rose-400" />,
    info: <Info size={16} className="text-blue-400" />,
    warning: <AlertCircle size={16} className="text-amber-400" />,
  };

  const colors = {
    success: darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200',
    error: darkMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200',
    info: darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200',
    warning: darkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-sm pointer-events-auto ${
              colors[notification.type] || colors.success
            } ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {icons[notification.type] || icons.success}
            <span className="font-medium">{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
