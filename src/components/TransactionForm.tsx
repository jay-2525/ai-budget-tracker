import React, { useState, useEffect } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type { Transaction, TransactionType, Category } from '../types';
import { parseCurrency } from '../utils/currency';
import { clsx } from 'clsx';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  transaction?: Transaction;
  aiEnabled?: boolean;
  onAIAnalyze?: (description: string, amount: number) => Promise<{
    category: string;
    confidence: number;
    tags: string[];
  } | null>;
}

export function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  categories,
  transaction,
  aiEnabled = false,
  onAIAnalyze
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<{
    category: string;
    confidence: number;
    tags: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
        tags: transaction.tags,
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
      });
    }
    setAiSuggestion(null);
  }, [transaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseCurrency(formData.amount);
    if (amount <= 0) return;

    onSubmit({
      type: formData.type,
      amount,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      tags: formData.tags,
    });

    onClose();
  };

  const handleAIAnalyze = async () => {
    if (!onAIAnalyze || !formData.description || !formData.amount) return;
    
    setIsAnalyzing(true);
    try {
      const suggestion = await onAIAnalyze(formData.description, parseCurrency(formData.amount));
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setFormData(prev => ({
        ...prev,
        category: aiSuggestion.category,
        tags: [...prev.tags, ...aiSuggestion.tags.filter(tag => !prev.tags.includes(tag))]
      }));
      setAiSuggestion(null);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredCategories = categories.filter(cat => 
    cat.type === formData.type || cat.type === 'both'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {transaction ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                      className={clsx(
                        'flex-1 py-2 px-4 rounded-lg border font-medium transition-colors',
                        formData.type === 'expense'
                          ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      💳 Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                      className={clsx(
                        'flex-1 py-2 px-4 rounded-lg border font-medium transition-colors',
                        formData.type === 'income'
                          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      💰 Income
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field flex-1"
                      placeholder="What was this for?"
                    />
                    {aiEnabled && onAIAnalyze && (
                      <button
                        type="button"
                        onClick={handleAIAnalyze}
                        disabled={isAnalyzing || !formData.description || !formData.amount}
                        className={clsx(
                          'px-3 py-2 rounded-lg border transition-colors',
                          isAnalyzing || !formData.description || !formData.amount
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                            : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300'
                        )}
                      >
                        {isAnalyzing ? (
                          <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                        ) : (
                          <SparklesIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Suggestion */}
                {aiSuggestion && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
                        🤖 AI Suggestion
                      </h4>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {Math.round(aiSuggestion.confidence * 100)}% confident
                      </span>
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                      Category: <strong>{aiSuggestion.category}</strong>
                    </p>
                    {aiSuggestion.tags.length > 0 && (
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                        Tags: {aiSuggestion.tags.join(', ')}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition-colors"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="input-field flex-1"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto sm:ml-3"
              >
                {transaction ? 'Update' : 'Add'} Transaction
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}