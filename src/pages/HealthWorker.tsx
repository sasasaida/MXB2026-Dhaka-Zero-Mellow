import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HealthWorkerDashboard } from "@/components/HealthWorkerDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Download, Upload, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HealthWorker = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Community Health Worker Portal
              </h1>
              <Badge variant={isOnline ? "success" : "muted"} className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">Fatema Akter</span> • Rangpur District CHW
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Sync Data
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Records
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOnline(!isOnline)}
              className="text-xs"
            >
              Toggle {isOnline ? "Offline" : "Online"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Offline Notice */}
        {!isOnline && (
          <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-3">
            <WifiOff className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium text-foreground">Offline Mode Active</p>
              <p className="text-sm text-muted-foreground">
                Patient data will sync automatically when connection is restored. AI recommendations use cached guidelines.
              </p>
            </div>
          </div>
        )}

        <HealthWorkerDashboard />
      </main>

      <Footer />
    </div>
  );
};

export default HealthWorker;
