import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { TodoBoard } from './components/TodoBoard';
import { ListsProvider } from './context/ListsContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { X } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState<'all' | 'deleted' | 'templates'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class">
      <ListsProvider>
        <Layout isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}>
          <div className="flex h-[calc(100vh-4rem)] border-t border-gray-200 dark:border-gray-800">
            <div className={`fixed md:static inset-0 z-50 transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
              <div className="relative h-full">
                <div className="absolute inset-x-0 top-0 h-16 px-4 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://artwebin.com/media/2023/10/cropped-artwebin_logo_b-light2.png" 
                      alt="ArtWebIn Logo" 
                      className="h-8"
                    />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Artwebin Task</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white bg-white/10 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <Sidebar 
                  activeView={activeView} 
                  onViewChange={(view) => {
                    setActiveView(view);
                    setIsMobileMenuOpen(false);
                  }} 
                />
              </div>
            </div>
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            <TodoBoard activeView={activeView} />
          </div>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
          }}
        />
      </ListsProvider>
    </ThemeProvider>
  );
}

export default App;