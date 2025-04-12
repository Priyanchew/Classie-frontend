"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { TeamDetail } from "@/components/teams/team-detail"
import { useSync } from "@/components/providers/sync-provider"
import { getTeam } from "@/lib/data-service"
import type { Team } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function TeamPage() {
  const params = useParams()
  const id = params.id as string
  const { isOnline } = useSync()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeam(id)
        setTeam(data)
      } catch (error) {
        console.error("Failed to fetch team:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
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

  if (!team) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-2xl">
          Team not found. {!isOnline && "You are currently offline."}
        </div>
      </div>
    )
  }

  return <TeamDetail team={team} />
}
