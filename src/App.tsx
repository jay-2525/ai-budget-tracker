import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { StorageService } from './utils/storage';
import { AIService } from './services/aiService';
import type { Transaction, DashboardStats, AppSettings, Category } from './types';
import { isDateInCurrentMonth } from './utils/date';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [categories, setCategories] = useState<Category[]>(StorageService.getCategories());
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [isDark, setIsDark] = useState(false);

  const aiService = new AIService(settings.aiConfig);

  useEffect(() => {
    const savedTransactions = StorageService.getTransactions();
    setTransactions(savedTransactions);

    // Initialize theme
    const savedTheme = settings.theme;
    if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    StorageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id 
          ? { ...transactionData, id: editingTransaction.id }
          : t
        )
      );
      setEditingTransaction(undefined);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAIAnalyze = async (description: string, amount: number) => {
    return await aiService.categorizeExpense(description, amount);
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setSettings(prev => ({
      ...prev,
      theme: newIsDark ? 'dark' : 'light'
    }));
  };

  // Calculate dashboard stats
  const currentMonthTransactions = transactions.filter(t => isDateInCurrentMonth(t.date));
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats: DashboardStats = {
    totalBalance: monthlyIncome - monthlyExpenses,
    monthlyIncome,
    monthlyExpenses,
    savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0,
    budgetUtilization: 75, // This would be calculated based on actual budgets
    goalProgress: 60, // This would be calculated based on actual goals
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} stats={stats} isDark={isDark} />;
      case 'transactions':
        return <TransactionsList 
          transactions={transactions} 
          onEdit={setEditingTransaction}
          onDelete={handleDeleteTransaction}
          categories={categories}
          isDark={isDark}
        />;
      case 'analytics':
        return <Analytics transactions={transactions} isDark={isDark} />;
      case 'settings':
        return <Settings 
          settings={settings} 
          onSettingsChange={setSettings}
          categories={categories}
          onCategoriesChange={setCategories}
          isDark={isDark}
        />;
      default:
        return <Dashboard transactions={transactions} stats={stats} isDark={isDark} />;
    }
  };

  return (
    <div className="App">
      <Layout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAddTransaction={() => setIsTransactionFormOpen(true)}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      >
        {renderPage()}
      </Layout>

      <TransactionForm
        isOpen={isTransactionFormOpen || !!editingTransaction}
        onClose={() => {
          setIsTransactionFormOpen(false);
          setEditingTransaction(undefined);
        }}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        categories={categories}
        transaction={editingTransaction}
        aiEnabled={settings.aiConfig.enabled}
        onAIAnalyze={handleAIAnalyze}
      />
    </div>
  );
}

// Placeholder components for other pages
function TransactionsList({ 
  transactions, 
  onEdit, 
  onDelete 
}: { 
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  categories: Category[];
  isDark: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {transactions.length} total transactions
        </div>
      </div>
      
      <div className="card">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start tracking your finances by adding your first transaction.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{transaction.description}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    {transaction.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {transaction.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Analytics({ transactions: _transactions }: { transactions: Transaction[]; isDark: boolean }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <div className="card">
        <p className="text-gray-500 dark:text-gray-400">Analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}

function Settings({ 
  settings, 
  onSettingsChange
}: { 
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  isDark: boolean;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.aiConfig.enabled}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    aiConfig: { ...settings.aiConfig, enabled: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable AI Features</span>
              </label>
            </div>
            
            {settings.aiConfig.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Provider
                  </label>
                  <select
                    value={settings.aiConfig.provider}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      aiConfig: { ...settings.aiConfig, provider: e.target.value as 'openai' | 'ollama' }
                    })}
                    className="input-field"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="ollama">Ollama (Local)</option>
                  </select>
                </div>
                
                {settings.aiConfig.provider === 'openai' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      value={settings.aiConfig.apiKey || ''}
                      onChange={(e) => onSettingsChange({
                        ...settings,
                        aiConfig: { ...settings.aiConfig, apiKey: e.target.value }
                      })}
                      className="input-field"
                      placeholder="sk-..."
                    />
                  </div>
                )}
                
                {settings.aiConfig.provider === 'ollama' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ollama URL
                    </label>
                    <input
                      type="url"
                      value={settings.aiConfig.ollamaUrl || 'http://localhost:11434'}
                      onChange={(e) => onSettingsChange({
                        ...settings,
                        aiConfig: { ...settings.aiConfig, ollamaUrl: e.target.value }
                      })}
                      className="input-field"
                      placeholder="http://localhost:11434"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={settings.aiConfig.model}
                    onChange={(e) => onSettingsChange({
                      ...settings,
                      aiConfig: { ...settings.aiConfig, model: e.target.value }
                    })}
                    className="input-field"
                    placeholder={settings.aiConfig.provider === 'openai' ? 'gpt-3.5-turbo' : 'llama2'}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => onSettingsChange({ ...settings, currency: e.target.value })}
                className="input-field"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
