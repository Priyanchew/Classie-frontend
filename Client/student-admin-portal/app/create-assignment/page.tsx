"use client"

import { useRouter } from "next/navigation"
import { useRole } from "@/components/providers/role-provider"
import { CreateAssignmentForm } from "@/components/admin/create-assignment-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function CreateAssignmentPage() {
  const { role } = useRole()
  const router = useRouter()

  if (role !== "admin") {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Assignment</h1>
      <CreateAssignmentForm />
    </div>
  )
}
