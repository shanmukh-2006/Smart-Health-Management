"use client"

import { useState, useEffect } from "react"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShieldCheck } from "lucide-react"
import { requestService } from "@/lib/services"

export function AccessRequestsSection() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmAction, setConfirmAction] = useState<{
    id: string
    action: "approved" | "denied"
    providerName: string
  } | null>(null)

  const fetchRequests = async () => {
    try {
      const data = await requestService.getAll()
      setRequests(data)
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAction = async () => {
    if (!confirmAction) return
    try {
      await requestService.updateStatus(confirmAction.id, confirmAction.action)
      setConfirmAction(null)
      fetchRequests() // Refresh
    } catch (error) {
      console.error("Action failed:", error)
    }
  }

  if (isLoading) return <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">Loading access requests...</div>

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Access Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No access requests
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id || req._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{req.providerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.providerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{req.requestDate}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-emerald-600 text-emerald-50 hover:bg-emerald-700"
                              onClick={() =>
                                setConfirmAction({
                                  id: req.id || req._id,
                                  action: "approved",
                                  providerName: req.providerName,
                                })
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setConfirmAction({
                                  id: req.id || req._id,
                                  action: "denied",
                                  providerName: req.providerName,
                                })
                              }
                            >
                              Deny
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.action === "approved"
                ? "Approve Access"
                : "Deny Access"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.action === "approved"
                ? `Are you sure you want to grant ${confirmAction.providerName} access to your health documents?`
                : `Are you sure you want to deny ${confirmAction?.providerName} access to your health documents?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmAction?.action === "approved" ? "default" : "destructive"
              }
              className={
                confirmAction?.action === "approved"
                  ? "bg-emerald-600 text-emerald-50 hover:bg-emerald-700"
                  : ""
              }
              onClick={handleAction}
            >
              {confirmAction?.action === "approved" ? "Approve" : "Deny"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
