"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useSync } from "@/components/providers/sync-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Moon, Sun, Laptop, Save, Loader2, Shield, Database } from "lucide-react"

export function SettingsPage() {
  const [name, setName] = useState("Alex Johnson")
  const [email, setEmail] = useState("alex@example.com")
  const [isSaving, setIsSaving] = useState(false)
  const { theme, setTheme } = useTheme()
  const { isOnline } = useSync()
  const { isAdmin, setShowAuthModal } = useAuth()
  const { toast } = useToast()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })

    setIsSaving(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-1 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Sun className="mr-1 h-4 w-4 dark:hidden" />
            <Moon className="mr-1 h-4 w-4 hidden dark:block" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Database className="mr-1 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Switch to admin mode to manage assignments and teams.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Admin Mode</div>
                  <div className="text-sm text-muted-foreground">
                    {isAdmin
                      ? "You currently have admin privileges"
                      : "Switch to admin mode to access administrative features"}
                  </div>
                </div>

                {isAdmin ? (
                  <div className="text-sm text-green-600 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin Mode Active
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Switch to Admin
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Assignment Reminders</div>
                  <div className="text-sm text-muted-foreground">Receive notifications about upcoming assignments</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Team Updates</div>
                  <div className="text-sm text-muted-foreground">Receive notifications about team activities</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive email notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the appearance of the application.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="font-medium">Theme</div>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>

                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>

                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Offline Storage</CardTitle>
              <CardDescription>Manage your offline data and synchronization settings.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Offline Mode</div>
                  <div className="text-sm text-muted-foreground">Current status: {isOnline ? "Online" : "Offline"}</div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs ${isOnline ? "bg-green-500/10 text-green-700" : "bg-amber-500/10 text-amber-700"}`}
                >
                  {isOnline ? "Connected" : "Disconnected"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Auto-Sync Data</div>
                  <div className="text-sm text-muted-foreground">Automatically sync data when online</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Clear Offline Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
