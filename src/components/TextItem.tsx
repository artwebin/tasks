import React from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { TextItem as TextItemType } from '../types';

interface TextItemProps {
  item: TextItemType;
  onDelete: () => void;
  onRestore?: () => void;
}

export function TextItem({ item, onDelete, onRestore }: TextItemProps) {
  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl group transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/30 ${
        item.isRemoving ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="flex-1 text-lg text-gray-700 dark:text-gray-200">
        {item.text}
      </span>
      
      <div className="flex items-center gap-2">
        {onRestore ? (
          <button
            onClick={onRestore}
            className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        ) : null}
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}