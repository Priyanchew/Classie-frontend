"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type SyncStatus = "synced" | "syncing" | "pending" | "error"

interface SyncContextType {
  isOnline: boolean
  syncStatus: SyncStatus
  lastSynced: Date | null
  pendingChanges: number
  syncNow: () => Promise<void>
}

const SyncContext = createContext<SyncContextType | undefined>(undefined)

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("synced")
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = useState<number>(0)

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Simulate auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingChanges > 0) {
      syncNow()
    }
  }, [isOnline, pendingChanges])

  // Simulate periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && pendingChanges > 0) {
        syncNow()
      }
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [isOnline, pendingChanges])

  // Simulate adding pending changes occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add pending changes for demo purposes
      if (Math.random() > 0.7) {
        setPendingChanges((prev) => prev + Math.floor(Math.random() * 3) + 1)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const syncNow = async () => {
    if (!isOnline || syncStatus === "syncing") return

    try {
      setSyncStatus("syncing")

      // Simulate sync delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful sync
      setPendingChanges(0)
      setLastSynced(new Date())
      setSyncStatus("synced")
    } catch (error) {
      console.error("Sync failed:", error)
      setSyncStatus("error")
    }
  }

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        syncStatus,
        lastSynced,
        pendingChanges,
        syncNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  )
}

export function useSync() {
  const context = useContext(SyncContext)
  if (context === undefined) {
    throw new Error("useSync must be used within a SyncProvider")
  }
  return context
}
