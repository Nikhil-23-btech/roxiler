import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '../AppSidebar'

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          userRole="admin"
          userName="John Doe Smith Anderson"
          onNavigate={(path) => console.log('Navigate to:', path)}
          onLogout={() => console.log('Logout')}
        />
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-semibold">Main Content Area</h1>
          <p className="text-muted-foreground mt-2">
            This is where the main content would be displayed
          </p>
        </main>
      </div>
    </SidebarProvider>
  )
}
