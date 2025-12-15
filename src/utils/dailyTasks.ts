// src/utils/dailyCareTasks.ts
import dailyTasks from '@/data/dailyCareTasks.json';

export interface DailyTask {
    id: string;
    label: string;
    category: string;
    icon: string;
    completed?: boolean;
}

export const getDailyTasks = (userId: string): DailyTask[] => {
    const today = new Date().toDateString();
    const storageKey = `mother_${userId}_daily_tasks_${today}`;
    const savedTasks = localStorage.getItem(storageKey);

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    // Return default tasks for a new day
    return dailyTasks.tasks.map(task => ({
        ...task,
        completed: false
    }));
};

export const saveDailyTasks = (userId: string, tasks: DailyTask[]): void => {
    const today = new Date().toDateString();
    const storageKey = `mother_${userId}_daily_tasks_${today}`;
    localStorage.setItem(storageKey, JSON.stringify(tasks));
};

export const getDailyProgress = (tasks: DailyTask[]) => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percentage = Math.round((completed / total) * 100) || 0;

    return { completed, total, percentage };
};