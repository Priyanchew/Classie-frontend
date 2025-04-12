"use client"

import { useRole } from "@/components/providers/role-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, UserCog, ChevronDown } from "lucide-react"

export function RoleToggle() {
  const { role, setRole } = useRole()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {role === "student" ? <User className="h-4 w-4" /> : <UserCog className="h-4 w-4" />}
          <span className="hidden md:inline-flex">{role === "student" ? "Student" : "Admin"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setRole("student")}>
          <User className="h-4 w-4 mr-2" />
          <span>Student</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("admin")}>
          <UserCog className="h-4 w-4 mr-2" />
          <span>Admin</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
