"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Check, History } from "lucide-react"

interface ConflictResolutionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConflictResolutionModal({ isOpen, onClose }: ConflictResolutionModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<"local" | "remote">("remote")
  const { toast } = useToast()

  const handleResolve = () => {
    toast({
      title: "Conflict resolved",
      description: `You've selected the ${selectedVersion} version.`,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Sync Conflict Detected</DialogTitle>
          </div>
          <DialogDescription>
            This submission has been modified both locally and on the server. Please review the differences and choose
            which version to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="font-medium">Submission Details:</p>
            <p>Assignment: Introduction to Physics</p>
            <p>Student: John Doe</p>
            <p>Submitted: April 10, 2025</p>
          </div>

          <Tabs defaultValue="compare">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="local">Local Version</TabsTrigger>
              <TabsTrigger value="remote">Remote Version</TabsTrigger>
            </TabsList>

            <TabsContent value="compare" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Local Version</h3>
                    <Badge variant="outline" className="text-xs">
                      Modified: April 12, 2025, 10:23 AM
                    </Badge>
                  </div>
                  <div className="border rounded-md p-3 text-sm bg-amber-500/5 border-amber-500/20">
                    <p>
                      The kinetic energy of an object is directly proportional to its mass and the square of its
                      velocity.
                      <span className="bg-amber-200/30 dark:bg-amber-900/30 px-1">
                        This relationship is expressed as E = 1/2 mv², where E is the kinetic energy, m is the mass, and
                        v is the velocity.
                      </span>
                    </p>
                    <p className="mt-2">
                      <span className="bg-green-200/30 dark:bg-green-900/30 px-1">
                        The potential energy of an object in a gravitational field is given by E = mgh, where g is the
                        gravitational acceleration and h is the height.
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Remote Version</h3>
                    <Badge variant="outline" className="text-xs">
                      Modified: April 12, 2025, 11:45 AM
                    </Badge>
                  </div>
                  <div className="border rounded-md p-3 text-sm bg-blue-500/5 border-blue-500/20">
                    <p>
                      The kinetic energy of an object is directly proportional to its mass and the square of its
                      velocity.
                      <span className="bg-blue-200/30 dark:bg-blue-900/30 px-1">
                        This can be calculated using the formula E = 1/2 mv², where E is the kinetic energy, m is the
                        mass, and v is the velocity.
                      </span>
                    </p>
                    <p className="mt-2">
                      <span className="bg-red-200/30 dark:bg-red-900/30 px-1 line-through">
                        The potential energy depends on the position of the object.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedVersion === "local" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVersion("local")}
                    className="gap-1"
                  >
                    {selectedVersion === "local" && <Check className="h-3 w-3" />}
                    Select Local
                  </Button>
                  <Button
                    variant={selectedVersion === "remote" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVersion("remote")}
                    className="gap-1"
                  >
                    {selectedVersion === "remote" && <Check className="h-3 w-3" />}
                    Select Remote
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="local">
              <div className="border rounded-md p-4 mt-4 text-sm">
                <p>
                  The kinetic energy of an object is directly proportional to its mass and the square of its velocity.
                  This relationship is expressed as E = 1/2 mv², where E is the kinetic energy, m is the mass, and v is
                  the velocity.
                </p>
                <p className="mt-2">
                  The potential energy of an object in a gravitational field is given by E = mgh, where g is the
                  gravitational acceleration and h is the height.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant={selectedVersion === "local" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVersion("local")}
                  className="gap-1"
                >
                  {selectedVersion === "local" && <Check className="h-3 w-3" />}
                  Select Local
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="remote">
              <div className="border rounded-md p-4 mt-4 text-sm">
                <p>
                  The kinetic energy of an object is directly proportional to its mass and the square of its velocity.
                  This can be calculated using the formula E = 1/2 mv², where E is the kinetic energy, m is the mass,
                  and v is the velocity.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant={selectedVersion === "remote" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVersion("remote")}
                  className="gap-1"
                >
                  {selectedVersion === "remote" && <Check className="h-3 w-3" />}
                  Select Remote
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-muted/50 p-3 rounded-md flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-muted-foreground" />
            <span>View full version history (5 versions)</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResolve}>Resolve Conflict</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
