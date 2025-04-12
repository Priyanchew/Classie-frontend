"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import type { Assignment, SubmissionStatus } from "@/lib/types"
import { saveSubmission } from "@/lib/data-service"
import { Calendar, Download, Save } from "lucide-react"

interface AssignmentDetailProps {
  assignment: Assignment
}

export function AssignmentDetail({ assignment }: AssignmentDetailProps) {
  const [answer, setAnswer] = useState("")
  const [status, setStatus] = useState<SubmissionStatus>("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOnline } = useSync()
  const { toast } = useToast()
  const router = useRouter()

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
      await saveSubmission({
        assignmentId: assignment.id,
        content: answer,
        status: "draft",
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Draft saved",
        description: isOnline
          ? "Your draft has been saved."
          : "Your draft has been saved locally and will sync when you're online.",
      })

      setStatus("draft")
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
      await saveSubmission({
        assignmentId: assignment.id,
        content: answer,
        status: "submitted",
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Assignment submitted",
        description: isOnline
          ? "Your assignment has been submitted successfully."
          : "Your assignment has been submitted locally and will sync when you're online.",
      })

      setStatus("submitted")

      // Redirect to submissions page after a short delay
      setTimeout(() => {
        router.push("/submissions")
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        {!isOnline && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Offline Mode
          </Badge>
        )}
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

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Your Answer</h3>
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[200px]"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
        </CardContent>

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
      </Card>
    </div>
  )
}
