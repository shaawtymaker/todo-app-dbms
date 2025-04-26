
import { useState } from "react";
import { Todo, useTodo } from "@/contexts/TodoContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  };
  
  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', payload: todo.id });
  };
  
  const handleEdit = () => {
    if (editText.trim() !== '') {
      dispatch({
        type: 'EDIT_TODO',
        payload: { id: todo.id, text: editText.trim() }
      });
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-center gap-3 p-3 border rounded-lg animate-fade-in transition-colors",
        todo.completed ? "bg-muted/50" : "bg-card hover:bg-accent/10"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="transition-all"
      />
      
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={handleEdit} title="Save">
            <Check size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setEditText(todo.text); setIsEditing(false); }}
            title="Cancel"
          >
            <X size={18} />
          </Button>
        </div>
      ) : (
        <>
          <span 
            className={cn(
              "flex-1 transition-opacity",
              todo.completed ? "line-through text-muted-foreground" : ""
            )}
          >
            {todo.text}
          </span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)} 
              className="h-8 w-8"
              title="Edit"
            >
              <Pencil size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              className="h-8 w-8 text-destructive"
              title="Delete"
            >
              <Trash size={16} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
