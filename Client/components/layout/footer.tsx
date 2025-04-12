"use client"

import { useSync } from "@/components/providers/sync-provider"

export function Footer() {
  const { isOnline } = useSync()

  return (
    <footer className="border-t py-4 bg-muted/40">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <span>StudySync</span>
          <span className="text-xs">v1.0.0</span>
        </div>

        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <div className="flex items-center">
            <span className="mr-2">Status:</span>
            <span className={`inline-flex items-center ${isOnline ? "text-green-600" : "text-red-600"}`}>
              <span className={`h-2 w-2 rounded-full mr-1 ${isOnline ? "bg-green-600" : "bg-red-600"}`} />
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div>
            <span>© 2025 StudySync</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
