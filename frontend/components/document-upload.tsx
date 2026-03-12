"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Upload, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentUpload({
  onUpload,
}: {
  onUpload: (file: File) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        setSelectedFile(files[0])
      }
    },
    []
  )

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Drag and drop your health documents or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            aria-label="Select file to upload"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileUp className="h-6 w-6 text-primary" />
          </div>
          {selectedFile ? (
            <p className="text-sm font-medium text-foreground">
              {selectedFile.name}
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, PNG, JPG up to 10MB
              </p>
            </>
          )}
        </div>
        {selectedFile && (
          <Button onClick={handleUpload} className="mt-4 w-full">
            Upload {selectedFile.name}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
