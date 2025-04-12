"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import type { Assignment, Submission } from "@/lib/types"
import { getSubmissionsForAssignment } from "@/lib/data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Download, Edit, Trash, Users } from "lucide-react"
import { ConflictResolutionModal } from "./conflict-resolution-modal"

interface AdminAssignmentDetailProps {
  assignment: Assignment
}

export function AdminAssignmentDetail({ assignment }: AdminAssignmentDetailProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const { isOnline } = useSync()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissionsForAssignment(assignment.id)
        setSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [assignment.id])

  const handleDelete = () => {
    toast({
      title: "Not implemented",
      description: "Delete functionality is not implemented in this demo.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}

          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="space-y-1">
              <CardTitle>{assignment.subject}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
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
                  🔴 Pending Sync
                </Badge>
              )}

              {assignment.attachments && assignment.attachments.length > 0 && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Attachments ({assignment.attachments.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>{assignment.description}</p>
          </div>

          <Tabs defaultValue="submissions">
            <TabsList>
              <TabsTrigger value="submissions">
                <Users className="h-4 w-4 mr-2" />
                Submissions ({submissions.length})
              </TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="mt-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center p-3 border rounded-md">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/4 mt-1" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div key={submission.id} className="flex items-center p-3 border rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{submission.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            Submitted: {new Date(submission.timestamp).toLocaleDateString()}
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
                              🔴 Pending Sync
                            </Badge>
                          )}

                          <Button size="sm" onClick={() => setShowConflictModal(true)}>
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">No submissions yet</div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Assignment ID</h3>
                  <p className="text-sm text-muted-foreground">{assignment.id}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Created</h3>
                  <p className="text-sm text-muted-foreground">{new Date(assignment.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Last Modified</h3>
                  <p className="text-sm text-muted-foreground">{new Date(assignment.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConflictResolutionModal isOpen={showConflictModal} onClose={() => setShowConflictModal(false)} />
    </div>
  )
}
