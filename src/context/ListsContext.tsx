import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo, TodoList, TextItem, RecurringSchedule } from '../types';
import { toast } from 'sonner';

interface ListsContextType {
  lists: TodoList[];
  deletedLists: TodoList[];
  templateLists: TodoList[];
  activeListId: number | null;
  addList: (name: string, type?: 'tasks' | 'text') => void;
  deleteList: (id: number) => void;
  restoreList: (id: number) => void;
  permanentlyDeleteList: (id: number) => void;
  setActiveList: (id: number | null) => void;
  updateList: (id: number, updates: Partial<TodoList>) => void;
  addTodoToList: (listId: number, todo: Todo) => void;
  deleteTodoFromList: (listId: number, todoId: number) => void;
  toggleTodo: (listId: number, todoId: number) => void;
  updateTodoPriority: (listId: number, todoId: number) => void;
  restoreTodoInList: (listId: number, todoId: number) => void;
  permanentlyDeleteTodo: (listId: number, todoId: number) => void;
  saveAsTemplate: (listId: number) => void;
  deleteTemplate: (id: number) => void;
  useTemplate: (templateId: number, newName: string) => void;
  addTextItemToList: (listId: number, item: TextItem) => void;
  deleteTextItemFromList: (listId: number, itemId: number) => void;
  restoreTextItemInList: (listId: number, itemId: number) => void;
  permanentlyDeleteTextItem: (listId: number, itemId: number) => void;
  reorderLists: (view: 'all' | 'deleted' | 'templates', newOrder: TodoList[]) => void;
  updateTemplateSchedule: (templateId: number, schedule: RecurringSchedule) => void;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
};

