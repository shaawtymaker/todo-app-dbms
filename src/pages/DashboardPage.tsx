
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTodo } from '@/contexts/TodoContext';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ListChecks, ListTodo, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { state } = useTodo();

  // Calculate stats
  const totalTasks = state.todos.length;
  const completedTasks = state.todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart data
  const data = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks }
  ];
  const COLORS = ['#10b981', '#f59e0b'];

  // Get upcoming tasks (due within 7 days)
  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Welcome card */}
      <Card className="animate-scale-in" style={{animationDelay: '0.1s'}}>
        <CardHeader>
          <CardTitle>Welcome back, {user?.name || 'User'}!</CardTitle>
          <CardDescription>Here's an overview of your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
              <ListTodo className="h-8 w-8 mb-2 text-primary" />
              <span className="text-2xl font-bold">{totalTasks}</span>
              <span className="text-sm text-muted-foreground">Total Tasks</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-500/5 rounded-lg">
              <CheckCircle className="h-8 w-8 mb-2 text-success" />
              <span className="text-2xl font-bold">{completedTasks}</span>
              <span className="text-sm text-muted-foreground">Completed Tasks</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-amber-500/5 rounded-lg">
              <Clock className="h-8 w-8 mb-2 text-amber-500" />
              <span className="text-2xl font-bold">{pendingTasks}</span>
              <span className="text-sm text-muted-foreground">Pending Tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-scale-in" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle>Completion Progress</CardTitle>
            <CardDescription>Your task completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Overall Progress</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              
              <div className="pt-6 text-center">
                {totalTasks === 0 ? (
                  <p className="text-muted-foreground">No tasks yet. Start adding tasks!</p>
                ) : completionRate === 100 ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-success" />
                    <p className="font-medium">All tasks completed!</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Your tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No tasks to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Overview */}
      <Card className="animate-scale-in" style={{animationDelay: '0.4s'}}>
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
                  <div key={list.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: list.color }}></span>
                        <span className="font-medium">{list.name}</span>
                      </div>
                      <Badge variant="outline">
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
    </div>
  );
}
