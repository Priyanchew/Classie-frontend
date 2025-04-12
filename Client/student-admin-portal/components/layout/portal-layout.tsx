"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { Footer } from "@/components/layout/footer"
import { useSync } from "@/components/providers/sync-provider"
import { SyncStatusBar } from "@/components/ui/sync-status-bar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/components/providers/auth-provider"
import { CreateTeamModal } from "@/components/teams/create-team-modal"
import { JoinTeamModal } from "@/components/teams/join-team-modal"

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { syncStatus } = useSync()
  const { showAuthModal, setShowAuthModal } = useAuth()
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const [showJoinTeamModal, setShowJoinTeamModal] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <TopNav onCreateTeam={() => setShowCreateTeamModal(true)} onJoinTeam={() => setShowJoinTeamModal(true)} />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1 bg-background">
              {syncStatus !== "synced" && <SyncStatusBar />}
              <div className="p-4 md:p-6 pb-16">{children}</div>
            </main>
          </SidebarInset>
        </div>
        <Footer />
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <CreateTeamModal isOpen={showCreateTeamModal} onClose={() => setShowCreateTeamModal(false)} />

      <JoinTeamModal isOpen={showJoinTeamModal} onClose={() => setShowJoinTeamModal(false)} />
    </SidebarProvider>
  )
}
