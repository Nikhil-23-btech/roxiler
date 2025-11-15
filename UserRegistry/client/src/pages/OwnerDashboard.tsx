import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import RatingStars from "@/components/RatingStars";
import { Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ownerApi, authApi, type UserData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface OwnerDashboardProps {
  user: UserData;
  onLogout: () => void;
}

export default function OwnerDashboard({ user, onLogout }: OwnerDashboardProps) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/owner/stats"],
    queryFn: () => ownerApi.getStats(),
  });

  const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ["/api/owner/ratings"],
    queryFn: () => ownerApi.getRatings(),
    enabled: currentView === "ratings",
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      setChangePasswordOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to change password",
        description: error.message || "Unable to update password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const ratingColumns = [
    { key: "userName", label: "User Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { 
      key: "rating", 
      label: "Rating", 
      sortable: true,
      render: (value: number) => <RatingStars rating={value} size="sm" />
    },
    { key: "date", label: "Date", sortable: true },
  ];

  const renderContent = () => {
    if (currentView === "dashboard") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your store performance</p>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold" data-testid="text-average-rating">
                        {stats?.averageRating?.toFixed(1) || "0.0"}
                      </p>
                      <RatingStars rating={stats?.averageRating || 0} size="lg" />
                    </div>
                    <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <StatsCard 
                title="Total Ratings" 
                value={stats?.totalRatings || 0} 
                icon={TrendingUp}
                description="From all customers"
              />
            </div>
          )}
        </div>
      );
    }

    if (currentView === "ratings") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Customer Ratings</h1>
            <p className="text-muted-foreground mt-1">View all ratings submitted by customers</p>
          </div>
          {ratingsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={ratingColumns}
              data={ratings}
              searchPlaceholder="Search by user name or email..."
            />
          )}
        </div>
      );
    }

    if (currentView === "settings") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings</p>
          </div>
          <div className="max-w-2xl">
            <Button onClick={() => setChangePasswordOpen(true)} data-testid="button-change-password">
              Change Password
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          userRole="owner"
          userName={user.name}
          onNavigate={(path) => {
            if (path === "/dashboard") setCurrentView("dashboard");
            else if (path === "/ratings") setCurrentView("ratings");
            else if (path === "/settings") setCurrentView("settings");
          }}
          onLogout={onLogout}
        />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={(current, newPass) => changePasswordMutation.mutate({ currentPassword: current, newPassword: newPass })}
      />
    </SidebarProvider>
  );
}
