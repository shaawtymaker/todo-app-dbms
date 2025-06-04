
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WelcomeCard } from '@/components/Dashboard/WelcomeCard';
import { ProgressCard } from '@/components/Dashboard/ProgressCard';
import { TaskDistributionCard } from '@/components/Dashboard/TaskDistributionCard';
import { ListsOverviewCard } from '@/components/Dashboard/ListsOverviewCard';
import { useDashboardStats } from '@/components/Dashboard/DashboardStats';

export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-2 py-1 backdrop-blur-sm bg-background/80">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <WelcomeCard stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressCard stats={stats} />
        <TaskDistributionCard stats={stats} />
      </div>

      <ListsOverviewCard />
    </div>
  );
}
