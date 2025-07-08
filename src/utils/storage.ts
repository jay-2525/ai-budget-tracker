import type { Transaction, Budget, Goal, AppSettings, Category } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_tracker_transactions',
  BUDGETS: 'budget_tracker_budgets',
  GOALS: 'budget_tracker_goals',
  SETTINGS: 'budget_tracker_settings',
  CATEGORIES: 'budget_tracker_categories',
} as const;

export class StorageService {
  static getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  static getBudgets(): Budget[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading budgets:', error);
      return [];
    }
  }

  static saveBudgets(budgets: Budget[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  }

  static getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading goals:', error);
      return [];
    }
  }

  static saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        currency: 'USD',
        theme: 'system',
        aiConfig: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          enabled: false,
        },
        categories: [
          'Food & Dining',
          'Transportation',
          'Shopping',
          'Entertainment',
          'Bills & Utilities',
          'Healthcare',
          'Travel',
          'Education',
          'Income',
          'Other'
        ],
        notifications: {
          budgetAlerts: true,
          goalReminders: true,
          monthlyReports: true,
        },
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        currency: 'USD',
        theme: 'system',
        aiConfig: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          enabled: false,
        },
        categories: [
          'Food & Dining',
          'Transportation',
          'Shopping',
          'Entertainment',
          'Bills & Utilities',
          'Healthcare',
          'Travel',
          'Education',
          'Income',
          'Other'
        ],
        notifications: {
          budgetAlerts: true,
          goalReminders: true,
          monthlyReports: true,
        },
      };
    }
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [
        { id: '1', name: 'Food & Dining', color: '#ef4444', icon: '🍽️', type: 'expense' },
        { id: '2', name: 'Transportation', color: '#3b82f6', icon: '🚗', type: 'expense' },
        { id: '3', name: 'Shopping', color: '#8b5cf6', icon: '🛍️', type: 'expense' },
        { id: '4', name: 'Entertainment', color: '#f59e0b', icon: '🎬', type: 'expense' },
        { id: '5', name: 'Bills & Utilities', color: '#10b981', icon: '💡', type: 'expense' },
        { id: '6', name: 'Healthcare', color: '#ec4899', icon: '🏥', type: 'expense' },
        { id: '7', name: 'Travel', color: '#06b6d4', icon: '✈️', type: 'expense' },
        { id: '8', name: 'Education', color: '#84cc16', icon: '📚', type: 'expense' },
        { id: '9', name: 'Income', color: '#22c55e', icon: '💰', type: 'income' },
        { id: '10', name: 'Other', color: '#6b7280', icon: '📦', type: 'both' },
      ];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  static exportData(): string {
    const data = {
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      goals: this.getGoals(),
      settings: this.getSettings(),
      categories: this.getCategories(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.budgets) this.saveBudgets(data.budgets);
      if (data.goals) this.saveGoals(data.goals);
      if (data.settings) this.saveSettings(data.settings);
      if (data.categories) this.saveCategories(data.categories);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}