import React, { useState } from 'react';
import { PlusCircle, Moon, Sun, Menu } from 'lucide-react';
import { useLists } from '../context/ListsContext';
import { useTheme } from 'next-themes';
import { Modal } from './Modal';

interface LayoutProps {
  children: React.ReactNode;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Layout({ children, isMobileMenuOpen, setIsMobileMenuOpen }: LayoutProps) {
  const { addList } = useLists();
  const { theme, setTheme } = useTheme();
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b2e4a]/10 to-[#e84545]/10 dark:from-[#2b2e4a]/5 dark:to-[#e84545]/5 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative z-50">
        <div className="w-full px-4 md:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <img 
              src="https://artwebin.com/media/2023/10/cropped-artwebin_logo_b-light2.png" 
              alt="ArtWebIn Logo" 
              className="h-8"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Artwebin Task</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsNewListModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-gradient text-white px-3 md:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden md:inline">New List</span>
            </button>
          </div>
        </div>
      </header>
      <main className="w-full relative">
        {children}
      </main>

      <Modal
        isOpen={isNewListModalOpen}
        onClose={() => setIsNewListModalOpen(false)}
        onSubmit={addList}
        title="Create New List"
        placeholder="Enter list name..."
        submitText="Create List"
        showListTypeSelection={true}
      />
    </div>
  );
}