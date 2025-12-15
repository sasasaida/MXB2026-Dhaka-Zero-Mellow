import { useState, useEffect } from 'react';
import { calculatePregnancyInfo, getTrimesterProgress } from '@/utils/pregnancyCalculator';
import { useAuth } from '@/contexts/AuthContext';
import { getGuidanceForWeek } from '@/utils/pregnancyGuidance';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Baby, Apple, AlertCircle, CheckCircle2, Clock, Info, Utensils, Activity } from "lucide-react";
import { getNutritionForWeek } from '@/utils/nutritionData';
import { getWeeklyTasks } from '@/utils/weeklyTasks';
import { getUpcomingAppointments } from '@/utils/prenatalAppointments';


interface PregnancyTrackerProps {
  className?: string;
}

export function PregnancyTracker({ className = '' }: PregnancyTrackerProps) {
  const { user } = useAuth();
  const [lmpDate, setLmpDate] = useState('');
  const [pregnancyInfo, setPregnancyInfo] = useState<ReturnType<typeof calculatePregnancyInfo> | null>(null);
  const [guidance, setGuidance] = useState<ReturnType<typeof getGuidanceForWeek> | null>(null);

  // Load saved LMP from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedLmp = localStorage.getItem(`mother_${user.name}_lmp`);
      if (savedLmp) {
        setLmpDate(savedLmp);
        const info = calculatePregnancyInfo(savedLmp);
        setPregnancyInfo(info);
        setGuidance(getGuidanceForWeek(info.weeks));
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lmpDate) return;

    // Save to localStorage
    if (user) {
      localStorage.setItem(`mother_${user.name}_lmp`, lmpDate);
    }

    // Calculate and set pregnancy info
    const info = calculatePregnancyInfo(lmpDate);
    setPregnancyInfo(info);
    setGuidance(getGuidanceForWeek(info.weeks));
  };


  // Add this effect to load tasks when pregnancyInfo changes
  useEffect(() => {
    if (pregnancyInfo) {
      const savedTasks = localStorage.getItem(`mother_${user?.name}_weekly_tasks_${pregnancyInfo.weeks}`);
      if (savedTasks) {
        setWeeklyTasks(JSON.parse(savedTasks));
      } else {
        const newTasks = getWeeklyTasks(pregnancyInfo.weeks);
        setWeeklyTasks(newTasks);
      }
    }
  }, [pregnancyInfo, user?.name]);
  // Add this function to toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setWeeklyTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task, index) =>
        index === taskId ? { ...task, completed: !task.completed } : task
      );

      if (pregnancyInfo && user) {
        localStorage.setItem(
          `mother_${user.name}_weekly_tasks_${pregnancyInfo.weeks}`,
          JSON.stringify(updatedTasks)
        );
      }

      return updatedTasks;
    });
  };

  useEffect(() => {
    if (pregnancyInfo) {
      const appointments = getUpcomingAppointments(pregnancyInfo.weeks);
      setUpcomingAppointments(appointments);
    }
  }, [pregnancyInfo]);

  // In src/components/PregnancyTracker.tsx
  useEffect(() => {
    if (pregnancyInfo) {
      const guidance = getGuidanceForWeek(pregnancyInfo.weeks);
      setBabyDevelopment({
        title: `Week ${pregnancyInfo.weeks} Development`,
        description: guidance.babyDevelopment
      });
    }
  }, [pregnancyInfo]);

  // Static data for UI elements (can be made dynamic later)
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);


  const [upcomingAppointments, setUpcomingAppointments] = useState<PrenatalAppointment[]>([]);


  const nutritionItems = pregnancyInfo ? getNutritionForWeek(pregnancyInfo.weeks) : [];


  const [babyDevelopment, setBabyDevelopment] = useState<{
    title: string;
    description: string;
  } | null>(null);


  // If no pregnancy info is set, show the LMP input form
  if (!pregnancyInfo) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>Pregnancy Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lmp" className="block text-sm font-medium text-foreground mb-1">
                  First Day of Last Menstrual Period
                </label>
                <input
                  type="date"
                  id="lmp"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Start Tracking Pregnancy
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format due date for display
  const formattedDueDate = new Date(pregnancyInfo.dueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate progress percentages
  const overallProgressPercent = Math.min((pregnancyInfo.weeks / 40) * 100, 100);
  const trimesterProgressPercent = getTrimesterProgress(pregnancyInfo.trimester);
  const trimesterText = pregnancyInfo.trimester === 1 ? "1st" : pregnancyInfo.trimester === 2 ? "2nd" : "3rd";

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Week Progress Card */}
      <Card variant="feature" className="overflow-hidden">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Your pregnancy journey</p>
              <h2 className="text-3xl font-bold">
                Week {pregnancyInfo.weeks}, Day {pregnancyInfo.days}
              </h2>
            </div>
            <Badge variant="trimester" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {trimesterText} Trimester
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgressPercent)}% complete</span>
            </div>
            <Progress value={overallProgressPercent} className="h-3 bg-primary-foreground/20" />

            <div className="flex justify-between text-sm">
              <span>Trimester Progress</span>
              <span>{Math.round(trimesterProgressPercent)}% complete</span>
            </div>
            <Progress value={trimesterProgressPercent} className="h-2 bg-primary-foreground/20" />

            <p className="text-sm opacity-90 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due date: {formattedDueDate}
            </p>
          </div>
        </div>


        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Baby className="h-8 w-8 text-primary" />
            </div>
            {babyDevelopment ? (
              <div>
                <h4 className="font-semibold text-foreground">
                  Baby's Developemnt
                </h4>
                <p className="text-sm text-muted-foreground">
                  {babyDevelopment.description}
                </p>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 w-48 bg-muted rounded mb-2"></div>
                <div className="h-3 w-64 bg-muted rounded"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              This Week's Tasks
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {weeklyTasks.filter(t => t.completed).length}/{weeklyTasks.length} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {weeklyTasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${task.completed ? "bg-success/10" : "bg-muted/50 hover:bg-muted"
                }`}
              onClick={() => toggleTaskCompletion(index)}
            >
              <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${task.completed
                ? "border-success bg-success text-success-foreground"
                : "border-muted-foreground"
                }`}>
                {task.completed && <CheckCircle2 className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {task.task}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${task.importance === 'high' ? 'border-red-200 text-red-700' :
                      task.importance === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-gray-200 text-gray-700'
                      }`}
                  >
                    {task.importance}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 h-full w-px bg-border my-1"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground">{appointment.type}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Week {appointment.week}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">{appointment.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground">Tests:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {appointment.tests.map((test, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming appointments scheduled.</p>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Quick View */}
      <Card variant="accent">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-accent" />
            Today's Nutrition Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {nutritionItems.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm text-foreground">{item.nutrient}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.food}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.importance}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Guidance Section */}
      {
        guidance && pregnancyInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Week {pregnancyInfo.weeks} Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mother's Care */}
              <div>
                <h3 className="text-lg font-medium mb-2">Your Care This Week</h3>
                <p className="text-muted-foreground">{guidance.motherCare}</p>
              </div>
              {/* Exercise Tips */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Exercise Tips</h3>
                </div>
                <ul className="space-y-2 pl-7 text-muted-foreground list-disc">
                  {guidance.exerciseTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )
      }

      {/* Update Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setPregnancyInfo(null);
              setGuidance(null);
              setLmpDate('');
              if (user) {
                localStorage.removeItem(`mother_${user.name}_lmp`);
              }
            }}
          >
            Update LMP Date
          </Button>
        </CardContent>
      </Card>
    </div >
  );
}