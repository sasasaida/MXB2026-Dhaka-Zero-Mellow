import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/mother-dashboard", label: "For Mothers" },
    { path: "/health-worker", label: "Health Workers" },
    { path: "/chat", label: "AI Assistant" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-lg shadow-glow">
            <span>M</span>
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full animate-pulse-soft" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground leading-none">Mellow</span>
            <span className="text-[10px] text-muted-foreground leading-none">মায়ের যত্ন</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                size="sm"
                className={isActive(item.path) ? "bg-primary/10 text-primary" : ""}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm">
            বাংলা
          </Button>
          <Button variant="hero" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive(item.path) ? "bg-primary/10 text-primary" : ""}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border mt-2">
              <Button variant="outline" size="sm" className="flex-1">
                বাংলা
              </Button>
              <Button variant="hero" size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
