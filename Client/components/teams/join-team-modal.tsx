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
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import { joinTeam } from "@/lib/data-service"
import { Loader2, UserPlus } from "lucide-react"

interface JoinTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinTeamModal({ isOpen, onClose }: JoinTeamModalProps) {
  const [teamCode, setTeamCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [teamName, setTeamName] = useState("")
  const { isOnline } = useSync()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teamCode) {
      toast({
        title: "Missing team code",
        description: "Please enter a team code to join.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const team = await joinTeam(teamCode)
      setTeamName(team.name)
      setSuccess(true)

      toast({
        title: "Team joined",
        description: isOnline
          ? `You have successfully joined ${team.name}.`
          : `You have joined ${team.name}. This will sync when you're online.`,
      })
    } catch (error) {
      console.error("Failed to join team:", error)
      toast({
        title: "Failed to join team",
        description: "Invalid team code or an error occurred.",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTeamCode("")
    setSuccess(false)
    setTeamName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Join a Team
              </DialogTitle>
              <DialogDescription>Enter the team code to join an existing team.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="teamCode">Team Code</Label>
                <Input
                  id="teamCode"
                  placeholder="Enter team code"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">The team code is provided by the team creator or admin.</p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Team"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <UserPlus className="h-5 w-5" />
                Team Joined Successfully!
              </DialogTitle>
              <DialogDescription>You are now a member of {teamName}.</DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <p className="text-sm text-muted-foreground">
                You can now access team assignments and collaborate with other team members.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Go to Teams</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
