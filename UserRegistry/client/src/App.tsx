import { useState, useEffect } from "react";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "@/pages/AuthPage";
import AdminDashboard from "@/pages/AdminDashboard";
import UserDashboard from "@/pages/UserDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";
import { authApi, type AuthResponse } from "./lib/api";

function AppContent() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    authApi.getMe()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        // User not logged in
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = async (data: AuthResponse) => {
    setUser(data);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return <AdminDashboard user={user.user} onLogout={handleLogout} />;
  }

  if (user.role === "user") {
    return <UserDashboard user={user.user} onLogout={handleLogout} />;
  }

  if (user.role === "owner") {
    return <OwnerDashboard user={user.user} onLogout={handleLogout} />;
  }

  return <AuthPage onLogin={handleLogin} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
