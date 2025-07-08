import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Transaction, DashboardStats } from '../types';
import { formatCurrency } from '../utils/currency';
import { clsx } from 'clsx';

interface DashboardProps {
  transactions: Transaction[];
  stats: DashboardStats;
  isDark: boolean;
}

export function Dashboard({ transactions, stats, isDark }: DashboardProps) {
  // Sample data for charts - in real app this would be calculated from transactions
  const monthlyData = [
    { month: 'Jan', income: 5000, expenses: 3200 },
    { month: 'Feb', income: 5200, expenses: 3400 },
    { month: 'Mar', income: 4800, expenses: 3100 },
    { month: 'Apr', income: 5500, expenses: 3800 },
    { month: 'May', income: 5300, expenses: 3600 },
    { month: 'Jun', income: 5700, expenses: 4200 },
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 1200, color: '#ef4444' },
    { name: 'Transportation', value: 800, color: '#3b82f6' },
    { name: 'Shopping', value: 600, color: '#8b5cf6' },
    { name: 'Entertainment', value: 400, color: '#f59e0b' },
    { name: 'Bills', value: 900, color: '#10b981' },
  ];

  const recentTransactions = transactions.slice(0, 5);

  const statCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(stats.monthlyIncome),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ArrowUpIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(stats.monthlyExpenses),
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: CreditCardIcon,
      color: 'bg-red-500',
    },
    {
      title: 'Savings Rate',
      value: `${stats.savingsRate.toFixed(1)}%`,
      change: '+2.4%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-primary-100">
              Here's your financial overview for this month
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={clsx('p-3 rounded-lg', stat.color)}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className={clsx(
                    'ml-2 flex items-center text-sm',
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expenses
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={isDark ? '#9ca3af' : '#6b7280'}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f9fafb' : '#111827'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDark ? '#f9fafb' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium',
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={clsx(
                    'text-sm font-semibold',
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCardIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Add your first transaction to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="font-medium">Add Income</p>
                  <p className="text-xs opacity-80">Record salary, freelance, etc.</p>
                </div>
              </div>
            </button>
            
            <button className="w-full btn-secondary text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">💳</span>
                </div>
                <div>
                  <p className="font-medium">Add Expense</p>
                  <p className="text-xs text-gray-500">Track your spending</p>
                </div>
              </div>
            </button>
            
            <button className="w-full btn-secondary text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">🎯</span>
                </div>
                <div>
                  <p className="font-medium">Set Budget</p>
                  <p className="text-xs text-gray-500">Create spending limits</p>
                </div>
              </div>
            </button>
            
            <button className="w-full btn-secondary text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-sm">📊</span>
                </div>
                <div>
                  <p className="font-medium">View Report</p>
                  <p className="text-xs text-gray-500">Monthly insights</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">🤖</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Spending Tip</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              You're spending 23% more on dining out this month. Consider meal planning to save $200.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🎯 Goal Progress</h4>
            <p className="text-sm text-green-700 dark:text-green-200">
              Great job! You're on track to reach your emergency fund goal 2 months early.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Budget Alert</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-200">
              You've used 85% of your entertainment budget. Consider adjusting your spending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}