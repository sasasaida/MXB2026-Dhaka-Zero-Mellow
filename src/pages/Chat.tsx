import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Shield } from "lucide-react";

const Chat = () => {
  const quickLinks = [
    {
      title: "Emergency Contacts",
      icon: Phone,
      items: [
        { label: "National Emergency", value: "999" },
        { label: "Ambulance", value: "10666" },
        { label: "Women Helpline", value: "10921" },
      ],
    },
    {
      title: "Find Nearby Clinics",
      icon: MapPin,
      items: [
        { label: "Rangpur Medical College", value: "2.3 km" },
        { label: "Sadar Hospital", value: "1.8 km" },
        { label: "BRAC Health Center", value: "0.9 km" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              AI Health Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Ask any question about your pregnancy in English or বাংলা
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="success" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              WHO & DGHS Verified
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              24/7 Available
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {quickLinks.map((section, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <section.icon className="h-5 w-5 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-primary">{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Safety Notice */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Medical Disclaimer</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This AI provides general health information based on WHO and DGHS guidelines. 
                      Always consult a healthcare provider for medical decisions. In emergencies, 
                      call 999 immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Topics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Common Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Morning sickness",
                    "Iron supplements",
                    "Safe foods",
                    "Exercise",
                    "Sleep positions",
                    "Warning signs",
                    "Baby movement",
                    "Vitamin D",
                  ].map((topic, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
