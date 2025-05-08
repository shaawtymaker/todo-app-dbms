
import { Todo, useTodo } from "@/contexts/TodoContext";
import { TodoItem } from "./TodoItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ListPlus, Check } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TodoListProps {
  listId: string;
  title: string;
  color: string;
}

export function TodoListView({ listId, title, color }: TodoListProps) {
  const { state, dispatch } = useTodo();
  const [newTodoText, setNewTodoText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Make sure todos is always an array
  const allTodos = Array.isArray(state.todos) ? state.todos : [];
  
  const todos = allTodos.filter(todo => todo.listId === listId);
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
      <div className="flex items-center gap-3 mb-lg">
        <div 
          className="w-5 h-5 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-lg">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 transition-all focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          disabled={!newTodoText.trim()}
          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} className="mr-2" /> Add
        </Button>
      </form>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-3 mb-lg">
          <TabsTrigger value="all" className="flex gap-2 items-center">
            All <Badge variant="secondary">{todos.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex gap-2 items-center">
            Active <Badge variant="secondary">{incompleteTodos.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex gap-2 items-center">
            Completed <Badge variant="secondary">{completedTodos.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 animate-scale-in">
          {todos.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
              <ListPlus size={48} className="text-muted-foreground/50" />
              <div>
                <p className="font-medium">No tasks yet</p>
                <p className="text-sm">Create one above to get started!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map((todo, index) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4 animate-scale-in">
          {incompleteTodos.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
              <Check size={48} className="text-success/50" />
              <div>
                <p className="font-medium">No active tasks</p>
                <p className="text-sm">Great job! All tasks are complete.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4 animate-scale-in">
          {completedTodos.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg flex flex-col items-center gap-4">
              <ListPlus size={48} className="text-muted-foreground/50" />
              <div>
                <p className="font-medium">No completed tasks yet</p>
                <p className="text-sm">Complete some tasks to see them here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {completedTodos.length > 0 && activeTab !== "completed" && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab("completed")}
            className="text-sm transition-all duration-200"
          >
            View {completedTodos.length} completed {completedTodos.length === 1 ? 'task' : 'tasks'}
          </Button>
        </div>
      )}
    </div>
  );
}
