"use client"

import { useAuth } from "@/lib/auth-context"
import { SummaryCards } from "@/components/summary-cards"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentsTable } from "@/components/documents-table"
import { AccessRequestsSection } from "@/components/access-requests"
import { ActivityLog } from "@/components/activity-log"
import { ProviderDashboardContent } from "@/components/provider-dashboard"
import { useState, useEffect } from "react"
import { type Document, type AccessRequest, type ActivityLogEntry } from "@/lib/types"
import { documentService, requestService, activityService } from "@/lib/services"

function PatientOverview() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [entries, setEntries] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [docsData, requestsData, activityData] = await Promise.all([
          documentService.getAll(),
          requestService.getAll(),
          activityService.getAll(),
        ])
        setDocuments(docsData)
        setRequests(requestsData)
        setEntries(activityData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleUpload = async (file: File) => {
    try {
      const uploaded = await documentService.upload(file)
      setDocuments((prev) => [uploaded, ...prev])
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length

  if (isLoading) return <div className="flex h-64 items-center justify-center text-sm text-muted-foreground animate-pulse">Loading dashboard...</div>

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards
        totalDocuments={documents.length}
        pendingRequests={pendingCount}
        approvedRequests={approvedCount}
      />
      <DocumentUpload onUpload={handleUpload} />
      <DocumentsTable documents={documents} />
      <AccessRequestsSection />
      <ActivityLog entries={entries} />
    </div>
  )
}

export default function DashboardOverview() {
  const { user } = useAuth()

  if (!user) return null

  if (user.role === "provider") {
    return <ProviderDashboardContent />
  }

  return <PatientOverview />
}
