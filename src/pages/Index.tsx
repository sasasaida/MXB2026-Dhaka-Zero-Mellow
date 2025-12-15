import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  Users, 
  Apple, 
  Calendar,
  Shield,
  Wifi,
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles
} from "lucide-react";
import heroMother from "@/assets/hero-mother.png";

const features = [
  {
    icon: Calendar,
    title: "Pregnancy Tracker",
    description: "Week-by-week personalized care plans and checkup schedules based on WHO and DGHS guidelines.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Apple,
    title: "Nutrition Advisor",
    description: "Local Bangladeshi food recommendations rich in iron, calcium, and essential nutrients.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: MessageCircle,
    title: "AI Health Assistant",
    description: "24/7 bilingual support in English and Bangla for symptoms, questions, and guidance.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Users,
    title: "Health Worker Portal",
    description: "Patient management, AI recommendations, and community health insights for CHWs.",
    color: "text-tertiary",
    bg: "bg-tertiary/10",
  },
  {
    icon: Wifi,
    title: "Offline Mode",
    description: "Essential features work without internet for rural areas with limited connectivity.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Safe & Verified",
    description: "All advice follows WHO, DGHS Bangladesh, and UNICEF maternal health standards.",
    color: "text-success",
    bg: "bg-success/10",
  },
];

const stats = [
  { value: "40%", label: "Reduction in maternal mortality target" },
  { value: "24/7", label: "AI-powered support availability" },
  { value: "100+", label: "Local foods in nutrition database" },
  { value: "8M+", label: "Pregnant women in Bangladesh" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-accent/5" />
        
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <Badge variant="trimester" className="text-sm px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Maternal Health
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Every Mother Deserves 
                <span className="text-gradient-primary block">Safe & Healthy</span>
                Pregnancy Care
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                Mellow (মায়ের যত্ন) is your AI companion for personalized nutrition, 
                safe pregnancy practices, and 24/7 health guidance — designed for 
                Bangladeshi mothers and community health workers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/mother-dashboard">
                  <Button variant="hero" size="xl">
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/health-worker">
                  <Button variant="outline" size="xl">
                    I'm a Health Worker
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  WHO Aligned
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  DGHS Verified
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-success" />
                  বাংলা Supported
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in stagger-2">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />
              <img 
                src={heroMother} 
                alt="Pregnant mother receiving care" 
                className="relative rounded-3xl shadow-glow w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Care for Every Stage
            </h2>
            <p className="text-muted-foreground">
              From conception to delivery, Mellow provides personalized guidance 
              using AI and validated medical knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="feature"
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 fill-primary-foreground/20" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Zero Preventable Maternal Deaths
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join the mission to transform maternal healthcare in Bangladesh through 
            AI-enabled access to quality care, nutrition guidance, and community support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button variant="warm" size="xl">
                <MessageCircle className="h-5 w-5 mr-2" />
                Talk to AI Assistant
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
