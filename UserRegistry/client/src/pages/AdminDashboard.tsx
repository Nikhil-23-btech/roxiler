import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import AddUserDialog from "@/components/AddUserDialog";
import AddStoreDialog from "@/components/AddStoreDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { Button } from "@/components/ui/button";
import { Users, Store, Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/RatingStars";
import { adminApi, authApi, type UserData } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminDashboardProps {
  user: UserData;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState("dashboard");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => adminApi.getStats(),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: () => adminApi.getUsers(),
    enabled: currentView === "users",
  });

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/admin/stores"],
    queryFn: () => adminApi.getStores(),
    enabled: currentView === "stores",
  });

  const addUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "User added",
        description: "The new user has been created successfully.",
      });
      setAddUserOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add user",
        description: error.message || "Unable to create user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addStoreMutation = useMutation({
    mutationFn: (data: any) => adminApi.addStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Store added",
        description: "The new store has been registered successfully.",
      });
      setAddStoreOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add store",
        description: error.message || "Unable to register store. Please try again.",
        variant: "destructive",
      });
    },
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

  const userColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { 
      key: "role", 
      label: "Role", 
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === "admin" ? "default" : "secondary"} className="capitalize">
          {value}
        </Badge>
      )
    },
    { key: "address", label: "Address" },
  ];

  const storeColumns = [
    { key: "name", label: "Store Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "address", label: "Address" },
    { 
      key: "rating", 
      label: "Rating", 
      sortable: true,
      render: (value: number) => <RatingStars rating={value || 0} size="sm" />
    },
  ];

  const renderContent = () => {
    if (currentView === "dashboard") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of platform statistics</p>
          </div>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard 
                title="Total Users" 
                value={stats?.totalUsers || 0} 
                icon={Users} 
                description="Registered users" 
              />
              <StatsCard 
                title="Total Stores" 
                value={stats?.totalStores || 0} 
                icon={Store} 
                description="Active stores" 
              />
              <StatsCard 
                title="Total Ratings" 
                value={stats?.totalRatings || 0} 
                icon={Star} 
                description="Submitted ratings" 
              />
            </div>
          )}
        </div>
      );
    }

    if (currentView === "users") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Users</h1>
              <p className="text-muted-foreground mt-1">Manage all platform users</p>
            </div>
            <Button onClick={() => setAddUserOpen(true)} data-testid="button-add-user">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
          {usersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={userColumns}
              data={users}
              searchPlaceholder="Search users by name, email, or address..."
              filterOptions={[
                {
                  key: "role",
                  label: "Role",
                  options: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                    { value: "owner", label: "Owner" },
                  ],
                },
              ]}
              onRowClick={(row) => console.log("View user:", row)}
            />
          )}
        </div>
      );
    }

    if (currentView === "stores") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Stores</h1>
              <p className="text-muted-foreground mt-1">Manage all registered stores</p>
            </div>
            <Button onClick={() => setAddStoreOpen(true)} data-testid="button-add-store">
              <Plus className="w-4 h-4 mr-2" />
              Add Store
            </Button>
          </div>
          {storesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={storeColumns}
              data={stores}
              searchPlaceholder="Search stores by name, email, or address..."
              onRowClick={(row) => console.log("View store:", row)}
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
          userRole="admin"
          userName={user.name}
          onNavigate={(path) => {
            if (path === "/dashboard") setCurrentView("dashboard");
            else if (path === "/users") setCurrentView("users");
            else if (path === "/stores") setCurrentView("stores");
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

      <AddUserDialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onAdd={(user) => addUserMutation.mutate(user)}
      />
      <AddStoreDialog
        open={addStoreOpen}
        onClose={() => setAddStoreOpen(false)}
        onAdd={(store) => addStoreMutation.mutate(store)}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={(current, newPass) => changePasswordMutation.mutate({ currentPassword: current, newPassword: newPass })}
      />
    </SidebarProvider>
  );
}
