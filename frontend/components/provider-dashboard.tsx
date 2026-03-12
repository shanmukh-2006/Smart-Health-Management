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
import {
  Search,
  Send,
  Users,
  FileText,
  Eye,
  Download,
} from "lucide-react"
import { requestService, documentService } from "@/lib/services"
import { BASE_URL } from "@/lib/api-config"

export function ProviderDashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [approvedDocs, setApprovedDocs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestEmail, setRequestEmail] = useState("")

  const fetchData = async () => {
    try {
      const [patientsData, docsData] = await Promise.all([
        requestService.getAll(),
        documentService.getAll(),
      ])
      setPatients(patientsData)
      setApprovedDocs(docsData)
    } catch (error) {
      console.error("Error fetching provider data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getFullUrl = (url: string) => {
    return url.startsWith("http") ? url : `${BASE_URL}${url}`
  }

  const handleView = (url: string) => {
    window.open(getFullUrl(url), "_blank")
  }

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = getFullUrl(url)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
      fetchData() // Refresh list
    } catch (error) {
      console.error("Request failed:", error)
    }
  }

  const approvedPatients = patients.filter((p) => p.status === "approved")

  if (isLoading) return <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse font-medium">Loading your patient records...</div>

  return (
    <div className="flex flex-col gap-6">
      {/* Search and request */}
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

      {/* Summary cards for provider */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">
              {patients.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <Send className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">
              {patients.filter((p: any) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Access
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground">
              {approvedPatients.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requested Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Requested Patients
          </CardTitle>
          <CardDescription>
            Patients you have requested access to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {searchQuery
                ? "No patients match your search"
                : "No patient requests yet"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Email
                  </TableHead>
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

      {/* Approved Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Approved Documents
          </CardTitle>
          <CardDescription>
            Documents from patients who have granted you access
          </CardDescription>
        </CardHeader>
        <CardContent>
            {approvedDocs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No approved documents yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedDocs.map((doc: any) => (
                  <TableRow key={doc.id || doc._id}>
                    <TableCell className="font-medium">
                      {doc.fileName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {doc.type}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {doc.size}
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!doc.url}
                          onClick={() => doc.url && handleView(doc.url)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View {doc.fileName}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!doc.url}
                          onClick={() =>
                            doc.url && handleDownload(doc.url, doc.fileName)
                          }
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">
                            Download {doc.fileName}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Access Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Patient Access</DialogTitle>
            <DialogDescription>
              Enter the patient&apos;s email address to request access to their
              health documents.
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
