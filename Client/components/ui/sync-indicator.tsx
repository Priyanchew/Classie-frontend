"use client"

import { useSync } from "@/components/providers/sync-provider"
import { Button } from "@/components/ui/button"
import { Cloud, CloudOff, RefreshCw, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function SyncIndicator() {
  const { isOnline, syncStatus, lastSynced, pendingChanges, syncNow } = useSync()

  const getIcon = () => {
    if (!isOnline) return <CloudOff className="h-4 w-4" />

    switch (syncStatus) {
      case "synced":
        return <Cloud className="h-4 w-4 text-green-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "pending":
        return <Cloud className="h-4 w-4 text-amber-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusText = () => {
    if (!isOnline) return "Offline"

    switch (syncStatus) {
      case "synced":
        return "Synced"
      case "syncing":
        return "Syncing..."
      case "pending":
        return `${pendingChanges} pending`
      case "error":
        return "Sync error"
    }
  }

  const getTooltipText = () => {
    if (!isOnline) return "You are currently offline. Changes will sync when you reconnect."

    switch (syncStatus) {
      case "synced":
        return lastSynced ? `Last synced: ${lastSynced.toLocaleTimeString()}` : "All changes are synced"
      case "syncing":
        return "Syncing your changes..."
      case "pending":
        return `${pendingChanges} changes waiting to sync`
      case "error":
        return "There was an error syncing. Click to try again."
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-1.5 text-xs",
              syncStatus === "error" && "text-destructive hover:text-destructive",
              !isOnline && "text-muted-foreground",
            )}
            onClick={() => syncStatus !== "syncing" && syncNow()}
            disabled={!isOnline && syncStatus === "syncing"}
          >
            {getIcon()}
            <span>{getStatusText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
