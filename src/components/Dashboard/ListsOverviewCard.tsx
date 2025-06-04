
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ListChecks } from 'lucide-react';
import { useTodo } from '@/contexts/TodoContext';

export function ListsOverviewCard() {
  const { state } = useTodo();

  return (
    <Card className="animate-scale-in backdrop-blur-sm bg-card/20 border-primary/10" style={{animationDelay: '0.4s'}}>
      <CardHeader>
        <CardTitle>Lists Overview</CardTitle>
        <CardDescription>Status of tasks in each list</CardDescription>
      </CardHeader>
      <CardContent>
        {state.lists.length === 0 ? (
          <div className="text-center py-6">
            <ListChecks className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No lists created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.lists.map(list => {
              const listTodos = state.todos.filter(todo => todo.listId === list.id);
              const listCompleted = listTodos.filter(todo => todo.completed).length;
              const listProgress = listTodos.length > 0 
                ? Math.round((listCompleted / listTodos.length) * 100) 
                : 0;

              return (
                <div key={list.id} className="border rounded-lg p-4 backdrop-blur-sm bg-background/30 border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: list.color }}></span>
                      <span className="font-medium">{list.name}</span>
                    </div>
                    <Badge variant="outline" className="backdrop-blur-sm bg-background/80">
                      {listTodos.length} {listTodos.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{listCompleted}/{listTodos.length} completed</span>
                      <span>{listProgress}%</span>
                    </div>
                    <Progress value={listProgress} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
