import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { TextItem } from './TextItem';
import { TodoInput } from './TodoInput';
import { TextInput } from './TextInput';
import { Trash2, RotateCcw, ChevronDown, ChevronUp, Save, Copy, GripVertical, ListTodo, ListPlus, Clock, AlarmClock } from 'lucide-react';
import { TodoList as TodoListType } from '../types';
import { useLists } from '../context/ListsContext';
import { Modal } from './Modal';
import { RecurringModal } from './RecurringModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface TodoListProps {
  list: TodoListType;
  isActive: boolean;
  isDragging?: boolean;
  onActivate: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  isTemplate?: boolean;
}

export function TodoList({ 
  list, 
  isActive, 
  isDragging,
  onActivate, 
  onDelete, 
  onRestore, 
  isTemplate 
}: TodoListProps) {
  const [isDeletedExpanded, setIsDeletedExpanded] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { 
    addTodoToList, 
    deleteTodoFromList, 
    toggleTodo, 
    updateTodoPriority, 
    restoreTodoInList, 
    permanentlyDeleteTodo,
    saveAsTemplate,
    useTemplate,
    addTextItemToList,
    deleteTextItemFromList,
    restoreTextItemInList,
    permanentlyDeleteTextItem,
    updateTemplateSchedule
  } = useLists();

  const handleAddTodo = (text: string) => {
    if (list.type === 'tasks') {
      addTodoToList(list.id, {
        id: Date.now(),
        text,
        completed: false,
        priority: 'low',
        isRemoving: false,
        isCompleting: false
      });
    } else {
      addTextItemToList(list.id, {
        id: Date.now(),
        text,
        isRemoving: false
      });
    }
  };

  const handleToggle = (todoId: number) => {
    toggleTodo(list.id, todoId);
    setTimeout(() => {
      deleteTodoFromList(list.id, todoId);
    }, 800);
  };

  const handleSaveTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveAsTemplate(list.id);
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTemplateModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.();
  };

  const handleRecurringClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRecurringModalOpen(true);
  };

  const ListTypeIcon = list.type === 'tasks' ? ListTodo : ListPlus;

  return (
    <>
      <motion.div 
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
          isActive 
            ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]' 
            : 'shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
        } ${isDragging ? 'opacity-50' : ''}`}
        onClick={onActivate}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                {...attributes}
                {...listeners}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <ListTypeIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {list.name}
                  </h2>
                  {isTemplate && list.recurringSchedule?.enabled && (
                    <AlarmClock className="w-5 h-5 text-[#723b78] dark:text-[#e84545]" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Created {formatDistanceToNow(new Date(list.createdAt))} ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!onRestore && !isTemplate && list.type === 'tasks' && (
                <button
                  onClick={handleSaveTemplate}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  title="Save as template"
                >
                  <Save className="w-5 h-5" />
                </button>
              )}
              {isTemplate && list.type === 'tasks' && (
                <>
                  <button
                    onClick={handleRecurringClick}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 transition-all rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    title="Set recurring schedule"
                  >
                    <AlarmClock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleUseTemplate}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    title="Use template"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </>
              )}
              {onRestore ? (
                <button
                  onClick={handleRestore}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-all rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700"
                  title="Restore list"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              ) : null}
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
                title={isTemplate ? "Delete template" : "Move to trash"}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {!isTemplate && (
              list.type === 'tasks' ? (
                <TodoInput onAdd={handleAddTodo} />
              ) : (
                <TextInput onAdd={handleAddTodo} />
              )
            )}
            <AnimatePresence mode="popLayout">
              {list.type === 'tasks' ? (
                list.todos.map(todo => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={() => handleToggle(todo.id)}
                      onDelete={() => deleteTodoFromList(list.id, todo.id)}
                      onPriorityChange={() => updateTodoPriority(list.id, todo.id)}
                    />
                  </motion.div>
                ))
              ) : (
                list.textItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <TextItem
                      item={item}
                      onDelete={() => deleteTextItemFromList(list.id, item.id)}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {!isTemplate && (
              <>
                {list.type === 'tasks' && list.deletedTodos.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeletedExpanded(!isDeletedExpanded);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {isDeletedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Deleted Tasks ({list.deletedTodos.length})
                    </button>
                    <AnimatePresence>
                      {isDeletedExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {list.deletedTodos.map(todo => (
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              onToggle={() => restoreTodoInList(list.id, todo.id)}
                              onDelete={() => permanentlyDeleteTodo(list.id, todo.id)}
                              onPriorityChange={() => {}}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {list.type === 'text' && list.deletedTextItems.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeletedExpanded(!isDeletedExpanded);
                      }}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {isDeletedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Deleted Items ({list.deletedTextItems.length})
                    </button>
                    <AnimatePresence>
                      {isDeletedExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-3 overflow-hidden"
                        >
                          {list.deletedTextItems.map(item => (
                            <TextItem
                              key={item.id}
                              item={item}
                              onDelete={() => permanentlyDeleteTextItem(list.id, item.id)}
                              onRestore={() => restoreTextItemInList(list.id, item.id)}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSubmit={(name) => {
          useTemplate(list.id, name);
        }}
        title="Create List from Template"
        placeholder="Enter list name..."
        submitText="Create List"
      />

      <RecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onSave={(schedule) => updateTemplateSchedule(list.id, schedule)}
        initialSchedule={list.recurringSchedule}
      />
    </>
  );
}