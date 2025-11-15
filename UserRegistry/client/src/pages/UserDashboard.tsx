import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import StoreCard from "@/components/StoreCard";
import RatingDialog from "@/components/RatingDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { userApi, authApi, type UserData } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface UserDashboardProps {
  user: UserData;
  onLogout: () => void;
}

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [currentView, setCurrentView] = useState("browse");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const { toast } = useToast();

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/user/stores", { name: searchName, address: searchAddress }],
    queryFn: () => userApi.getStores({ name: searchName, address: searchAddress }),
  });

  const submitRatingMutation = useMutation({
    mutationFn: ({ storeId, rating }: { storeId: string; rating: number }) =>
      userApi.submitRating(storeId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/stores"] });
      toast({
        title: "Rating submitted",
        description: "Your rating has been saved successfully.",
      });
      setRatingDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit rating",
        description: error.message || "Unable to save rating. Please try again.",
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

  const handleRateStore = (store: any) => {
    setSelectedStore(store);
    setRatingDialogOpen(true);
  };

  const renderContent = () => {
    if (currentView === "browse") {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Browse Stores</h1>
            <p className="text-muted-foreground mt-1">Discover and rate stores on the platform</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9"
                data-testid="input-search-name"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pl-9"
                data-testid="input-search-address"
              />
            </div>
          </div>

          {storesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stores found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store: any) => (
                <StoreCard
                  key={store.id}
                  name={store.name}
                  address={store.address}
                  rating={store.rating || 0}
                  userRating={store.userRating}
                  onRate={() => handleRateStore(store)}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (currentView === "ratings") {
      const ratedStores = stores.filter((store: any) => store.userRating !== undefined);
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">My Ratings</h1>
            <p className="text-muted-foreground mt-1">View and manage your submitted ratings</p>
          </div>

          {storesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : ratedStores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't rated any stores yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ratedStores.map((store: any) => (
                <StoreCard
                  key={store.id}
                  name={store.name}
                  address={store.address}
                  rating={store.rating || 0}
                  userRating={store.userRating}
                  onRate={() => handleRateStore(store)}
                />
              ))}
            </div>
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
          userRole="user"
          userName={user.name}
          onNavigate={(path) => {
            if (path === "/browse") setCurrentView("browse");
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

      {selectedStore && (
        <RatingDialog
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
          storeName={selectedStore.name}
          currentRating={selectedStore.userRating}
          onSubmit={(rating) => submitRatingMutation.mutate({ storeId: selectedStore.id, rating })}
        />
      )}

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={(current, newPass) => changePasswordMutation.mutate({ currentPassword: current, newPassword: newPass })}
      />
    </SidebarProvider>
  );
}
