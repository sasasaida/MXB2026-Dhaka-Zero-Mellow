import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PregnancyTracker } from "@/components/PregnancyTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Bell, AlertTriangle, Heart, Utensils, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DailyCareTasks } from "@/components/DailyCareTasks";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { SymptomChecker } from "@/components/SymptomChecker";


const MotherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back,{" "}
              <span className="text-gradient-primary">
                {user?.name || "Rashida"}
              </span>{" "}
              💕
            </h1>
            <p className="text-muted-foreground mt-1">
              Your pregnancy journey is progressing beautifully. Here's your daily care summary.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Reminders
            </Button>
            <Link to="/chat">
              <Button variant="hero" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask AI
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Tracker Column */}
          <div className="lg:col-span-2">
            <PregnancyTracker />
            <SymptomChecker />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Alerts */}
            <Card className="border-warning/30 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Health Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm font-medium text-foreground">Iron supplement reminder</p>
                  <p className="text-xs text-muted-foreground">Take with Vitamin C for better absorption</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm font-medium text-foreground">Blood pressure check</p>
                  <p className="text-xs text-muted-foreground">Due in 2 days at local clinic</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {[
                  { icon: Heart, label: "Log Symptoms", color: "text-destructive", path: "/symptoms" },
                  { icon: Utensils, label: "Log Meal", color: "text-success", path: "/nutrition" },
                  { icon: Activity, label: "Log Activity", color: "text-primary", path: "/activity" },
                  { icon: MessageCircle, label: "Ask Question", color: "text-accent", path: "/chat" },
                ].map((action, index) => (
                  <Link key={index} to={action.path} className="block">
                    <Button
                      variant="outline"
                      className="h-auto py-4 w-full flex-col gap-2"
                    >
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <DailyCareTasks />

            {/* Weekly Tips */}
            <Card variant="feature">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Daily Wellness Tips</CardTitle>
                  <Badge variant="secondary">Today</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "🍳 Eat protein-rich breakfast (eggs, dal)",
                  "🚶‍♀️ 30 min walk if comfortable",
                  "💧 Drink 8-10 glasses of water",
                  "😴 Sleep on your left side",
                  "🧘 Practice deep breathing exercises",
                ].map((tip, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {tip}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Card */}
            <EmergencyContacts />



          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MotherDashboard;