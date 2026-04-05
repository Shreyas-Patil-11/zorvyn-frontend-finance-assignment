import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { useStore } from '../../store/useStore';
import { getCategoryBreakdown, CATEGORY_ICONS } from '../../data/mockData';

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill={fill} className="text-lg" fontSize={24}>
        {CATEGORY_ICONS[payload.category] || '📊'}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={fill} fontWeight="bold" fontSize={14}>
        ₹{value.toLocaleString()}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#9ca3af" fontSize={11}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
};

export default function SpendingBreakdown() {
  const { transactions, darkMode } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewType, setViewType] = useState('expense');

  const data = getCategoryBreakdown(transactions, viewType);
  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={`rounded-2xl border p-5 ${
        darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-base font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🥧 Breakdown
          </h3>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            By category
          </p>
        </div>
        <div className={`flex rounded-xl overflow-hidden border text-xs font-medium ${
          darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
        }`}>
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              onClick={() => setViewType(t)}
              className={`px-3 py-1.5 capitalize transition-all ${
                viewType === t
                  ? t === 'expense'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-white'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={entry.color} opacity={index === activeIndex ? 1 : 0.6} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 w-full">
          {data.slice(0, 6).map((item, idx) => {
            const pct = total > 0 ? (item.amount / total * 100).toFixed(1) : 0;
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all overflow-hidden ${
                  activeIndex === idx
                    ? darkMode ? 'bg-white/5' : 'bg-gray-50'
                    : ''
                }`}
              >
                <span className="text-sm">{CATEGORY_ICONS[item.category] || '📊'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.category}
                    </p>
                    <span className={`text-xs font-bold ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className={`h-1 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-semibold tabular-nums shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-20 text-right`}>
  ₹{item.amount.toLocaleString()}
</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
