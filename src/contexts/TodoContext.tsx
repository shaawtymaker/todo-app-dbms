import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { todoService } from '../services/todoService';
import { listService } from '../services/listService';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define types
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  listId: string;
  createdAt: number;
}

export interface TodoList {
  id: string;
  name: string;
  color: string;
}

interface TodoState {
  todos: Todo[];
  lists: TodoList[];
  activeListId: string | null;
  isLoading: boolean;
  loadError: string | null;
}

type TodoActionPayload = 
  | Todo 
  | Todo[] 
  | TodoList 
  | TodoList[] 
  | string 
  | boolean 
  | { id: string; text: string } 
  | { text: string; listId: string }
  | { id: string; name: string; color: string };

type TodoAction =
  | { type: 'ADD_TODO'; payload: Todo | { text: string; listId: string } }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'ADD_LIST'; payload: TodoList | { name: string; color: string } }
  | { type: 'SET_LISTS'; payload: TodoList[] }
  | { type: 'UPDATE_LIST'; payload: TodoList }
  | { type: 'EDIT_LIST'; payload: { id: string; name: string; color: string } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_ACTIVE_LIST'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (text: string, listId: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  addList: (name: string, color: string) => Promise<void>;
  editList: (id: string, name: string, color: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
}

// Default lists
const defaultLists: TodoList[] = [
  { id: 'inbox', name: 'Inbox', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#8b5cf6' },
  { id: 'work', name: 'Work', color: '#10b981' }
];

// Initial state
const initialState: TodoState = {
  todos: [],
  lists: defaultLists,
  activeListId: 'inbox',
  isLoading: false,
  loadError: null,
};

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload as boolean
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        loadError: action.payload as string
      };
      
    case 'SET_TODOS':
      return {
        ...state,
        todos: Array.isArray(action.payload) ? action.payload as Todo[] : [],
        loadError: null
      };
      
    case 'SET_LISTS':
      return {
        ...state,
        lists: Array.isArray(action.payload) ? action.payload as TodoList[] : [...defaultLists],
        loadError: null
      };
      
    case 'ADD_TODO': {
      const payload = action.payload;
      if ('id' in payload) {
        // If payload is already a Todo object
        return {
          ...state,
          todos: [payload as Todo, ...state.todos]
        };
      } else {
        // If payload is { text, listId }
        const newTodo: Todo = {
          id: nanoid(),
          text: (payload as { text: string; listId: string }).text,
          completed: false,
          listId: (payload as { text: string; listId: string }).listId,
          createdAt: Date.now()
        };
        return {
          ...state,
          todos: [newTodo, ...state.todos]
        };
      }
    }
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };

    case 'EDIT_TODO': {
      const { id, text } = action.payload as { id: string; text: string };
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === id ? { ...todo, text } : todo
        )
      };
    }
      
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === (action.payload as Todo).id ? action.payload as Todo : todo
        )
      };
      
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      
    case 'ADD_LIST': {
      const payload = action.payload;
      if ('id' in payload) {
        // If payload is already a TodoList
        return {
          ...state,
          lists: [...state.lists, payload as TodoList]
        };
      } else {
        // If payload is { name, color }
        const newList: TodoList = {
          id: nanoid(),
          name: (payload as { name: string; color: string }).name,
          color: (payload as { name: string; color: string }).color,
        };
        return {
          ...state,
          lists: [...state.lists, newList]
        };
      }
    }
      
    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === (action.payload as TodoList).id ? action.payload as TodoList : list
        )
      };
      
    case 'EDIT_LIST': {
      const { id, name, color } = action.payload as { id: string; name: string; color: string };
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === id ? { ...list, name, color } : list
        )
      };
    }
      
    case 'DELETE_LIST': {
      // Don't allow deleting the inbox
      if (action.payload === 'inbox') return state;
      
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload),
        // If active list is deleted, switch to inbox
        activeListId: state.activeListId === action.payload ? 'inbox' : state.activeListId
      };
    }
      
    case 'SET_ACTIVE_LIST':
      return {
        ...state,
        activeListId: action.payload as string | null
      };
      
    default:
      return state;
  }
}

