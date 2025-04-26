
import { useTodo } from "@/contexts/TodoContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TodoProgressProps {
  listId: string;
  className?: string;
}

export function TodoProgress({ listId, className }: TodoProgressProps) {
  const { state } = useTodo();
  
  const todos = state.todos.filter(todo => todo.listId === listId);
  const completedTodos = todos.filter(todo => todo.completed);
  
  const totalCount = todos.length;
  const completedCount = completedTodos.length;
  
  const percentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;
  
  // Determine color based on completion percentage
  const getColorClass = () => {
    if (percentage < 30) return "bg-primary";
    if (percentage < 70) return "bg-warning";
    return "bg-success";
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
        indicatorClassName={cn(
          "transition-all duration-1000",
          getColorClass()
        )}
      />
      <div className="text-xs text-muted-foreground">
        {completedCount} of {totalCount} tasks completed
      </div>
    </div>
  );
}
