import { Heart, Users, MessageCircle, Calendar, Apple, AlertTriangle, Wifi, WifiOff } from "lucide-react";

export const Icons = {
  heart: Heart,
  users: Users,
  chat: MessageCircle,
  calendar: Calendar,
  nutrition: Apple,
  alert: AlertTriangle,
  online: Wifi,
  offline: WifiOff,
};

export const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const PregnancyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="currentColor">
    <circle cx="32" cy="12" r="8" />
    <path d="M44 28c0-6.627-5.373-12-12-12s-12 5.373-12 12v8c0 2.5 1 5 3 7l2 14c0 2 2 4 4 4h6c2 0 4-2 4-4l2-14c2-2 3-4.5 3-7v-8z" />
  </svg>
);

export const BabyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="8" r="4" />
    <path d="M12 14c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5z" />
  </svg>
);

export const StethoscopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

export const NutritionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 2.7 1.3 5.1 3.4 6.5L6 22l6-3 6 3-1.4-5.5c2.1-1.4 3.4-3.8 3.4-6.5zm-8 4c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
  </svg>
);
