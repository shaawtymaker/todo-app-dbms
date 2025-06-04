
import { useTodo } from '@/contexts/TodoContext';

export interface DashboardStatsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  chartData: Array<{ name: string; value: number }>;
}

export function useDashboardStats(): DashboardStatsData {
  const { state } = useTodo();

  const totalTasks = state.todos.length;
  const completedTasks = state.todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks }
  ];

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    chartData
  };
}
