"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSync } from "@/components/providers/sync-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { getAssignments, getTeams, getActivities } from "@/lib/data-service"
import type { Assignment, Team, Activity } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  BarChart3,
  BookMarked,
} from "lucide-react"
import { RecentActivities } from "@/components/activity/recent-activities"

export function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const { isOnline } = useSync()
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsData, teamsData, activitiesData] = await Promise.all([
          getAssignments(),
          getTeams(),
          getActivities(),
        ])
        setAssignments(assignmentsData)
        setTeams(teamsData)
        setActivities(activitiesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const upcomingAssignments = assignments.filter((a) => new Date(a.dueDate) > new Date() && !a.completed).slice(0, 5)

  const overdueAssignments = assignments.filter((a) => new Date(a.dueDate) < new Date() && !a.completed).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignments.length}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-amber-500" />
                <span>{overdueAssignments.length} overdue</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>{assignments.filter((a) => a.completed).length} completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {teams.reduce((acc, team) => acc + team.members.length, 0)} team members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              {isAdmin ? (
                <>
                  <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                  Admin Stats
                </>
              ) : (
                <>
                  <BookMarked className="h-4 w-4 mr-2 text-primary" />
                  Progress
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isAdmin ? (
                <>{assignments.length}</>
              ) : (
                <>
                  {Math.round((assignments.filter((a) => a.completed).length / Math.max(assignments.length, 1)) * 100)}%
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? <>Total assignments created</> : <>Assignment completion rate</>}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/assignments">
                View All
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex items-center">
                <AlertCircle className="mr-1 h-4 w-4" />
                Overdue
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4 space-y-2">
              {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
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
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/assignments/${assignment.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">No upcoming assignments</div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="mt-4 space-y-2">
              {overdueAssignments.length > 0 ? (
                overdueAssignments.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden border-destructive/20">
                    <div className="flex items-center p-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{assignment.title}</div>
                        <div className="text-sm text-destructive flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Overdue</Badge>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/assignments/${assignment.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">No overdue assignments</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/activity">
                View All
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          <RecentActivities activities={activities.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}
