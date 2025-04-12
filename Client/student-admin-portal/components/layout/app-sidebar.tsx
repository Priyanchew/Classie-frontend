"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LayoutDashboard, BookOpen, Activity, Users, Settings, LogOut, Moon, Sun, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAdmin, setShowAuthModal, logout } = useAuth()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium">{user?.name || "User"}</h3>
          <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <a href="/">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/assignments" || pathname.startsWith("/assignments/")}>
              <a href="/assignments">
                <BookOpen className="h-5 w-5" />
                <span>Assignments</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/activity"}>
              <a href="/activity">
                <Activity className="h-5 w-5" />
                <span>Activity Feed</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/teams" || pathname.startsWith("/teams/")}>
              <a href="/teams">
                <Users className="h-5 w-5" />
                <span>Teams</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-4" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <a href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <SidebarSeparator />

        <div className="space-y-2">
          {isAdmin ? (
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Exit Admin Mode</span>
            </Button>
          ) : (
            <Button variant="outline" className="w-full justify-start" onClick={() => setShowAuthModal(true)}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Switch to Admin</span>
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
