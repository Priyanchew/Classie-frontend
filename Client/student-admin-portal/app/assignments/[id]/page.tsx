"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AssignmentDetail } from "@/components/assignments/assignment-detail"
import { useSync } from "@/components/providers/sync-provider"
import { getAssignment } from "@/lib/data-service"
import type { Assignment } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function AssignmentPage() {
  const params = useParams()
  const id = params.id as string
  const { isOnline } = useSync()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignment(id)
        setAssignment(data)
      } catch (error) {
        console.error("Failed to fetch assignment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-2xl">
          Assignment not found. {!isOnline && "You are currently offline."}
        </div>
      </div>
    )
  }

  return <AssignmentDetail assignment={assignment} />
}
