"use client"

import { useSync } from "@/components/providers/sync-provider"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, CloudOff } from "lucide-react"

export function SyncStatusBar() {
  const { isOnline, syncStatus, pendingChanges, syncNow } = useSync()

  if (!isOnline) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudOff className="h-4 w-4" />
          <span>You are currently offline. Changes will be saved locally and synced when you reconnect.</span>
        </div>
      </div>
    )
  }

  if (syncStatus === "syncing") {
    return (
      <div className="bg-blue-500/10 border-b border-blue-500/20 text-blue-700 dark:text-blue-400 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing your changes...</span>
        </div>
      </div>
    )
  }

  if (syncStatus === "pending") {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>
            {pendingChanges} {pendingChanges === 1 ? "change" : "changes"} waiting to sync
          </span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs bg-background" onClick={() => syncNow()}>
          Sync Now
        </Button>
      </div>
    )
  }

  if (syncStatus === "error") {
    return (
      <div className="bg-destructive/10 border-b border-destructive/20 text-destructive px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>There was an error syncing your changes</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs bg-background text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={() => syncNow()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return null
}
