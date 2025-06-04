
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DashboardStatsData } from './DashboardStats';

interface TaskDistributionCardProps {
  stats: DashboardStatsData;
}

const COLORS = ['#10b981', '#f59e0b'];

export function TaskDistributionCard({ stats }: TaskDistributionCardProps) {
  return (
    <Card className="animate-scale-in backdrop-blur-sm bg-card/20 border-primary/10" style={{animationDelay: '0.3s'}}>
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
        <CardDescription>Your tasks by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {stats.totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} tasks`, name]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontSize: '14px' }}>
                      {value}: {entry.payload.value} tasks
                    </span>
                  )}
                />
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
  );
}
