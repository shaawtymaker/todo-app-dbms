
import { useParams, Navigate } from "react-router-dom";
import { useTodo } from "@/contexts/TodoContext";
import { TodoListView } from "@/components/Todo/TodoList";
import { TodoProgress } from "@/components/Todo/TodoProgress";
import { Card } from "@/components/ui/card"; 
import { useEffect } from "react";

export default function TodoListPage() {
  const { listId } = useParams<{ listId: string }>();
  const { state, dispatch } = useTodo();
  
  const list = state.lists.find(l => l.id === listId);
  
  // Set active list when navigating to this page
  useEffect(() => {
    if (listId) {
      dispatch({ type: 'SET_ACTIVE_LIST', payload: listId });
    }
  }, [listId, dispatch]);
  
  // If list doesn't exist, redirect to inbox
  if (!list) {
    return <Navigate to="/lists/inbox" replace />;
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
