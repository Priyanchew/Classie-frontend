"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type UserRole = "student" | "admin"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("student")

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole | null
    if (savedRole && (savedRole === "student" || savedRole === "admin")) {
      setRole(savedRole)
    }
  }, [])

  // Save role to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("userRole", role)
  }, [role])

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
