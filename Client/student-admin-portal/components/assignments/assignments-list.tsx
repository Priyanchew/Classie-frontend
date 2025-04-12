"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSync } from "@/components/providers/sync-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { getAssignments } from "@/lib/data-service"
import type { Assignment } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Calendar, CheckCircle, AlertCircle, BookOpen, Plus, Filter, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AssignmentsList() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const { isOnline } = useSync()
  const { isAdmin } = useAuth()

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments()
        setAssignments(data)
        setFilteredAssignments(data)
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  useEffect(() => {
    filterAssignments(searchQuery, activeTab, selectedSubjects)
  }, [searchQuery, activeTab, selectedSubjects, assignments])

  const filterAssignments = (query: string, tab: string, subjects: string[]) => {
    let filtered = [...assignments]

    // Filter by tab
    if (tab === "forthcoming") {
      filtered = filtered.filter((a) => new Date(a.dueDate) > new Date() && !a.completed)
    } else if (tab === "past-due") {
      filtered = filtered.filter((a) => new Date(a.dueDate) < new Date() && !a.completed)
    } else if (tab === "completed") {
      filtered = filtered.filter((a) => a.completed)
    }

    // Filter by search query
    if (query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lowercaseQuery) ||
          a.subject.toLowerCase().includes(lowercaseQuery) ||
          a.description.toLowerCase().includes(lowercaseQuery),
      )
    }

    // Filter by selected subjects
    if (subjects.length > 0) {
      filtered = filtered.filter((a) => subjects.includes(a.subject))
    }

    setFilteredAssignments(filtered)
  }

  const allSubjects = [...new Set(assignments.map((a) => a.subject))].sort()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>

        <Skeleton className="h-10 w-full" />

        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
              Offline Mode
            </Badge>
          )}

          {isAdmin && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assignments..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter by Subject</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {allSubjects.map((subject) => (
              <DropdownMenuCheckboxItem
                key={subject}
                checked={selectedSubjects.includes(subject)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSubjects([...selectedSubjects, subject])
                  } else {
                    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
                  }
                }}
              >
                {subject}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all" className="flex items-center">
            <BookOpen className="mr-1 h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="forthcoming" className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Forthcoming
          </TabsTrigger>
          <TabsTrigger value="past-due" className="flex items-center">
            <AlertCircle className="mr-1 h-4 w-4" />
            Past Due
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {renderAssignmentsList(filteredAssignments)}
        </TabsContent>

        <TabsContent value="forthcoming" className="mt-4 space-y-4">
          {renderAssignmentsList(filteredAssignments)}
        </TabsContent>

        <TabsContent value="past-due" className="mt-4 space-y-4">
          {renderAssignmentsList(filteredAssignments)}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {renderAssignmentsList(filteredAssignments)}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderAssignmentsList(assignments: Assignment[]) {
    if (assignments.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {searchQuery.trim() !== "" || selectedSubjects.length > 0
                ? "No assignments match your search or filters."
                : `No ${activeTab !== "all" ? activeTab : ""} assignments found.`}
            </p>
            {!isOnline && searchQuery.trim() === "" && selectedSubjects.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently offline. Assignments will load when you reconnect.
              </p>
            )}
          </CardContent>
        </Card>
      )
    }

    return assignments.map((assignment) => (
      <Card
        key={assignment.id}
        className={`overflow-hidden ${assignment.completed ? "border-green-500/20" : new Date(assignment.dueDate) < new Date() && !assignment.completed ? "border-destructive/20" : ""}`}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{assignment.title}</span>
            <Badge variant="outline" className="ml-2">
              {assignment.subject}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm line-clamp-2">{assignment.description}</div>
              <div className="flex items-center gap-4 text-sm">
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

                {assignment.teamId && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>Team Assignment</span>
                  </div>
                )}

                {assignment.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Completed</span>
                  </div>
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
                  🔴 Pending
                </Badge>
              )}

              <Button asChild size="sm">
                <Link href={`/assignments/${assignment.id}`}>View</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  }
}
