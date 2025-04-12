"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { Activity } from "@/lib/types"
import { BookOpen, Edit, Clock, Users, UserPlus, MessageSquare, CheckCircle } from "lucide-react"

interface RecentActivitiesProps {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case "edit":
        return <Edit className="h-4 w-4 text-amber-500" />
      case "deadline":
        return <Clock className="h-4 w-4 text-red-500" />
      case "team":
        return <Users className="h-4 w-4 text-indigo-500" />
      case "join":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.user.name}</span>
                <span className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2">
                {getActivityIcon(activity.type)}
                <span>{activity.message}</span>
              </div>

              {activity.link && (
                <a href={activity.link} className="text-sm text-primary hover:underline inline-block mt-1">
                  View details
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
