import React, { useState } from 'react';
import { X, ListTodo, ListPlus } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string, type?: 'tasks' | 'text') => void;
  title: string;
  placeholder?: string;
  submitText?: string;
  showListTypeSelection?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  placeholder = 'Enter name...', 
  submitText = 'Create',
  showListTypeSelection = false
}: ModalProps) {
  const [value, setValue] = useState('');
  const [listType, setListType] = useState<'tasks' | 'text'>('tasks');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim(), showListTypeSelection ? listType : undefined);
      setValue('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          {showListTypeSelection && (
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setListType('tasks')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  listType === 'tasks'
                    ? 'border-[#723b78] dark:border-[#e84545] bg-[#723b78]/5 dark:bg-[#e84545]/5'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ListTodo className={`w-5 h-5 ${
                  listType === 'tasks'
                    ? 'text-[#723b78] dark:text-[#e84545]'
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
                <span className={listType === 'tasks'
                  ? 'text-[#723b78] dark:text-[#e84545] font-medium'
                  : 'text-gray-600 dark:text-gray-400'
                }>Tasks List</span>
              </button>
              <button
                type="button"
                onClick={() => setListType('text')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  listType === 'text'
                    ? 'border-[#723b78] dark:border-[#e84545] bg-[#723b78]/5 dark:bg-[#e84545]/5'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ListPlus className={`w-5 h-5 ${
                  listType === 'text'
                    ? 'text-[#723b78] dark:text-[#e84545]'
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
                <span className={listType === 'text'
                  ? 'text-[#723b78] dark:text-[#e84545] font-medium'
                  : 'text-gray-600 dark:text-gray-400'
                }>Text List</span>
              </button>
            </div>
          )}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723b78] dark:focus:ring-[#e84545] focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={!value.trim()}
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}