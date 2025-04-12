"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import { useAuth } from "@/components/providers/auth-provider"
import type { Assignment } from "@/lib/types"
import { submitAssignment } from "@/lib/data-service"
import { Calendar, Download, Save, Users, CheckCircle, AlertCircle, FileText, MessageSquare, Clock } from "lucide-react"

interface AssignmentDetailProps {
  assignment: Assignment
}

export function AssignmentDetail({ assignment }: AssignmentDetailProps) {
  const [answer, setAnswer] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOnline } = useSync()
  const { isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const isPastDue = new Date(assignment.dueDate) < new Date() && !assignment.completed

  const handleSaveDraft = async () => {
    if (!answer.trim()) {
      toast({
        title: "Cannot save empty answer",
        description: "Please enter your answer before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      await submitAssignment({
        assignmentId: assignment.id,
        content: answer,
        status: "draft",
      })

      toast({
        title: "Draft saved",
        description: isOnline
          ? "Your draft has been saved."
          : "Your draft has been saved locally and will sync when you're online.",
      })
    } catch (error) {
      console.error("Failed to save draft:", error)
      toast({
        title: "Failed to save draft",
        description: "An error occurred while saving your draft.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Cannot submit empty answer",
        description: "Please enter your answer before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitAssignment({
        assignmentId: assignment.id,
        content: answer,
        status: "submitted",
      })

      toast({
        title: "Assignment submitted",
        description: isOnline
          ? "Your assignment has been submitted successfully."
          : "Your assignment has been submitted locally and will sync when you're online.",
      })

      toast({
        title: "Assignment completed",
        description: "Your assignment has been marked as completed.",
      })

      // Redirect to assignments page after a short delay
      setTimeout(() => {
        router.push("/assignments")
      }, 1500)
    } catch (error) {
      console.error("Failed to submit assignment:", error)
      toast({
        title: "Failed to submit",
        description: "An error occurred while submitting your assignment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}

          {assignment.completed && (
            <Badge variant="success" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}

          {isPastDue && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Past Due
            </Badge>
          )}
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center">
                <span>{assignment.subject}</span>
                {assignment.teamId && (
                  <Badge variant="outline" className="ml-2">
                    <Users className="h-3 w-3 mr-1" />
                    Team Assignment
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>

                {isPastDue && (
                  <span className="ml-2 text-destructive flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {Math.ceil((new Date().getTime() - new Date(assignment.dueDate).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    days overdue
                  </span>
                )}
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

        <Tabs defaultValue="assignment">
          <TabsList className="px-6 pt-2">
            <TabsTrigger value="assignment" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Assignment
            </TabsTrigger>
            {assignment.teamId && (
              <TabsTrigger value="discussion" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                Team Discussion
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="assignment" className="pt-2">
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>{assignment.description}</p>
              </div>

              {!isAdmin && !assignment.completed && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Your Answer</h3>
                  <Textarea
                    placeholder="Type your answer here..."
                    className="min-h-[200px] rounded-xl"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>
              )}
            </CardContent>

            {!isAdmin && !assignment.completed && (
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving || isSubmitting}>
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </>
                  )}
                </Button>

                <Button onClick={handleSubmit} disabled={isSaving || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </Button>
              </CardFooter>
            )}
          </TabsContent>

          {assignment.teamId && (
            <TabsContent value="discussion">
              <CardContent className="pt-2">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-muted-foreground">Team discussion feature coming soon.</p>
                </div>
              </CardContent>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>
  )
}
