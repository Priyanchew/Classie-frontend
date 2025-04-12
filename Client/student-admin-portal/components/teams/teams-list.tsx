"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSync } from "@/components/providers/sync-provider"
import { getTeams } from "@/lib/data-service"
import type { Team } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Users, BookOpen, Plus, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams()
        setTeams(data)
        setFilteredTeams(data)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeams(teams)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.subject.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query),
    )

    setFilteredTeams(filtered)
  }, [searchQuery, teams])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Teams</h1>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="flex items-center">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>

          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Team
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search teams..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {searchQuery.trim() !== "" ? "No teams match your search." : "No teams found."}
            </p>
            {!isOnline && searchQuery.trim() === "" && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently offline. Teams will load when you reconnect.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                <Badge variant="outline" className="mb-2">
                  {team.subject}
                </Badge>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {team.description || "No description provided."}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{team.members.length} Members</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <span>{team.assignmentCount} Assignments</span>
                  </div>

                  <div className="flex -space-x-2 mt-4">
                    {team.members.slice(0, 5).map((member, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                    {team.members.length > 5 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full">
                  <Link href={`/teams/${team.id}`}>View Team</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
