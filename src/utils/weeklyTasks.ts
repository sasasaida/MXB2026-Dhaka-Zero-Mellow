// src/utils/weeklyTasks.ts
import weeklyTasks from '@/data/weeklyTasks.json';

type WeekRange = keyof typeof weeklyTasks;

export interface WeeklyTask {
    task: string;
    category: string;
    importance: 'high' | 'medium' | 'low';
    completed?: boolean;
}

export const getWeeklyTasks = (week: number): WeeklyTask[] => {
    let range: WeekRange;

    if (week <= 4) range = '1-4';
    else if (week <= 8) range = '5-8';
    else if (week <= 12) range = '9-12';
    else if (week <= 16) range = '13-16';
    else if (week <= 20) range = '17-20';
    else if (week <= 24) range = '21-24';
    else if (week <= 28) range = '25-28';
    else if (week <= 32) range = '29-32';
    else if (week <= 36) range = '33-36';
    else range = '37-40';

    // Add completed status (initially false for all tasks)
    return (weeklyTasks[range] as Omit<WeeklyTask, 'completed'>[]).map(task => ({
        ...task,
        completed: false
    }));
};