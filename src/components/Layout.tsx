import React, { useState } from 'react';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  BellIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onAddTransaction: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Transactions', href: 'transactions', icon: CreditCardIcon },
  { name: 'Analytics', href: 'analytics', icon: ChartBarIcon },
  { name: 'Settings', href: 'settings', icon: CogIcon },
];

export function Layout({ 
  children, 
  currentPage, 
  onPageChange, 
  onAddTransaction,
  isDark,
  onThemeToggle 
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={clsx('min-h-screen', isDark && 'dark')}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💰</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Budget Tracker
                </h1>
              </div>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onPageChange(item.href)}
                    className={clsx(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200',
                      currentPage === item.href
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        'mr-3 flex-shrink-0 h-6 w-6',
                        currentPage === item.href
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="ml-2 text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {currentPage}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={onThemeToggle}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  {isDark ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200">
                  <BellIcon className="h-5 w-5" />
                </button>
                
                <button
                  onClick={onAddTransaction}
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Transaction</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">💰</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Budget Tracker
                  </h1>
                </div>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onPageChange(item.href);
                      setSidebarOpen(false);
                    }}
                    className={clsx(
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left',
                      currentPage === item.href
                        ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    )}
                  >
                    <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}