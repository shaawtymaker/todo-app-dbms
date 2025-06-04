
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ListTodo, Clock } from 'lucide-react';
import { DashboardStatsData } from './DashboardStats';

interface WelcomeCardProps {
  stats: DashboardStatsData;
}

export function WelcomeCard({ stats }: WelcomeCardProps) {
  const { user } = useAuth();

  return (
    <Card className="animate-scale-in backdrop-blur-sm bg-card/20 border-primary/10" style={{animationDelay: '0.1s'}}>
      <CardHeader>
        <CardTitle>Welcome back, {user?.name || 'User'}!</CardTitle>
        <CardDescription>Here's an overview of your tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 bg-primary/10 backdrop-blur-sm rounded-lg border border-primary/20">
            <ListTodo className="h-8 w-8 mb-2 text-primary" />
            <span className="text-2xl font-bold">{stats.totalTasks}</span>
            <span className="text-sm text-muted-foreground">Total Tasks</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-success/10 backdrop-blur-sm rounded-lg border border-success/20">
            <CheckCircle className="h-8 w-8 mb-2 text-success" />
            <span className="text-2xl font-bold">{stats.completedTasks}</span>
            <span className="text-sm text-muted-foreground">Completed Tasks</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-warning/10 backdrop-blur-sm rounded-lg border border-warning/20">
            <Clock className="h-8 w-8 mb-2 text-warning" />
            <span className="text-2xl font-bold">{stats.pendingTasks}</span>
            <span className="text-sm text-muted-foreground">Pending Tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
