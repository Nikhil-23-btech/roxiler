import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Store, Star, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppSidebarProps {
  userRole: "admin" | "user" | "owner";
  userName: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function AppSidebar({ userRole, userName, onNavigate, onLogout }: AppSidebarProps) {
  const adminItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Users", icon: Users, path: "/users" },
    { title: "Stores", icon: Store, path: "/stores" },
  ];

  const userItems = [
    { title: "Browse Stores", icon: Store, path: "/browse" },
    { title: "My Ratings", icon: Star, path: "/ratings" },
  ];

  const ownerItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Ratings", icon: Star, path: "/ratings" },
  ];

  const menuItems = userRole === "admin" ? adminItems : userRole === "user" ? userItems : ownerItems;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">Rating Platform</h2>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => onNavigate(item.path)}>
                    <button data-testid={`link-${item.path.slice(1)}`} className="hover-elevate active-elevate-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={() => onNavigate("/settings")}>
                  <button data-testid="link-settings" className="hover-elevate active-elevate-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
