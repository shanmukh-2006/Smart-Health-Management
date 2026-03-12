"use client"

import { useEffect, useState } from "react"
import { type Document } from "@/lib/types"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentsTable } from "@/components/documents-table"
import { documentService } from "@/lib/services"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getAll()
        setDocuments(data)
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocs()
  }, [])

  const handleUpload = async (file: File) => {
    try {
      const uploaded = await documentService.upload(file)
      setDocuments((prev) => [uploaded, ...prev])
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading documents...</div>

  return (
    <div className="flex flex-col gap-6">
      <DocumentUpload onUpload={handleUpload} />
      <DocumentsTable documents={documents} />
    </div>
  )
}
