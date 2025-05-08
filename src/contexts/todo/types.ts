
import { Dispatch } from 'react';

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

export interface TodoState {
  todos: Todo[];
  lists: TodoList[];
  activeListId: string | null;
  isLoading: boolean;
  loadError: string | null;
}

export type TodoActionPayload = 
  | Todo 
  | Todo[] 
  | TodoList 
  | TodoList[] 
  | string 
  | boolean 
  | { id: string; text: string } 
  | { text: string; listId: string }
  | { id: string; name: string; color: string };

export type TodoAction =
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

export interface TodoContextType {
  state: TodoState;
  dispatch: Dispatch<TodoAction>;
  addTodo: (text: string, listId: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  addList: (name: string, color: string) => Promise<void>;
  editList: (id: string, name: string, color: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
}

// Default lists
export const defaultLists: TodoList[] = [
  { id: 'inbox', name: 'Inbox', color: '#3b82f6' },
  { id: 'personal', name: 'Personal', color: '#8b5cf6' },
  { id: 'work', name: 'Work', color: '#10b981' }
];

// Initial state
export const initialState: TodoState = {
  todos: [],
  lists: defaultLists,
  activeListId: 'inbox',
  isLoading: false,
  loadError: null,
};
