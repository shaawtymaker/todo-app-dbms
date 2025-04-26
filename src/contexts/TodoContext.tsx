import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { nanoid } from 'nanoid';

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
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; listId: string } }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'ADD_LIST'; payload: { name: string; color: string } }
  | { type: 'EDIT_LIST'; payload: { id: string; name: string; color: string } }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_ACTIVE_LIST'; payload: string | null }
  | { type: 'LOAD_STATE'; payload: TodoState };

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
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
  activeListId: 'inbox'
};

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Reducer function
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: nanoid(),
            text: action.payload.text,
            completed: false,
            listId: action.payload.listId || state.activeListId || 'inbox',
            createdAt: Date.now()
          }
        ]
      };
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
      
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        )
      };
      
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      
    case 'ADD_LIST':
      return {
        ...state,
        lists: [
          ...state.lists,
          {
            id: nanoid(),
            name: action.payload.name,
            color: action.payload.color
          }
        ]
      };
      
    case 'EDIT_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list.id === action.payload.id
            ? { ...list, name: action.payload.name, color: action.payload.color }
            : list
        )
      };
      
    case 'DELETE_LIST': {
      // Don't allow deleting the inbox
      if (action.payload === 'inbox') return state;
      
      return {
        ...state,
        lists: state.lists.filter(list => list.id !== action.payload),
        // Move todos from deleted list to inbox
        todos: state.todos.map(todo =>
          todo.listId === action.payload ? { ...todo, listId: 'inbox' } : todo
        ),
        // If active list is deleted, switch to inbox
        activeListId: state.activeListId === action.payload ? 'inbox' : state.activeListId
      };
    }
      
    case 'SET_ACTIVE_LIST':
      return {
        ...state,
        activeListId: action.payload
      };
      
    case 'LOAD_STATE':
      return action.payload;
      
    default:
      return state;
  }
}

// Provider component
export function TodoProvider({ children }: { children: React.ReactNode }) {
  // Load state from localStorage or use default
  const [state, dispatch] = useReducer(todoReducer, initialState, () => {
    const savedState = localStorage.getItem('todoState');
    return savedState ? JSON.parse(savedState) : initialState;
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todoState', JSON.stringify(state));
  }, [state]);
  
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
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
