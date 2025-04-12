"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FileText, Settings, X, PlusCircle, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRole } from "@/components/providers/role-provider"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { role } = useRole()

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">{role === "student" ? "Student Portal" : "Admin Portal"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-2 space-y-1">
          <NavItem href="/" icon={<LayoutDashboard className="mr-2 h-5 w-5" />} active={pathname === "/"}>
            Dashboard
          </NavItem>

          <NavItem
            href="/assignments"
            icon={<BookOpen className="mr-2 h-5 w-5" />}
            active={pathname === "/assignments" || pathname.startsWith("/assignments/")}
          >
            Assignments
          </NavItem>

          <NavItem
            href="/submissions"
            icon={<FileText className="mr-2 h-5 w-5" />}
            active={pathname === "/submissions"}
          >
            Submissions
          </NavItem>

          {role === "admin" && (
            <NavItem
              href="/create-assignment"
              icon={<PlusCircle className="mr-2 h-5 w-5" />}
              active={pathname === "/create-assignment"}
            >
              Create Assignment
            </NavItem>
          )}

          <NavItem href="/settings" icon={<Settings className="mr-2 h-5 w-5" />} active={pathname === "/settings"}>
            Settings
          </NavItem>
        </nav>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  active: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  )
}
