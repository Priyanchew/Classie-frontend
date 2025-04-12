"use client"

import { Bell, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SyncIndicator } from "@/components/ui/sync-indicator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/providers/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TopNavProps {
  onCreateTeam: () => void
  onJoinTeam: () => void
}

export function TopNav({ onCreateTeam, onJoinTeam }: TopNavProps) {
  const { isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>

        <div className="hidden md:flex md:items-center md:gap-2">
          <div className="font-semibold text-lg">StudySync</div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <SyncIndicator />

          {!isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:inline-flex">Team</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onCreateTeam}>Create Team</DropdownMenuItem>
                <DropdownMenuItem onClick={onJoinTeam}>Join Team</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2 border-b">
                <h4 className="font-medium">Notifications</h4>
                <Badge variant="outline" className="ml-auto">
                  New
                </Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-2 border-b">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Assignment deadline approaching</p>
                      <p className="text-xs text-muted-foreground">Physics assignment due in 2 days</p>
                      <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-b">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">New team message</p>
                      <p className="text-xs text-muted-foreground">Sarah posted in Physics Study Group</p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-muted flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Assignment graded</p>
                      <p className="text-xs text-muted-foreground">Your Math assignment has been graded</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
