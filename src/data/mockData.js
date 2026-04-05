import { subDays, subMonths, format } from 'date-fns';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Rental Income'],
  expense: ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Travel'],
};

const CATEGORY_ICONS = {
  'Salary': '💼',
  'Freelance': '💻',
  'Investment': '📈',
  'Bonus': '🎁',
  'Rental Income': '🏠',
  'Food & Dining': '🍔',
  'Shopping': '🛍️',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Health': '💊',
  'Utilities': '⚡',
  'Education': '📚',
  'Travel': '✈️',
};

const CATEGORY_COLORS = {
  'Salary': '#8b5cf6',
  'Freelance': '#06b6d4',
  'Investment': '#10b981',
  'Bonus': '#f59e0b',
  'Rental Income': '#3b82f6',
  'Food & Dining': '#ef4444',
  'Shopping': '#ec4899',
  'Transport': '#f97316',
  'Entertainment': '#a855f7',
  'Health': '#14b8a6',
  'Utilities': '#eab308',
  'Education': '#6366f1',
  'Travel': '#0ea5e9',
};

const generateTransactions = () => {
  const transactions = [];
  let id = 1;

  // Generate 6 months of data
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const baseDate = subMonths(new Date(), monthOffset);

    // Monthly salary
    transactions.push({
      id: id++,
      date: format(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1), 'yyyy-MM-dd'),
      description: 'Monthly Salary',
      category: 'Salary',
      type: 'income',
      amount: 5800 + Math.floor(Math.random() * 400),
      account: 'Main Account',
      status: 'completed',
    });

    // Freelance income (some months)
    if (Math.random() > 0.3) {
      transactions.push({
        id: id++,
        date: format(new Date(baseDate.getFullYear(), baseDate.getMonth(), Math.floor(Math.random() * 15) + 5), 'yyyy-MM-dd'),
        description: 'Freelance Project Payment',
        category: 'Freelance',
        type: 'income',
        amount: 800 + Math.floor(Math.random() * 1200),
        account: 'Savings Account',
        status: 'completed',
      });
    }

    // Investment returns
    if (Math.random() > 0.5) {
      transactions.push({
        id: id++,
        date: format(new Date(baseDate.getFullYear(), baseDate.getMonth(), Math.floor(Math.random() * 20) + 1), 'yyyy-MM-dd'),
        description: 'Investment Returns',
        category: 'Investment',
        type: 'income',
        amount: 200 + Math.floor(Math.random() * 600),
        account: 'Investment Account',
        status: 'completed',
      });
    }

    // Regular expenses (10-15 per month)
    const expenseCount = 10 + Math.floor(Math.random() * 6);
    const expenseCategories = CATEGORIES.expense;

    for (let i = 0; i < expenseCount; i++) {
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const day = Math.floor(Math.random() * 28) + 1;

      const amountMap = {
        'Food & Dining': 15 + Math.floor(Math.random() * 85),
        'Shopping': 30 + Math.floor(Math.random() * 220),
        'Transport': 20 + Math.floor(Math.random() * 80),
        'Entertainment': 15 + Math.floor(Math.random() * 100),
        'Health': 25 + Math.floor(Math.random() * 150),
        'Utilities': 60 + Math.floor(Math.random() * 120),
        'Education': 30 + Math.floor(Math.random() * 200),
        'Travel': 100 + Math.floor(Math.random() * 500),
      };

      const descMap = {
        'Food & Dining': ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Bakery', 'Sushi Bar'],
        'Shopping': ['Amazon Order', 'Nike Store', 'IKEA Purchase', 'Online Shopping', 'Apple Store', 'H&M'],
        'Transport': ['Uber Ride', 'Gas Station', 'Metro Card', 'Parking Fee', 'Car Wash', 'Lyft'],
        'Entertainment': ['Netflix', 'Spotify', 'Cinema Tickets', 'Gaming', 'Concert Tickets', 'Steam Games'],
        'Health': ['Pharmacy', 'Doctor Visit', 'Gym Membership', 'Dental Care', 'Eye Care'],
        'Utilities': ['Electricity Bill', 'Internet Bill', 'Water Bill', 'Phone Bill', 'Gas Bill'],
        'Education': ['Online Course', 'Books', 'Workshop Fee', 'Tutoring', 'Certification'],
        'Travel': ['Hotel Booking', 'Flight Ticket', 'Airbnb', 'Travel Insurance', 'Car Rental'],
      };

      const descs = descMap[category];
      transactions.push({
        id: id++,
        date: format(new Date(baseDate.getFullYear(), baseDate.getMonth(), day), 'yyyy-MM-dd'),
        description: descs[Math.floor(Math.random() * descs.length)],
        category,
        type: 'expense',
        amount: amountMap[category],
        account: Math.random() > 0.5 ? 'Main Account' : 'Credit Card',
        status: Math.random() > 0.9 ? 'pending' : 'completed',
      });
    }
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const MOCK_TRANSACTIONS = generateTransactions();
export { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORIES };

export const getMonthlyData = (transactions) => {
  const months = {};

  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // "YYYY-MM"
    if (!months[month]) {
      months[month] = { month, income: 0, expenses: 0, balance: 0 };
    }
    if (t.type === 'income') {
      months[month].income += t.amount;
    } else {
      months[month].expenses += t.amount;
    }
    months[month].balance = months[month].income - months[month].expenses;
  });

  return Object.values(months)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      monthLabel: format(new Date(m.month + '-01'), 'MMM yyyy'),
    }));
};

export const getCategoryBreakdown = (transactions, type = 'expense') => {
  const cats = {};
  transactions
    .filter(t => t.type === type)
    .forEach(t => {
      if (!cats[t.category]) {
        cats[t.category] = { category: t.category, amount: 0, count: 0, color: CATEGORY_COLORS[t.category] };
      }
      cats[t.category].amount += t.amount;
      cats[t.category].count += 1;
    });

  return Object.values(cats).sort((a, b) => b.amount - a.amount);
};

export const getSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;
  return { income, expenses, balance, savingsRate };
};

export const getInsights = (transactions) => {
  const monthly = getMonthlyData(transactions);
  const categoryBreakdown = getCategoryBreakdown(transactions, 'expense');

  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const topCategory = categoryBreakdown[0];
  const expenseChange = prevMonth
    ? (((lastMonth?.expenses - prevMonth?.expenses) / prevMonth?.expenses) * 100).toFixed(1)
    : 0;

  const incomeChange = prevMonth
    ? (((lastMonth?.income - prevMonth?.income) / prevMonth?.income) * 100).toFixed(1)
    : 0;

  // Day of week spending
  const daySpending = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const day = days[new Date(t.date).getDay()];
    daySpending[day] = (daySpending[day] || 0) + t.amount;
  });
  const busiestDay = Object.entries(daySpending).sort((a, b) => b[1] - a[1])[0];

  return {
    topCategory,
    expenseChange: parseFloat(expenseChange),
    incomeChange: parseFloat(incomeChange),
    busiestDay: busiestDay ? busiestDay[0] : 'Friday',
    lastMonth,
    prevMonth,
    savingsRate: lastMonth ? ((lastMonth.balance / lastMonth.income) * 100).toFixed(1) : 0,
  };
};
