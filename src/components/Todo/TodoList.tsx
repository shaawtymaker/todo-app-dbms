
import { Todo, useTodo } from "@/contexts/TodoContext";
import { TodoItem } from "./TodoItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TodoListProps {
  listId: string;
  title: string;
  color: string;
}

export function TodoListView({ listId, title, color }: TodoListProps) {
  const { state, dispatch } = useTodo();
  const [newTodoText, setNewTodoText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const todos = state.todos.filter(todo => todo.listId === listId);
  const incompleteTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  let filteredTodos: Todo[];
  switch (activeTab) {
    case "active":
      filteredTodos = incompleteTodos;
      break;
    case "completed":
      filteredTodos = completedTodos;
      break;
    default:
      filteredTodos = todos;
  }
  
  // Sort by creation time, newest first
  filteredTodos.sort((a, b) => b.createdAt - a.createdAt);
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      dispatch({
        type: 'ADD_TODO',
        payload: { text: newTodoText.trim(), listId }
      });
      setNewTodoText("");
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task"
          className="flex-1"
        />
        <Button type="submit" disabled={!newTodoText.trim()}>
          <Plus size={18} className="mr-2" /> Add
        </Button>
      </form>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({todos.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({incompleteTodos.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTodos.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No tasks yet. Create one above!</p>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {incompleteTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No active tasks. Great job!</p>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {completedTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No completed tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
