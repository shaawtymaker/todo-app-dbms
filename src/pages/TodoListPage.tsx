
import { useParams, Navigate } from "react-router-dom";
import { useTodo } from "@/contexts/todo";
import { TodoListView } from "@/components/Todo/TodoList";
import { TodoProgress } from "@/components/Todo/TodoProgress";
import { Card } from "@/components/ui/card"; 
import { useEffect } from "react";

export default function TodoListPage() {
  const { listId } = useParams<{ listId: string }>();
  const { state, dispatch } = useTodo();
  
  // Make sure lists is always an array
  const lists = Array.isArray(state.lists) ? state.lists : [];
  
  const list = lists.find(l => l.id === listId);
  
  // Set active list when navigating to this page
  useEffect(() => {
    if (listId) {
      dispatch({ type: 'SET_ACTIVE_LIST', payload: listId });
    }
  }, [listId, dispatch]);
  
  // If lists are still loading, show a loading message
  if (state.isLoading) {
    return <div className="p-6 text-center">Loading lists...</div>;
  }
  
  // If there was an error loading lists, show an error message
  if (state.loadError) {
    return <div className="p-6 text-center text-red-500">Error: {state.loadError}</div>;
  }
  
  // If list doesn't exist, redirect to inbox
  if (!list && lists.length > 0) {
    return <Navigate to="/lists/inbox" replace />;
  }
  
  if (!list) {
    return <div className="p-6 text-center">List not found</div>;
  }
  
  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="p-6 mb-6 animate-scale-in">
        <TodoProgress listId={list.id} />
      </Card>
      
      <TodoListView 
        listId={list.id} 
        title={list.name} 
        color={list.color} 
      />
    </div>
  );
}
