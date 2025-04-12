"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSync } from "@/components/providers/sync-provider"
import { getAssignments } from "@/lib/data-service"
import type { Assignment } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, ExternalLink } from "lucide-react"

export function AssignmentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments()
        setAssignments(data)
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center p-3 border rounded-md">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4 mt-1" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No assignments found.</p>
            {!isOnline && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently offline. Assignments will load when you reconnect.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {!isOnline && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Offline Mode
          </Badge>
        )}
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{assignment.subject}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center">
                    {assignment.syncStatus === "synced" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                      >
                        🟢 Synced
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                      >
                        🔴 Pending Sync
                      </Badge>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/assignments/${assignment.id}`}>
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center p-3 border rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {assignment.subject} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {assignment.syncStatus === "synced" ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                    >
                      🟢 Synced
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                    >
                      🔴 Pending
                    </Badge>
                  )}
                  <Button asChild size="sm">
                    <Link href={`/assignments/${assignment.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
