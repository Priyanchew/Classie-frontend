"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useSync } from "@/components/providers/sync-provider"
import { getActivities } from "@/lib/data-service"
import type { Activity } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RecentActivities } from "./recent-activities"

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities()
        setActivities(data)
        setFilteredActivities(data)
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  useEffect(() => {
    filterActivities(searchQuery, selectedTypes)
  }, [searchQuery, selectedTypes, activities])

  const filterActivities = (query: string, types: string[]) => {
    let filtered = [...activities]

    // Filter by search query
    if (query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(
        (a) => a.message.toLowerCase().includes(lowercaseQuery) || a.user.name.toLowerCase().includes(lowercaseQuery),
      )
    }

    // Filter by selected types
    if (types.length > 0) {
      filtered = filtered.filter((a) => types.includes(a.type))
    }

    setFilteredActivities(filtered)
  }

  const allTypes = [...new Set(activities.map((a) => a.type))].sort()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Activity Feed</h1>
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activity Feed</h1>
        {!isOnline && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Offline Mode
          </Badge>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter by Type</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {allTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTypes([...selectedTypes, type])
                  } else {
                    setSelectedTypes(selectedTypes.filter((t) => t !== type))
                  }
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {searchQuery.trim() !== "" || selectedTypes.length > 0
                ? "No activities match your search or filters."
                : "No activities found."}
            </p>
            {!isOnline && searchQuery.trim() === "" && selectedTypes.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently offline. Activities will load when you reconnect.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <RecentActivities activities={filteredActivities} />
      )}
    </div>
  )
}