const getOriginalName = (templateName: string) => {
  return templateName.replace(/\s*Template$/, '');
};

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<TodoList[]>(() => loadFromStorage('lists') || []);
  const [deletedLists, setDeletedLists] = useState<TodoList[]>(() => loadFromStorage('deletedLists') || []);
  const [templateLists, setTemplateLists] = useState<TodoList[]>(() => loadFromStorage('templateLists') || []);
  const [activeListId, setActiveListId] = useState<number | null>(() => loadFromStorage('activeListId'));

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('deletedLists', JSON.stringify(deletedLists));
  }, [deletedLists]);

  useEffect(() => {
    localStorage.setItem('templateLists', JSON.stringify(templateLists));
  }, [templateLists]);

  useEffect(() => {
    localStorage.setItem('activeListId', JSON.stringify(activeListId));
  }, [activeListId]);

  useEffect(() => {
    const checkRecurringTemplates = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      templateLists.forEach(template => {
        if (template.recurringSchedule?.enabled && template.recurringSchedule.time === currentTime) {
          const originalName = getOriginalName(template.name);
          
          setLists(prev => {
            const existingList = prev.find(list => list.name === originalName);
            if (existingList) {
              toast.info(`Replacing existing list "${originalName}"`);
            }
            return [
              {
                ...template,
                id: Date.now(),
                name: originalName,
                createdAt: new Date().toISOString(),
                deletedTodos: [],
                deletedTextItems: [],
                recurringSchedule: undefined
              },
              ...prev.filter(list => list.name !== originalName)
            ];
          });
          
          toast.success(`Created scheduled list "${originalName}"`);
        }
      });
    };

    const interval = setInterval(checkRecurringTemplates, 60000);
    return () => clearInterval(interval);
  }, [templateLists]);

  const addList = (name: string, type: 'tasks' | 'text' = 'tasks') => {
    const newList: TodoList = {
      id: Date.now(),
      name,
      type,
      todos: [],
      textItems: [],
      deletedTodos: [],
      deletedTextItems: [],
      createdAt: new Date().toISOString()
    };
    setLists(prev => [newList, ...prev]);
    setActiveListId(newList.id);
    toast.success(`Created new list "${name}"`);
  };

  const deleteList = (id: number) => {
    const listToDelete = lists.find(list => list.id === id);
    if (listToDelete) {
      setLists(prev => prev.filter(list => list.id !== id));
      setDeletedLists(prev => [{ ...listToDelete, deletedAt: new Date().toISOString() }, ...prev]);
      if (activeListId === id) {
        setActiveListId(null);
      }
      toast.success(`Moved "${listToDelete.name}" to trash`);
    }
  };

  const restoreList = (id: number) => {
    const listToRestore = deletedLists.find(list => list.id === id);
    if (listToRestore) {
      setDeletedLists(prev => prev.filter(list => list.id !== id));
      setLists(prev => [{ ...listToRestore }, ...prev]);
      toast.success(`Restored list "${listToRestore.name}"`);
    }
  };

  const permanentlyDeleteList = (id: number) => {
    const listToDelete = deletedLists.find(list => list.id === id);
    if (listToDelete) {
      setDeletedLists(prev => prev.filter(list => list.id !== id));
      toast.success(`Permanently deleted "${listToDelete.name}"`);
    }
  };

  const updateList = (id: number, updates: Partial<TodoList>) => {
    setLists(prev => prev.map(list => 
      list.id === id ? { ...list, ...updates } : list
    ));
  };

  const addTodoToList = (listId: number, todo: Todo) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const newTodos = [...list.todos, todo].sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
        return { ...list, todos: newTodos };
      }
      return list;
    }));
  };

  const deleteTodoFromList = (listId: number, todoId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const todoToDelete = list.todos.find(t => t.id === todoId);
        if (todoToDelete) {
          return {
            ...list,
            todos: list.todos.filter(t => t.id !== todoId),
            deletedTodos: [{ ...todoToDelete, isRemoving: false }, ...list.deletedTodos]
          };
        }
      }
      return list;
    }));
  };

  const toggleTodo = (listId: number, todoId: number) => {
    setLists(prev => prev.map(list =>
      list.id === listId ? {
        ...list,
        todos: list.todos.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed, isCompleting: true } : todo
        )
      } : list
    ));
  };

  const updateTodoPriority = (listId: number, todoId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const updatedTodos = list.todos.map(todo => {
          if (todo.id === todoId) {
            const priorities: ['low', 'medium', 'high'] = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(todo.priority);
            const nextPriority = priorities[(currentIndex + 1) % priorities.length];
            return { ...todo, priority: nextPriority };
          }
          return todo;
        }).sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        });
        return { ...list, todos: updatedTodos };
      }
      return list;
    }));
  };

  const restoreTodoInList = (listId: number, todoId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const todoToRestore = list.deletedTodos.find(t => t.id === todoId);
        if (todoToRestore) {
          return {
            ...list,
            todos: [{ 
              ...todoToRestore, 
              completed: false, 
              isRemoving: false,
              isCompleting: false 
            }, ...list.todos],
            deletedTodos: list.deletedTodos.filter(t => t.id !== todoId)
          };
        }
      }
      return list;
    }));
  };

  const permanentlyDeleteTodo = (listId: number, todoId: number) => {
    setLists(prev => prev.map(list =>
      list.id === listId ? {
        ...list,
        deletedTodos: list.deletedTodos.filter(todo => todo.id !== todoId)
      } : list
    ));
  };

  const saveAsTemplate = (listId: number) => {
    const listToTemplate = lists.find(list => list.id === listId);
    if (listToTemplate) {
      const templateList: TodoList = {
        ...listToTemplate,
        id: Date.now(),
        name: `${listToTemplate.name} Template`,
        createdAt: new Date().toISOString()
      };
      setTemplateLists(prev => [templateList, ...prev]);
      toast.success(`Saved "${listToTemplate.name}" as template`);
    }
  };

  const deleteTemplate = (id: number) => {
    const templateToDelete = templateLists.find(template => template.id === id);
    if (templateToDelete) {
      setTemplateLists(prev => prev.filter(template => template.id !== id));
      toast.success(`Deleted template "${templateToDelete.name}"`);
    }
  };

  const useTemplate = (templateId: number, newName: string) => {
    const template = templateLists.find(t => t.id === templateId);
    if (template) {
      setLists(prev => {
        const existingList = prev.find(list => list.name === newName);
        if (existingList) {
          toast.info(`Replacing existing list "${newName}"`);
        }
        return [
          {
            ...template,
            id: Date.now(),
            name: newName,
            createdAt: new Date().toISOString(),
            deletedTodos: [],
            deletedTextItems: []
          },
          ...prev.filter(list => list.name !== newName)
        ];
      });
      setActiveListId(null);
      toast.success(`Created list "${newName}" from template`);
    }
  };

  const addTextItemToList = (listId: number, item: TextItem) => {
    setLists(prev => prev.map(list =>
      list.id === listId ? {
        ...list,
        textItems: [item, ...list.textItems]
      } : list
    ));
  };

  const deleteTextItemFromList = (listId: number, itemId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const itemToDelete = list.textItems.find(t => t.id === itemId);
        if (itemToDelete) {
          return {
            ...list,
            textItems: list.textItems.filter(t => t.id !== itemId),
            deletedTextItems: [{ ...itemToDelete, isRemoving: false }, ...list.deletedTextItems]
          };
        }
      }
      return list;
    }));
  };

  const restoreTextItemInList = (listId: number, itemId: number) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        const itemToRestore = list.deletedTextItems.find(t => t.id === itemId);
        if (itemToRestore) {
          return {
            ...list,
            textItems: [{ ...itemToRestore, isRemoving: false }, ...list.textItems],
            deletedTextItems: list.deletedTextItems.filter(t => t.id !== itemId)
          };
        }
      }
      return list;
    }));
  };

  const permanentlyDeleteTextItem = (listId: number, itemId: number) => {
    setLists(prev => prev.map(list =>
      list.id === listId ? {
        ...list,
        deletedTextItems: list.deletedTextItems.filter(item => item.id !== itemId)
      } : list
    ));
  };

  const reorderLists = (view: 'all' | 'deleted' | 'templates', newOrder: TodoList[]) => {
    switch (view) {
      case 'all':
        setLists(newOrder);
        break;
      case 'deleted':
        setDeletedLists(newOrder);
        break;
      case 'templates':
        setTemplateLists(newOrder);
        break;
    }
  };

  const updateTemplateSchedule = (templateId: number, schedule: RecurringSchedule) => {
    setTemplateLists(prev => {
      const template = prev.find(t => t.id === templateId);
      const updated = prev.map(t =>
        t.id === templateId ? { ...t, recurringSchedule: schedule } : t
      );
      
      if (template) {
        if (schedule.enabled) {
          toast.success(`Scheduled "${getOriginalName(template.name)}" to create daily at ${schedule.time}`);
        } else {
          toast.info(`Disabled scheduling for "${getOriginalName(template.name)}"`);
        }
      }
      
      return updated;
    });
  };

  const value = {
    lists,
    deletedLists,
    templateLists,
    activeListId,
    addList,
    deleteList,
    restoreList,
    permanentlyDeleteList,
    setActiveList: setActiveListId,
    updateList,
    addTodoToList,
    deleteTodoFromList,
    toggleTodo,
    updateTodoPriority,
    restoreTodoInList,
    permanentlyDeleteTodo,
    saveAsTemplate,
    deleteTemplate,
    useTemplate,
    addTextItemToList,
    deleteTextItemFromList,
    restoreTextItemInList,
    permanentlyDeleteTextItem,
    reorderLists,
    updateTemplateSchedule,
  };

  return (
    <ListsContext.Provider value={value}>
      {children}
    </ListsContext.Provider>
  );
}

export const useLists = () => {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
};