"use client"

import { useRole } from "@/components/providers/role-provider"
import { SubmissionsList } from "@/components/admin/submissions-list"
import { StudentSubmissions } from "@/components/student/student-submissions"

export default function SubmissionsPage() {
  const { role } = useRole()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      {role === "admin" ? <SubmissionsList /> : <StudentSubmissions />}
    </div>
  )
}
