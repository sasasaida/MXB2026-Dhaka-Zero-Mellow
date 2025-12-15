import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-black text-base shadow-sm">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground">Mellow</span>
                <span className="text-xs text-muted-foreground">মায়ের যত্ন</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered maternal health companion for Bangladeshi mothers and health workers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/mother-dashboard" className="hover:text-primary transition-colors">Pregnancy Tracker</Link></li>
              <li><Link to="/health-worker" className="hover:text-primary transition-colors">Health Worker Portal</Link></li>
              <li><Link to="/chat" className="hover:text-primary transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Nutrition Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Find Clinics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Emergency Contacts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@mellow.bd</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Mellow. Aligned with WHO & DGHS Bangladesh guidelines.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
