"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedIsAdmin = localStorage.getItem("isAdmin") === "true"

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAdmin(savedIsAdmin)
    } else {
      // Set default user for demo
      const defaultUser = {
        id: "user-1",
        name: "Alex Johnson",
        email: "alex@example.com",
      }
      setUser(defaultUser)
      localStorage.setItem("user", JSON.stringify(defaultUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - in a real app, this would call an API
    if (email === "admin@example.com" && password === "password") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.setItem("isAdmin", "false")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        showAuthModal,
        setShowAuthModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
