
import { nanoid } from 'nanoid';
import { TodoState, TodoAction, defaultLists } from './types';

// Reducer function
export function todoReducer(state: TodoState, action: TodoAction): TodoState {
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
        todos: Array.isArray(action.payload) ? action.payload : [],
        loadError: null
      };
      
    case 'SET_LISTS':
      return {
        ...state,
        lists: Array.isArray(action.payload) ? action.payload : [...defaultLists],
        loadError: null
      };
      
    case 'ADD_TODO': {
      const payload = action.payload;
      if ('id' in payload) {
        // If payload is already a Todo object
        return {
          ...state,
          todos: [payload, ...state.todos]
        };
      } else {
        // If payload is { text, listId }
        const newTodo = {
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
          todo.id === (action.payload as any).id ? action.payload : todo
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
          lists: [...state.lists, payload]
        };
      } else {
        // If payload is { name, color }
        const newList = {
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
          list.id === (action.payload as any).id ? action.payload : list
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
