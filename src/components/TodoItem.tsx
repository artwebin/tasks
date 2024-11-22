import React from 'react';
import { Square, CheckSquare, Trash2, Flag } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onPriorityChange: () => void;
}

const priorityStyles = {
  low: {
    text: 'text-gray-400 dark:text-gray-500',
    bg: 'bg-gray-50 dark:bg-gray-700/30',
    border: 'border-gray-200 dark:border-gray-700'
  },
  medium: {
    text: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    border: 'border-yellow-400 dark:border-yellow-600'
  },
  high: {
    text: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-400 dark:border-rose-600'
  }
};

export function TodoItem({ todo, onToggle, onDelete, onPriorityChange }: TodoItemProps) {
  const priorityStyle = priorityStyles[todo.priority];

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl group transition-all duration-300 border ${
        priorityStyle.border
      } ${priorityStyle.bg} ${
        todo.isRemoving ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onToggle}
        className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        {todo.completed ? 
          <CheckSquare className="w-6 h-6 text-indigo-500 rounded-lg" /> :
          <Square className="w-6 h-6 rounded-lg" />
        }
      </button>
      <span 
        className={`flex-1 text-lg transition-all duration-500 ${
          todo.isCompleting || todo.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-200'
        }`}
      >
        {todo.text}
      </span>
      
      <button
        onClick={onPriorityChange}
        className={`opacity-0 group-hover:opacity-100 transition-all ${priorityStyle.text}`}
        title={`Priority: ${todo.priority}`}
      >
        <Flag className="w-5 h-5" fill="currentColor" />
      </button>
      
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}