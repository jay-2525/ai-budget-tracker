export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  tags: string[];
  receipt?: string;
  aiSuggestions?: {
    category: string;
    confidence: number;
    tags: string[];
  };
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AIConfig {
  provider: 'openai' | 'ollama';
  apiKey?: string;
  ollamaUrl?: string;
  model: string;
  enabled: boolean;
}

export interface AppSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  aiConfig: AIConfig;
  categories: string[];
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
    monthlyReports: boolean;
  };
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  budgetPerformance: Array<{
    category: string;
    budgeted: number;
    spent: number;
    variance: number;
  }>;
  aiInsights?: string[];
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  budgetUtilization: number;
  goalProgress: number;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  tags: string[];
  receipt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget?: number;
  type: 'income' | 'expense' | 'both';
}