// Provider component
export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Load data from API when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log("Not authenticated or no user, skipping data load");
      return;
    }
    
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        console.log('Loading data for user:', user.id);
        
        // Load lists
        const lists = await listService.getAllLists();
        console.log('Loaded lists:', lists);
        
        if (lists && Array.isArray(lists)) {
          dispatch({ type: 'SET_LISTS', payload: lists });
        } else {
          console.error('Lists data is not an array:', lists);
          dispatch({ type: 'SET_LISTS', payload: defaultLists });
          
          // Show toast with error
          toast({
            title: 'Warning',
            description: 'Could not load your lists. Using defaults.',
            variant: 'destructive',
          });
        }
        
        // Load todos
        const todos = await todoService.getAllTodos();
        console.log('Loaded todos:', todos);
        
        if (todos && Array.isArray(todos)) {
          dispatch({ type: 'SET_TODOS', payload: todos });
        } else {
          console.error('Todos data is not an array:', todos);
          dispatch({ type: 'SET_TODOS', payload: [] });
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set default lists when there's an error
        dispatch({ type: 'SET_LISTS', payload: defaultLists });
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Unknown error loading data'
        });
        
        toast({
          title: 'Error',
          description: 'Failed to load your data. Please refresh and try again.',
          variant: 'destructive',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, [isAuthenticated, user, toast]);
  
  // Add todo
  const addTodo = async (text: string, listId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Optimistic update with temporary ID
      const tempId = nanoid();
      const tempTodo = {
        id: tempId,
        text,
        completed: false,
        listId: listId || state.activeListId || 'inbox',
        createdAt: Date.now()
      };
      
      dispatch({ type: 'ADD_TODO', payload: tempTodo });
      
      // API call
      const savedTodo = await todoService.createTodo({
        text,
        listId: listId || state.activeListId || 'inbox'
      });
      
      // Replace temp todo with the one from API
      dispatch({ type: 'DELETE_TODO', payload: tempId });
      dispatch({ type: 'ADD_TODO', payload: savedTodo });
      
    } catch (error) {
      console.error('Failed to add todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Toggle todo
  const toggleTodo = async (id: string) => {
    try {
      // Optimistic update
      dispatch({ type: 'TOGGLE_TODO', payload: id });
      
      // API call
      const updatedTodo = await todoService.toggleTodo(id);
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
      // Revert on failure
      dispatch({ type: 'TOGGLE_TODO', payload: id });
    }
  };
  
  // Edit todo
  const editTodo = async (id: string, text: string) => {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    
    const originalText = todo.text;
    
    try {
      // Optimistic update
      dispatch({ 
        type: 'UPDATE_TODO', 
        payload: { ...todo, text } 
      });
      
      // API call
      const updatedTodo = await todoService.updateTodo(id, { text });
      dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
    } catch (error) {
      console.error('Failed to edit todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
      // Revert on failure
      dispatch({ 
        type: 'UPDATE_TODO', 
        payload: { ...todo, text: originalText } 
      });
    }
  };
  
  // Delete todo
  const deleteTodo = async (id: string) => {
    const todo = state.todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      // Optimistic update
      dispatch({ type: 'DELETE_TODO', payload: id });
      
      // API call
      await todoService.deleteTodo(id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
      // Revert on failure
      if (todo) {
        dispatch({ type: 'ADD_TODO', payload: todo });
      }
    }
  };
  
  // Add list
  const addList = async (name: string, color: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // API call
      const newList = await listService.createList({ name, color });
      
      // Update state with response from API
      dispatch({ type: 'ADD_LIST', payload: newList });
      toast({
        title: 'Success',
        description: 'New list created successfully.',
      });
    } catch (error) {
      console.error('Failed to add list:', error);
      toast({
        title: 'Error',
        description: 'Failed to create list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Edit list
  const editList = async (id: string, name: string, color: string) => {
    // Don't allow editing inbox
    if (id === 'inbox') return;
    
    const list = state.lists.find(l => l.id === id);
    if (!list) return;
    
    try {
      // Optimistic update
      dispatch({ 
        type: 'UPDATE_LIST', 
        payload: { ...list, name, color } 
      });
      
      // API call
      const updatedList = await listService.updateList(id, { name, color });
      dispatch({ type: 'UPDATE_LIST', payload: updatedList });
    } catch (error) {
      console.error('Failed to edit list:', error);
      toast({
        title: 'Error',
        description: 'Failed to update list. Please try again.',
        variant: 'destructive',
      });
      // Revert on failure
      dispatch({ type: 'UPDATE_LIST', payload: list });
    }
  };
  
  // Delete list
  const deleteList = async (id: string) => {
    // Don't allow deleting inbox
    if (id === 'inbox') return;
    
    const list = state.lists.find(l => l.id === id);
    if (!list) return;
    
    try {
      // Optimistic update
      dispatch({ type: 'DELETE_LIST', payload: id });
      
      // API call
      await listService.deleteList(id);
      
      toast({
        title: 'Success',
        description: 'List deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete list:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete list. Please try again.',
        variant: 'destructive',
      });
      // Revert on failure
      if (list) {
        dispatch({ type: 'ADD_LIST', payload: list });
      }
    }
  };
  
  return (
    <TodoContext.Provider value={{ 
      state, 
      dispatch,
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      addList,
      editList,
      deleteList
    }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook to use the todo context
export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
