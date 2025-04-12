"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSync } from "@/components/providers/sync-provider"
import type { Team } from "@/lib/types"
import { Users, MessageSquare, BookOpen, UserPlus, Copy, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TeamDetailProps {
  team: Team
}

export function TeamDetail({ team }: TeamDetailProps) {
  const [activeTab, setActiveTab] = useState("members")
  const { isOnline } = useSync()
  const { toast } = useToast()

  const copyTeamCode = () => {
    navigator.clipboard.writeText(team.code)
    toast({
      title: "Team code copied",
      description: "The team code has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}

          <Button variant="outline" onClick={copyTeamCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Team Code
          </Button>

          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Subject</div>
                <Badge variant="outline">{team.subject}</Badge>
              </div>

              <div>
                <div className="text-sm font-medium">Description</div>
                <p className="text-sm text-muted-foreground">{team.description || "No description provided."}</p>
              </div>

              <div>
                <div className="text-sm font-medium">Team Code</div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-muted px-2 py-1 rounded text-sm">{team.code}</code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyTeamCode}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">Created</div>
                <p className="text-sm text-muted-foreground">{new Date(team.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Team Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-xl p-4 text-center h-48 flex items-center justify-center">
                <p className="text-muted-foreground">Team chat feature coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="members" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="members" className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                Members ({team.members.length})
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center">
                <BookOpen className="mr-1 h-4 w-4" />
                Assignments ({team.assignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-4 space-y-4">
              {team.members.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>

                    {member.isTeamLead && <Badge>Team Lead</Badge>}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="assignments" className="mt-4 space-y-4">
              {team.assignments.length > 0 ? (
                team.assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className={`overflow-hidden ${assignment.completed ? "border-green-500/20" : new Date(assignment.dueDate) < new Date() && !assignment.completed ? "border-destructive/20" : ""}`}
                  >
                    <div className="flex items-center p-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{assignment.title}</div>
                        <div className="text-sm flex items-center gap-4">
                          <div
                            className={`flex items-center ${new Date(assignment.dueDate) < new Date() && !assignment.completed ? "text-destructive" : "text-muted-foreground"}`}
                          >
                            {new Date(assignment.dueDate) < new Date() && !assignment.completed ? (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Calendar className="h-3 w-3 mr-1" />
                            )}
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>

                          {assignment.completed && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Completed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button asChild size="sm">
                        <Link href={`/assignments/${assignment.id}`}>View</Link>
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No team assignments found.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
