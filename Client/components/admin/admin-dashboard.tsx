"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSync } from "@/components/providers/sync-provider"
import { getAssignments, getSubmissions } from "@/lib/data-service"
import type { Assignment, Submission } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, PlusCircle } from "lucide-react"

export function AdminDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsData, submissionsData] = await Promise.all([getAssignments(), getSubmissions()])
        setAssignments(assignmentsData)
        setSubmissions(submissionsData)
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}
          <Button asChild>
            <Link href="/create-assignment">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {assignments.filter((a) => a.syncStatus !== "synced").length} pending sync
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {submissions.filter((s) => s.syncStatus !== "synced").length} pending sync
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              {isOnline ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span className="text-amber-500">Offline</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline ? "All changes will sync automatically" : "Changes will sync when online"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Recent Assignments</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {assignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center p-4">
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
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/assignments/${assignment.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {assignments.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No assignments found</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/assignments">
                  View All Assignments
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center p-4">
                    <div className="flex-1">
                      <div className="font-medium">{submission.assignmentTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        Student: {submission.studentName} • Submitted:{" "}
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={submission.status === "submitted" ? "default" : "outline"}>
                        {submission.status === "submitted" ? "Submitted" : "Draft"}
                      </Badge>

                      {submission.syncStatus === "synced" ? (
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
                        <Link href={`/assignments/${submission.assignmentId}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {submissions.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">No submissions found</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/submissions">
                  View All Submissions
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
