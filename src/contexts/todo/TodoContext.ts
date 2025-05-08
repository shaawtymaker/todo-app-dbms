
import { createContext, useContext } from 'react';
import { TodoContextType } from './types';

// Create context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Custom hook to use the todo context
export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}

export default TodoContext;
