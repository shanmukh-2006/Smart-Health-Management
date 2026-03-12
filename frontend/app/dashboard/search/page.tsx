"use client"
import { useState, useEffect } from "react"
import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Send } from "lucide-react"
import { requestService } from "@/lib/services"
import { Spinner } from "@/components/ui/spinner"

export default function SearchPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestEmail, setRequestEmail] = useState("")

  const fetchPatients = async () => {
    try {
      const data = await requestService.getAll()
      setPatients(data)
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filteredPatients = patients.filter(
    (p) =>
      p.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRequestAccess = async () => {
    if (!requestEmail.trim()) return
    try {
      const patientName = requestEmail.split("@")[0].replace(/[._]/g, " ")
      await requestService.create({
        patientEmail: requestEmail,
        patientName: patientName.charAt(0).toUpperCase() + patientName.slice(1)
      })
      setRequestEmail("")
      setShowRequestDialog(false)
      fetchPatients() // Refresh
    } catch (error) {
      console.error("Request failed:", error)
    }
  }

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center text-muted-foreground font-medium animate-pulse">
      <Spinner className="mr-2" /> Searching for patients...
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowRequestDialog(true)}>
          <Send className="mr-2 h-4 w-4" />
          Request Access
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            {filteredPatients.length} patient(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No patients match your search" : "No patient requests yet"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id || patient._id}>
                    <TableCell className="font-medium">
                      {patient.patientName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {patient.patientEmail}
                    </TableCell>
                    <TableCell>{patient.requestDate}</TableCell>
                    <TableCell>
                      <StatusBadge status={patient.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Patient Access</DialogTitle>
            <DialogDescription>
              Enter the patient&apos;s email address to request access.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Input
              placeholder="patient@example.com"
              value={requestEmail}
              onChange={(e) => setRequestEmail(e.target.value)}
              type="email"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestAccess}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
