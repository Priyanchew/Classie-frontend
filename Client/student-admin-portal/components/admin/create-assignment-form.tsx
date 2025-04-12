"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import { createAssignment } from "@/lib/data-service"
import { Calendar, Upload } from "lucide-react"

export function CreateAssignmentForm() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOnline } = useSync()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !subject || !description || !dueDate) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createAssignment({
        title,
        subject,
        description,
        dueDate,
      })

      toast({
        title: "Assignment created",
        description: isOnline
          ? "Your assignment has been created successfully."
          : "Your assignment has been created locally and will sync when you're online.",
      })

      // Redirect to assignments page after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Failed to create assignment:", error)
      toast({
        title: "Failed to create assignment",
        description: "An error occurred while creating your assignment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assignment Details</CardTitle>
            {!isOnline && (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
              >
                Offline Mode
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter assignment description"
              className="min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                className="pl-10"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="border border-dashed rounded-md p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Drag and drop files here, or click to select files</p>
              <p className="text-xs text-muted-foreground">Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
              <Input id="attachments" type="file" className="hidden" multiple />
              <Button type="button" variant="outline" size="sm" className="mt-4">
                Select Files
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
