
import React, { useReducer, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { todoService } from '../../services/todoService';
import { listService } from '../../services/listService';
import { useAuth } from '../AuthContext';
import { useToast } from '@/hooks/use-toast';
import TodoContext from './TodoContext';
import { todoReducer } from './todoReducer';
import { initialState, TodoList, Todo } from './types';

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
          dispatch({ type: 'SET_LISTS', payload: initialState.lists });
          
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
        dispatch({ type: 'SET_LISTS', payload: initialState.lists });
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
      const tempTodo: Todo = {
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
