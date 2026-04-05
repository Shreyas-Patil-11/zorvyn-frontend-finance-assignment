import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronUp, ChevronDown, Trash2, Edit2,
  ArrowUpRight, ArrowDownRight, X, CheckCircle, Clock, SlidersHorizontal
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORIES } from '../data/mockData';
import { format } from 'date-fns';

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

function TransactionRow({ tx, idx, darkMode, role, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: idx * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border-b transition-colors ${
        darkMode
          ? 'border-white/5 hover:bg-white/3'
          : 'border-gray-50 hover:bg-violet-50/50'
      }`}
      style={{ background: hovered ? (darkMode ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.03)') : undefined }}
    >
      {/* Category Icon */}
      <td className="py-3 pl-4 pr-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}20` }}
        >
          {CATEGORY_ICONS[tx.category] || '💳'}
        </div>
      </td>
      {/* Description */}
      <td className="py-3 px-2">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{tx.description}</p>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tx.account}</p>
      </td>
      {/* Category */}
      <td className="py-3 px-2 hidden sm:table-cell">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: `${CATEGORY_COLORS[tx.category]}15`, color: CATEGORY_COLORS[tx.category] }}
        >
          {tx.category}
        </span>
      </td>
      {/* Date */}
      <td className={`py-3 px-2 text-xs hidden md:table-cell ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {format(new Date(tx.date), 'MMM d, yyyy')}
      </td>
      {/* Status */}
      <td className="py-3 px-2 hidden lg:table-cell">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${
          tx.status === 'completed'
            ? 'bg-green-500/10 text-green-400'
            : 'bg-amber-500/10 text-amber-400'
        }`}>
          {tx.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
          {tx.status}
        </span>
      </td>
      {/* Amount */}
      <td className="py-3 px-2 text-right">
        <span className={`text-sm font-bold flex items-center justify-end gap-0.5 ${
          tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {tx.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {formatCurrency(tx.amount)}
        </span>
      </td>
      {/* Actions */}
      {role === 'admin' && (
        <td className="py-3 pl-2 pr-4">
          <div className={`flex items-center gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => onEdit(tx)}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => onDelete(tx.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
              }`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </td>
      )}
    </motion.tr>
  );
}

export default function Transactions() {
  const { transactions, darkMode, role, filters, setFilter, resetFilters, deleteTransaction, openModal } = useStore();
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = [...new Set(transactions.map(t => t.category))].sort();

  const filtered = useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q)
      );
    }
    // Type
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
    // Category
    if (filters.category !== 'all') result = result.filter(t => t.category === filters.category);
    // Date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
      const days = daysMap[filters.dateRange];
      if (days) {
        result = result.filter(t => {
          const diff = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
          return diff <= days;
        });
      }
    }
    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'date') return filters.sortDir === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
      if (filters.sortBy === 'amount') return filters.sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      if (filters.sortBy === 'category') return filters.sortDir === 'desc' ? b.category.localeCompare(a.category) : a.category.localeCompare(b.category);
      return 0;
    });
    return result;
  }, [transactions, filters]);

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setFilter('sortBy', col);
      setFilter('sortDir', 'desc');
    }
  };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return null;
    return filters.sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 space-y-4"
    >
      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}
      >
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className={`flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl border text-sm ${
            darkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <Search size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <input
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              placeholder="Search transactions..."
              className="flex-1 bg-transparent outline-none placeholder:text-gray-500 text-sm"
            />
            {filters.search && (
              <button onClick={() => setFilter('search', '')}>
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className={`flex rounded-xl overflow-hidden border text-xs font-medium ${
            darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
          }`}>
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                onClick={() => setFilter('type', t)}
                className={`px-3 py-2 capitalize transition-all ${
                  filters.type === t
                    ? t === 'income' ? 'bg-emerald-500 text-white'
                      : t === 'expense' ? 'bg-rose-500 text-white'
                      : 'bg-violet-600 text-white'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              showFilters
                ? 'bg-violet-600 text-white border-violet-600'
                : darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <SlidersHorizontal size={12} />
            Filters
            {(filters.category !== 'all' || filters.dateRange !== 'all') && (
              <span className="w-4 h-4 bg-violet-400 text-white rounded-full text-xs flex items-center justify-center text-[10px]">!</span>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`flex flex-wrap gap-3 mt-3 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                {/* Category */}
                <select
                  value={filters.category}
                  onChange={e => setFilter('category', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium outline-none cursor-pointer ${
                    darkMode ? 'bg-gray-800 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <option value="all">All Categories</option>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Date Range */}
                <select
                  value={filters.dateRange}
                  onChange={e => setFilter('dateRange', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium outline-none cursor-pointer ${
                    darkMode ? 'bg-gray-800 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>

                {/* Sort */}
                <select
                  value={filters.sortBy}
                  onChange={e => setFilter('sortBy', e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium outline-none cursor-pointer ${
                    darkMode ? 'bg-gray-800 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <option value="date">Sort: Date</option>
                  <option value="amount">Sort: Amount</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Showing', value: `${filtered.length} transactions`, emoji: '🔢', color: 'text-violet-400' },
          { label: 'Income', value: formatCurrency(totalIncome), emoji: '📈', color: 'text-emerald-400' },
          { label: 'Expenses', value: formatCurrency(totalExpenses), emoji: '📉', color: 'text-rose-400' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-3 text-center ${
              darkMode ? 'bg-gray-900/60 border-white/5' : 'bg-white border-gray-100 shadow-sm'
            }`}
          >
            <div className="text-xl mb-0.5">{s.emoji}</div>
            <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl border overflow-hidden ${
          darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
        }`}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl"
            >
              🔍
            </motion.div>
            <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No transactions found
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Try adjusting your filters
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'border-white/5 text-gray-500' : 'border-gray-100 text-gray-400'
                }`}>
                  <th className="py-3 pl-4 pr-2 text-left w-12" />
                  <th
                    className="py-3 px-2 text-left cursor-pointer hover:text-violet-400 transition-colors"
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </th>
                  <th className="py-3 px-2 text-left hidden sm:table-cell">Category</th>
                  <th
                    className="py-3 px-2 text-left cursor-pointer hover:text-violet-400 transition-colors hidden md:table-cell"
                    onClick={() => handleSort('date')}
                  >
                    <span className="flex items-center gap-1">Date <SortIcon col="date" /></span>
                  </th>
                  <th className="py-3 px-2 text-left hidden lg:table-cell">Status</th>
                  <th
                    className="py-3 px-2 text-right cursor-pointer hover:text-violet-400 transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    <span className="flex items-center justify-end gap-1">Amount <SortIcon col="amount" /></span>
                  </th>
                  {role === 'admin' && <th className="py-3 pl-2 pr-4 text-left w-16" />}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((tx, idx) => (
                    <TransactionRow
                      key={tx.id}
                      tx={tx}
                      idx={idx}
                      darkMode={darkMode}
                      role={role}
                      onEdit={(tx) => openModal('editTransaction', tx)}
                      onDelete={(id) => deleteTransaction(id)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
