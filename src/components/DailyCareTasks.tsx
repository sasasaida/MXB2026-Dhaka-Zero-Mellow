// src/components/DailyCareTasks.tsx
import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDailyTasks, saveDailyTasks, getDailyProgress } from '@/utils/dailyTasks';
import { useAuth } from '@/contexts/AuthContext';

export function DailyCareTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<ReturnType<typeof getDailyTasks>>([]);
    const { completed, total, percentage } = getDailyProgress(tasks);

    useEffect(() => {
        if (user) {
            setTasks(getDailyTasks(user.id));
        }
    }, [user]);

    const toggleTask = (taskId: string) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);

        if (user) {
            saveDailyTasks(user.id, updatedTasks);
        }
    };

    if (!user) return null;

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Daily Care Tasks</span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {completed} of {total} completed
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span>Daily Progress</span>
                            <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center space-x-3 rounded-lg p-3 hover:bg-muted/50"
                            >
                                <Checkbox
                                    id={task.id}
                                    checked={task.completed}
                                    onCheckedChange={() => toggleTask(task.id)}
                                    className="h-5 w-5 rounded-full"
                                />
                                <label
                                    htmlFor={task.id}
                                    className={`flex-1 text-sm font-medium leading-none ${task.completed ? 'text-muted-foreground line-through' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{task.icon}</span>
                                        <span>{task.label}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {task.category}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}