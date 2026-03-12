"use client"

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
import { Eye, Download, FileText } from "lucide-react"
import { BASE_URL } from "@/lib/api-config"

export function DocumentsTable({ documents }: { documents: any[] }) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          My Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No documents uploaded yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id || doc._id}>
                  <TableCell className="font-medium">{doc.fileName}</TableCell>
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
  )
}
