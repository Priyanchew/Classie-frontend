"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSync } from "@/components/providers/sync-provider"
import { getSubmissions } from "@/lib/data-service"
import type { Submission } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ExternalLink } from "lucide-react"

export function StudentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const { isOnline } = useSync()

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getSubmissions()
        setSubmissions(data)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
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

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No submissions found.</p>
          {!isOnline && (
            <p className="text-sm text-muted-foreground mt-2">
              You are currently offline. Submissions will load when you reconnect.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {!isOnline && (
        <div className="flex justify-end">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
            Offline Mode
          </Badge>
        </div>
      )}

      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{submission.assignmentTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
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

              <Button asChild size="sm">
                <Link href={`/assignments/${submission.assignmentId}`}>
                  View <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
