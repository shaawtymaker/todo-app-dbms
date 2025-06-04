
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { DashboardStatsData } from './DashboardStats';

interface ProgressCardProps {
  stats: DashboardStatsData;
}

export function ProgressCard({ stats }: ProgressCardProps) {
  return (
    <Card className="animate-scale-in backdrop-blur-sm bg-card/20 border-primary/10" style={{animationDelay: '0.2s'}}>
      <CardHeader>
        <CardTitle>Completion Progress</CardTitle>
        <CardDescription>Your task completion rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Overall Progress</span>
            <span className="font-medium">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
          
          <div className="pt-6 text-center">
            {stats.totalTasks === 0 ? (
              <p className="text-muted-foreground">No tasks yet. Start adding tasks!</p>
            ) : stats.completionRate === 100 ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-success" />
                <p className="font-medium">All tasks completed!</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
