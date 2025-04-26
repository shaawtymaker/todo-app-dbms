
import { useTodo } from '@/contexts/TodoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ListPlus, Plus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  const { state } = useTodo();
  const recentLists = state.lists.slice(0, 3); // Show top 3 lists
  
  // Calculate overall progress
  const totalTasks = state.todos.length;
  const completedTasks = state.todos.filter(todo => todo.completed).length;
  const overallProgress = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button as={Link} to={`/lists/${state.activeListId || 'inbox'}`}>
          <Plus size={18} className="mr-2" /> New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="animate-scale-in" style={{animationDelay: '0.1s'}}>
          <CardHeader className="pb-2">
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Your overall task completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2 mb-2">
              {overallProgress}%
              {overallProgress === 100 && <CheckCircle className="text-success h-6 w-6" />}
            </div>
            <Progress 
              value={overallProgress} 
              className="h-2 mb-1"
              indicatorClassName={
                overallProgress >= 70 ? "bg-success" : 
                overallProgress >= 30 ? "bg-warning" : 
                "bg-primary"
              }
            />
            <p className="text-sm text-muted-foreground mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in" style={{animationDelay: '0.2s'}}>
          <CardHeader className="pb-2">
            <CardTitle>Lists Overview</CardTitle>
            <CardDescription>Quick access to your lists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLists.map(list => {
                const listTodos = state.todos.filter(todo => todo.listId === list.id);
                const completedCount = listTodos.filter(todo => todo.completed).length;
                return (
                  <Link 
                    key={list.id}
                    to={`/lists/${list.id}`}
                    className="flex items-center justify-between p-3 hover:bg-accent/10 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: list.color }} />
                      <span className="font-medium">{list.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={list.id === state.activeListId ? "default" : "outline"}>
                        {listTodos.length} {listTodos.length === 1 ? 'task' : 'tasks'}
                      </Badge>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {completedCount}/{listTodos.length} done
                      </span>
                    </div>
                  </Link>
                );
              })}
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                as={Link} 
                to="/settings"
              >
                <ListPlus size={16} className="mr-2" /> Manage Lists
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="animate-scale-in" style={{animationDelay: '0.3s'}}>
        <CardHeader className="pb-2">
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your recently added tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {state.todos.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No tasks yet. Get started by creating a task!</p>
              </div>
            ) : (
              state.todos
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5)
                .map(todo => {
                  const list = state.lists.find(l => l.id === todo.listId);
                  return (
                    <div 
                      key={todo.id} 
                      className={`p-3 border rounded-lg flex items-center justify-between gap-2 ${
                        todo.completed ? 'bg-muted/50' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: list?.color }} />
                        <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-xs">
                          {list?.name || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
