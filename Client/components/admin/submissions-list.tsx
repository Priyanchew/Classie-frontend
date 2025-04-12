"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSync } from "@/components/providers/sync-provider"
import { getSubmissions } from "@/lib/data-service"
import type { Submission } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Search } from "lucide-react"
import { ConflictResolutionModal } from "./conflict-resolution-modal"

export function SubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions()
        setSubmissions(data)
        setFilteredSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubmissions(submissions)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = submissions.filter(
      (submission) =>
        submission.assignmentTitle.toLowerCase().includes(query) ||
        submission.studentName.toLowerCase().includes(query),
    )

    setFilteredSubmissions(filtered)
  }, [searchQuery, submissions])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-10 w-full" />
        </div>

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by assignment or student name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {!isOnline && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Offline Mode
          </Badge>
        )}
      </div>

      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              {searchQuery.trim() !== "" ? "No submissions match your search." : "No submissions found."}
            </p>
            {!isOnline && searchQuery.trim() === "" && (
              <p className="text-sm text-muted-foreground mt-2">
                You are currently offline. Submissions will load when you reconnect.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{submission.assignmentTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="font-medium">Student: {submission.studentName}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Submitted: {new Date(submission.timestamp).toLocaleDateString()}</span>
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
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/assignments/${submission.assignmentId}`}>View Assignment</Link>
                    </Button>

                    <Button size="sm" onClick={() => setShowConflictModal(true)}>
                      View Submission
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConflictResolutionModal isOpen={showConflictModal} onClose={() => setShowConflictModal(false)} />
    </div>
  )
}
