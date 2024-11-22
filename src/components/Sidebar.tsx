import React from 'react';
import { ListChecks, Trash2, Layout as LayoutIcon } from 'lucide-react';
import { useLists } from '../context/ListsContext';

interface SidebarProps {
  activeView: 'all' | 'deleted' | 'templates';
  onViewChange: (view: 'all' | 'deleted' | 'templates') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { lists, deletedLists, templateLists } = useLists();

  const navItems = [
    { id: 'all', label: 'All Lists', icon: ListChecks, count: lists.length },
    { id: 'deleted', label: 'Deleted Lists', icon: Trash2, count: deletedLists.length },
    { id: 'templates', label: 'Templates', icon: LayoutIcon, count: templateLists.length },
  ] as const;

  return (
    <nav className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-3 md:p-4 flex flex-col h-full">
      <div className="flex flex-col space-y-2 pt-16 md:pt-0">
        {navItems.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              activeView === id
                ? 'bg-brand-gradient text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="whitespace-nowrap">{label}</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-sm ${
              activeView === id
                ? 'bg-white/20'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-auto pt-4 text-center text-sm text-gray-400 dark:text-gray-500">
        © artwebin, ver. BETA
      </div>
    </nav>
  );
}