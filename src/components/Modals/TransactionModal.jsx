import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CATEGORIES, CATEGORY_ICONS } from '../../data/mockData';
import { format } from 'date-fns';

const ACCOUNTS = ['Main Account', 'Savings Account', 'Credit Card', 'Investment Account'];

const defaultForm = {
  description: '',
  amount: '',
  type: 'expense',
  category: 'Food & Dining',
  date: format(new Date(), 'yyyy-MM-dd'),
  account: 'Main Account',
  status: 'completed',
};

export default function TransactionModal() {
  const { modal, closeModal, addTransaction, editTransaction, showNotification, darkMode } = useStore();
  const isEdit = modal.type === 'editTransaction';
  const isOpen = modal.open && (modal.type === 'addTransaction' || isEdit);

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && modal.data) {
      setForm({ ...modal.data, amount: String(modal.data.amount) });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [modal]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) e.amount = 'Valid amount required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tx = { ...form, amount: parseFloat(form.amount) };
    if (isEdit) {
      editTransaction(modal.data.id, tx);
      showNotification('Transaction updated! ✏️', 'success');
    } else {
      addTransaction(tx);
      showNotification('Transaction added! 🎉', 'success');
    }
    closeModal();
  };

  const categories = CATEGORIES[form.type] || CATEGORIES.expense;

  const inputClass = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
    darkMode
      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500/50 focus:bg-white/8'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:bg-white'
  }`;

  const labelClass = `block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'
            }`}
          >
            {/* Header */}
            <div className={`relative px-6 pt-6 pb-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isEdit ? [0, 360] : [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl"
                >
                  {isEdit ? '✏️' : '➕'}
                </motion.div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {isEdit ? 'Edit Transaction' : 'Add Transaction'}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {isEdit ? 'Update transaction details' : 'Record a new transaction'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div>
                <label className={labelClass}>Type</label>
                <div className={`flex rounded-xl overflow-hidden border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  {['income', 'expense'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          type: t,
                          category: CATEGORIES[t][0],
                        }));
                      }}
                      className={`flex-1 py-2.5 text-sm font-medium capitalize transition-all ${
                        form.type === t
                          ? t === 'income'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                          : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t === 'income' ? '💵 Income' : '💸 Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="e.g., Monthly Salary, Netflix, Grocery..."
                  className={`${inputClass} ${errors.description ? 'border-red-500/50' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.description}
                  </p>
                )}
              </div>

              {/* Amount + Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00"
                    className={`${inputClass} ${errors.amount ? 'border-red-500/50' : ''}`}
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.amount}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Category</label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, category: cat }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium border transition-all ${
                        form.category === cat
                          ? 'bg-violet-600 text-white border-violet-500'
                          : darkMode
                          ? 'border-white/10 text-gray-400 hover:bg-white/5'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{CATEGORY_ICONS[cat] || '📊'}</span>
                      <span className="text-center leading-tight">{cat.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Account</label>
                  <select
                    value={form.account}
                    onChange={e => setForm(p => ({ ...p, account: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    darkMode
                      ? 'border-white/10 text-gray-400 hover:bg-white/5'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14} />
                  {isEdit ? 'Save Changes' : 'Add Transaction'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
