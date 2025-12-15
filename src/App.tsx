import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import MotherDashboard from "./pages/MotherDashboard";
import HealthWorker from "./pages/HealthWorker";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle root route redirects based on authentication state
function RootRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect authenticated users to their appropriate dashboard
  const redirectPath = user.role === 'mother' ? '/mother-dashboard' : '/health-worker';
  return <Navigate to={redirectPath} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes for mothers */}
            <Route element={<ProtectedRoute allowedRoles={['mother']} />}>
              <Route path="/mother-dashboard" element={<MotherDashboard />} />
            </Route>
            
            {/* Protected routes for CHWs */}
            <Route element={<ProtectedRoute allowedRoles={['chw']} />}>
              <Route path="/health-worker" element={<HealthWorker />} />
            </Route>
            
            {/* Protected routes for both roles */}
            <Route element={<ProtectedRoute allowedRoles={['mother', 'chw']} />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
            
            {/* Keep Index page accessible for now - can be removed if not needed */}
            <Route path="/index" element={<Index />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
