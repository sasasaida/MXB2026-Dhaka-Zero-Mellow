import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, User, MapPin, Phone, Plus, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Patient {
  id: string;
  name: string;
  age: number;
  week: number;
  riskLevel: "low" | "medium" | "high";
  village: string;
  phone: string;
  lastVisit: string;
  nextVisit: string;
  alerts: string[];
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Fatema Begum",
    age: 24,
    week: 32,
    riskLevel: "high",
    village: "Rangpur Sadar",
    phone: "+880 1712-345678",
    lastVisit: "Dec 10",
    nextVisit: "Dec 17",
    alerts: ["High blood pressure detected", "Anemia - needs iron supplements"],
  },
  {
    id: "2",
    name: "Rashida Khatun",
    age: 28,
    week: 24,
    riskLevel: "low",
    village: "Pirganj",
    phone: "+880 1812-456789",
    lastVisit: "Dec 12",
    nextVisit: "Dec 26",
    alerts: [],
  },
  {
    id: "3",
    name: "Amina Sultana",
    age: 22,
    week: 18,
    riskLevel: "medium",
    village: "Mithapukur",
    phone: "+880 1912-567890",
    lastVisit: "Dec 8",
    nextVisit: "Dec 22",
    alerts: ["Low weight gain - nutritional counseling needed"],
  },
  {
    id: "4",
    name: "Nasreen Akter",
    age: 30,
    week: 36,
    riskLevel: "medium",
    village: "Badarganj",
    phone: "+880 1612-678901",
    lastVisit: "Dec 11",
    nextVisit: "Dec 18",
    alerts: ["Previous C-section - monitor closely"],
  },
];

export function HealthWorkerDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockPatients.length,
    highRisk: mockPatients.filter((p) => p.riskLevel === "high").length,
    dueThisWeek: mockPatients.filter((p) => p.nextVisit.includes("Dec")).length,
    alerts: mockPatients.reduce((acc, p) => acc + p.alerts.length, 0),
  };

  const getRiskColor = (risk: Patient["riskLevel"]) => {
    switch (risk) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Patients", value: stats.total, icon: User, color: "text-primary" },
          { label: "High Risk", value: stats.highRisk, icon: AlertTriangle, color: "text-destructive" },
          { label: "Due This Week", value: stats.dueThisWeek, icon: Clock, color: "text-warning" },
          { label: "Active Alerts", value: stats.alerts, icon: AlertTriangle, color: "text-accent" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients by name or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            variant={patient.riskLevel === "high" ? "accent" : "default"}
            className="cursor-pointer hover:shadow-soft transition-all"
            onClick={() => setSelectedPatient(patient)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years • Week {patient.week}
                    </p>
                  </div>
                </div>
                <Badge variant={getRiskColor(patient.riskLevel)}>
                  {patient.riskLevel === "high" ? "High Risk" : patient.riskLevel === "medium" ? "Medium" : "Low Risk"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {patient.village}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">Last: {patient.lastVisit}</span>
                  <span className="text-primary font-medium">Next: {patient.nextVisit}</span>
                </div>
                {patient.alerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {patient.alerts.length} alert{patient.alerts.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>

              {patient.alerts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {patient.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 text-sm"
                    >
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-destructive">{alert}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations Card */}
      <Card variant="feature">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            AI-Generated Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-destructive">Priority Visit: Fatema Begum</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Blood pressure readings indicate potential preeclampsia risk. Recommend immediate referral to Rangpur Medical College Hospital for specialist consultation.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  Schedule Emergency Visit
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Nutrition Counseling Needed</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  3 patients show signs of nutritional deficiency. Consider group nutrition session focusing on iron-rich local foods (কচু শাক, পালং শাক, কলিজা).
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Plan Group Session
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Community Health Update</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall pregnancy outcomes in your area have improved by 15% this quarter. Continue the current antenatal care protocols.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
