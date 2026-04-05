import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TRANSACTIONS } from '../data/mockData';

export const useStore = create(
  persist(
    (set, get) => ({
      // Transactions
      transactions: MOCK_TRANSACTIONS,

      // Role
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Active page
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // Filters
      filters: {
        search: '',
        type: 'all',
        category: 'all',
        dateRange: 'all',
        sortBy: 'date',
        sortDir: 'desc',
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            search: '',
            type: 'all',
            category: 'all',
            dateRange: 'all',
            sortBy: 'date',
            sortDir: 'desc',
          },
        }),

      // Add transaction
      addTransaction: (transaction) =>
        set((s) => ({
          transactions: [
            {
              ...transaction,
              id: Date.now(),
              status: 'completed',
            },
            ...s.transactions,
          ],
        })),

      // Edit transaction
      editTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      // Delete transaction
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // Sidebar collapsed
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Modal
      modal: { open: false, type: null, data: null },
      openModal: (type, data = null) => set({ modal: { open: true, type, data } }),
      closeModal: () => set({ modal: { open: false, type: null, data: null } }),

      // Notification
      notification: null,
      showNotification: (msg, type = 'success') => {
        set({ notification: { msg, type } });
        setTimeout(() => set({ notification: null }), 3000);
      },
    }),
    {
      name: 'finflow-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);
