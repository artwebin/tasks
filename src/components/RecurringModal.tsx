import React, { useState } from 'react';
import { X, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { RecurringSchedule } from '../types';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: RecurringSchedule) => void;
  initialSchedule?: RecurringSchedule;
}

export function RecurringModal({ isOpen, onClose, onSave, initialSchedule }: RecurringModalProps) {
  const [enabled, setEnabled] = useState(initialSchedule?.enabled ?? false);
  const [time, setTime] = useState(initialSchedule?.time ?? '09:00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ enabled, time });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recurring Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Clock className="w-5 h-5" />
                Enable Daily Recurring
              </label>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className="text-[#723b78] dark:text-[#e84545]"
              >
                {enabled ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
            
            {enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Daily Creation Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723b78] dark:focus:ring-[#e84545] focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}