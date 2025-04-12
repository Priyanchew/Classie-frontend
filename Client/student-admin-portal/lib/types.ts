export type SyncStatus = "synced" | "pending" | "error"
export type SubmissionStatus = "draft" | "submitted" | "graded"
export type ActivityType = "assignment" | "edit" | "deadline" | "team" | "join" | "comment" | "complete"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isTeamLead?: boolean
}

export interface Assignment {
  id: string
  title: string
  subject: string
  description: string
  dueDate: string
  createdAt: string
  updatedAt: string
  completed: boolean
  teamId?: string
  attachments?: string[]
  syncStatus: SyncStatus
}

export interface Team {
  id: string
  name: string
  subject: string
  description?: string
  code: string
  createdAt: string
  members: User[]
  assignmentCount: number
  assignments: Assignment[]
}

export interface Activity {
  id: string
  type: ActivityType
  message: string
  timestamp: string
  user: User
  link?: string
}

export interface Submission {
  id: string
  assignmentId: string
  assignmentTitle: string
  studentName: string
  content: string
  status: SubmissionStatus
  timestamp: string
  syncStatus: SyncStatus
}
