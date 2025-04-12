"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import { createTeam } from "@/lib/data-service"
import { Loader2, Users } from "lucide-react"

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teamCode, setTeamCode] = useState("")
  const { isOnline } = useSync()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !subject) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const team = await createTeam({
        name,
        subject,
        description,
      })

      setTeamCode(team.code)

      toast({
        title: "Team created",
        description: isOnline
          ? "Your team has been created successfully."
          : "Your team has been created locally and will sync when you're online.",
      })
    } catch (error) {
      console.error("Failed to create team:", error)
      toast({
        title: "Failed to create team",
        description: "An error occurred while creating your team.",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName("")
    setSubject("")
    setDescription("")
    setTeamCode("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {!teamCode ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Create a New Team
              </DialogTitle>
              <DialogDescription>Create a team to collaborate with other students on assignments.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name*</Label>
                <Input
                  id="name"
                  placeholder="Enter team name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject*</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject (e.g., Physics, Math)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter team description"
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Users className="h-5 w-5" />
                Team Created Successfully!
              </DialogTitle>
              <DialogDescription>Share this code with others to invite them to your team.</DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="bg-muted p-4 rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-2">Team Code</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{teamCode}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                This code can be used by other students to join your team. Keep it secure and only share with those you
                want to invite.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
